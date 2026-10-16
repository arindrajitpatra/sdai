# Technical Test Cases: Simple Task Tracker Component

## Reference Specifications
- **Tech Spec Reference:** [tech-spec.md](file:///c:/Users/arind/OneDrive/Desktop/AI%20in%20SDLC/components/task-tracker/tech-spec.md)
- **Behavior Spec Reference:** [behavior.md](file:///c:/Users/arind/OneDrive/Desktop/AI%20in%20SDLC/components/task-tracker/behavior.md)
- **Target Component:** `components/task-tracker/`

---

## 1. API & Contract Test Cases

### Endpoint 1: `GET /api/v1/tasks`

#### Test Case TTC-API-01: Retrieve All Tasks (Default View)
- **Tech Spec Ref:** Section 2 (Endpoint 1) & `BR-01`
- **HTTP Method:** `GET`
- **Request Headers:**
  ```json
  {
    "Content-Type": "application/json",
    "X-Correlation-ID": "e0b968fa-1234-4b5a-90ab-56789abcdef0"
  }
  ```
- **Query Parameters:** None (Defaults to `status=All`)
- **Expected HTTP Code:** `200 OK`
- **Response Validation:**
  - Response matches `ApiResponse<List<TaskDto>>` standard envelope.
  - `success` is `true`.
  - `data` is an array of tasks sorted by `createdAt` descending.
  - `error` is `null`.
- **Database Assertion Query:**
  ```sql
  SELECT id, title, priority, due_date, status, created_at
  FROM tasks
  ORDER BY created_at DESC;
  ```
  - Verify returned array length and order match the query result set exactly.

#### Test Case TTC-API-02: Filter Tasks by Status (`Pending` / `Completed`)
- **Tech Spec Ref:** Section 2 (Endpoint 1) & `BR-04`
- **HTTP Method:** `GET`
- **Query Parameters:** `status=Pending`
- **Expected HTTP Code:** `200 OK`
- **Response Validation:**
  - `success` is `true`.
  - Every task item in `data` has `"status": "Pending"`.
- **Database Assertion Query:**
  ```sql
  SELECT COUNT(*) FROM tasks WHERE status = 'Pending';
  ```
  - Count matches `data.length`.

#### Test Case TTC-API-03: Real-Time Title Search with Special Regex Characters
- **Tech Spec Ref:** Section 2 (Endpoint 1), `BR-04`, `EC-05`
- **HTTP Method:** `GET`
- **Query Parameters:** `search=%5Btest%5D%2A%3F&status=All` (URL-encoded `[test]*?`)
- **Expected HTTP Code:** `200 OK`
- **Response Validation:**
  - `success` is `true`.
  - Escaped search query evaluates without throwing server-side regex evaluation exceptions.
- **Database Assertion Query:**
  ```sql
  SELECT COUNT(*) FROM tasks WHERE title ILIKE '%[test]*?%';
  ```

---

### Endpoint 2: `POST /api/v1/tasks`

#### Test Case TTC-API-04: Create Task with Valid Parameters
- **Tech Spec Ref:** Section 2 (Endpoint 2), `BR-02`, `BR-07`
- **HTTP Method:** `POST`
- **Request Headers:**
  ```json
  {
    "Content-Type": "application/json",
    "X-Correlation-ID": "a1b2c3d4-5678-90ab-cdef-1234567890ab"
  }
  ```
- **Request Body:**
  ```json
  {
    "title": "Quarterly Security Audit",
    "description": "Perform vulnerability scan and update compliance logs.",
    "priority": "High",
    "dueDate": "2026-11-01"
  }
  ```
- **Expected HTTP Code:** `201 Created`
- **Response Validation:**
  - `success` is `true`.
  - `data.id` is a valid non-empty UUID string.
  - `data.status` is defaulted to `"Pending"`.
  - `data.createdAt` and `data.updatedAt` are valid ISO timestamps.
- **Database Assertion Query:**
  ```sql
  SELECT id, title, description, priority, due_date, status
  FROM tasks
  WHERE title = 'Quarterly Security Audit';
  ```
  - Asserts exactly `1` record found with `priority = 'High'`, `status = 'Pending'`, and `due_date = '2026-11-01'`.

#### Test Case TTC-API-05: Create Task with Default Priority
- **Tech Spec Ref:** Section 2 (Endpoint 2) & `BR-02`
- **HTTP Method:** `POST`
- **Request Body:**
  ```json
  {
    "title": "Review PR #42",
    "dueDate": "2026-10-20"
  }
  ```
- **Expected HTTP Code:** `201 Created`
- **Response Validation:**
  - `data.priority` evaluates to `"Medium"`.
- **Database Assertion Query:**
  ```sql
  SELECT priority FROM tasks WHERE title = 'Review PR #42';
  ```
  - Returns `'Medium'`.

#### Test Case TTC-API-06: Validation Failure - Blank/Whitespace-Only Title
- **Tech Spec Ref:** Section 2 (Endpoint 2), `BR-06`, `EC-01`
- **HTTP Method:** `POST`
- **Request Body:**
  ```json
  {
    "title": "   ",
    "priority": "Low",
    "dueDate": "2026-10-15"
  }
  ```
- **Expected HTTP Code:** `400 Bad Request`
- **Response Validation:**
  - `success` is `false`.
  - `error.code` is `"VALIDATION_FAILED"`.
  - `error.details` contains an entry for `field: "title"` with message `"Task title cannot be blank or exceed 50 characters."`
- **Database Assertion Query:**
  ```sql
  SELECT COUNT(*) FROM tasks WHERE TRIM(title) = '';
  ```
  - Returns `0`.

#### Test Case TTC-API-07: Validation Failure - Title Exceeding Max Length (50 chars)
- **Tech Spec Ref:** Section 2 (Endpoint 2), `BR-02`, `BR-06`, `EC-02`
- **HTTP Method:** `POST`
- **Request Body:**
  ```json
  {
    "title": "This task title is excessively long and deliberately exceeds the maximum allowed length of fifty characters",
    "dueDate": "2026-10-15"
  }
  ```
- **Expected HTTP Code:** `400 Bad Request`
- **Response Validation:**
  - `success` is `false`.
  - `error.code` is `"VALIDATION_FAILED"`.
  - `error.details` contains field `"title"`.

#### Test Case TTC-API-08: Validation Failure - Description Exceeding Max Length (500 chars)
- **Tech Spec Ref:** Section 2 (Endpoint 2), `BR-02`, `BR-06`, `EC-02`
- **HTTP Method:** `POST`
- **Request Body:**
  ```json
  {
    "title": "Valid Title",
    "description": "<501 character string content generated for payload boundary testing...>",
    "dueDate": "2026-10-15"
  }
  ```
- **Expected HTTP Code:** `400 Bad Request`
- **Response Validation:**
  - `success` is `false`.
  - `error.details` contains field `"description"`.

#### Test Case TTC-API-09: Validation Failure - Due Date Out of Range (> 5 years future)
- **Tech Spec Ref:** Section 2 (Endpoint 2), `BR-07`, `EC-03`
- **HTTP Method:** `POST`
- **Request Body:**
  ```json
  {
    "title": "Far Future Task",
    "dueDate": "2035-01-01"
  }
  ```
- **Expected HTTP Code:** `400 Bad Request`
- **Response Validation:**
  - `success` is `false`.
  - `error.code` is `"VALIDATION_FAILED"`.
  - `error.details` contains entry for `field: "dueDate"` stating target boundary limits (-365 days to +1825 days).

---

### Endpoint 3: `PATCH /api/v1/tasks/{id}/status`

#### Test Case TTC-API-10: Toggle Task Status to `Completed`
- **Tech Spec Ref:** Section 2 (Endpoint 3), `BR-03`
- **HTTP Method:** `PATCH`
- **Path Parameter:** `id = 3fa85f64-5717-4562-b3fc-2c963f66afa6`
- **Request Body:**
  ```json
  {
    "status": "Completed"
  }
  ```
- **Expected HTTP Code:** `200 OK`
- **Response Validation:**
  - `success` is `true`.
  - `data.status` equals `"Completed"`.
  - `data.updatedAt` timestamp is updated to current time.
- **Database Assertion Query:**
  ```sql
  SELECT status, updated_at FROM tasks WHERE id = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
  ```
  - `status` returns `'Completed'`.

#### Test Case TTC-API-11: Status Update Nonexistent Task ID
- **Tech Spec Ref:** Section 2 (Endpoint 3)
- **HTTP Method:** `PATCH`
- **Path Parameter:** `id = 00000000-0000-0000-0000-000000000000`
- **Request Body:**
  ```json
  {
    "status": "Completed"
  }
  ```
- **Expected HTTP Code:** `404 Not Found`
- **Response Validation:**
  - `success` is `false`.
  - `error.code` equals `"TASK_NOT_FOUND"`.

---

### Endpoint 4: `DELETE /api/v1/tasks/{id}`

#### Test Case TTC-API-12: Delete Task Entry Successfully
- **Tech Spec Ref:** Section 2 (Endpoint 4), `BR-05`
- **HTTP Method:** `DELETE`
- **Path Parameter:** `id = 3fa85f64-5717-4562-b3fc-2c963f66afa6`
- **Expected HTTP Code:** `200 OK`
- **Response Validation:**
  - `success` is `true`.
  - `data.message` equals `"Task permanently deleted."`
- **Database Assertion Query:**
  ```sql
  SELECT COUNT(*) FROM tasks WHERE id = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
  ```
  - Asserts returned count equals `0`.

---

## 2. Integration & Database Transaction Test Cases

### Test Case TTC-INT-01: EF Core Transaction Rollback on Exception
- **Tech Spec Ref:** Section 3 (DDL & Entity Mapping)
- **Precondition:** Intercept or inject failure inside `TaskService.cs` repository persistence layer during task creation (e.g. database timeout or simulated `DbUpdateException`).
- **Action:** Execute `POST /api/v1/tasks` with valid creation payload.
- **Expected Outcome:**
  - HTTP `500 Internal Server Error` returned with envelope structure.
  - Database unit of work rolls back transaction completely.
- **Database Assertion Query:**
  ```sql
  SELECT COUNT(*) FROM tasks WHERE title = 'Transactional Test Task';
  ```
  - Query returns `0`.

### Test Case TTC-INT-02: Check Constraint Enforcement on Database Layer
- **Tech Spec Ref:** Section 3 (PostgreSQL DDL constraints `chk_tasks_priority`, `chk_tasks_status`)
- **Action:** Attempt direct SQL insertion bypassing API validation:
  ```sql
  INSERT INTO tasks (title, priority, due_date, status) 
  VALUES ('Bypassed Task', 'InvalidPriority', CURRENT_DATE, 'Pending');
  ```
- **Expected Outcome:** Database engine raises check constraint violation `chk_tasks_priority`. Record insertion is rejected.

---

## 3. Non-Functional & Performance Assertions

### Test Case TTC-PERF-01: API Endpoint Throughput & Latency SLA
- **Tech Spec Ref:** Section 2 & 4
- **Load Profile:** 50 Concurrent Virtual Users (VUs) issuing mixed requests (`80% GET`, `15% POST`, `5% PATCH`) for 60 seconds.
- **Pass Criteria:**
  - **Average Latency:** < 100ms
  - **p95 Latency:** < 200ms
  - **p99 Latency:** < 350ms
  - **Error Rate:** < 0.01% (zero unexpected 500 errors)

### Test Case TTC-PERF-02: Safe Regex Search ReDoS Defense Assertion
- **Tech Spec Ref:** Section 5 (`utils/regex.js`) & `EC-05`
- **Action:** Send complex nested quantifier search term `(a+)+$` against 10,000 seeded task records.
- **Pass Criteria:**
  - Regex escaping utility escapes special characters prior to evaluation.
  - Search response returned in < 50ms without CPU spike or catastrophic backtracking (ReDoS).
