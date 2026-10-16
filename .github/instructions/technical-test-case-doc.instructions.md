---
description: Comprehensive standards for authoring Phase 2 technical-test-case.md documents.
---

# Technical Test Case Document Instructions (`technical-test-case.md`)

When generating or auditing `technical-test-case.md` in Phase 2 of the ASDLC, GitHub Copilot and technical QA leads MUST follow these guidelines to establish low-level API, database, integration, and performance test suites.

---

## 1. Technical Test Scope & Standards

1. **API & Contract Assertion:** Validate exact HTTP status codes (200, 201, 400, 401, 403, 404, 500), payload structures, and header values.
2. **Database State Verification:** Specify post-execution database query checks to confirm data persistence, transactional integrity, and rollback behavior.
3. **Performance SLAs:** Define explicit latency targets (e.g. p95 < 200ms under 50 concurrent virtual users).

---

## 2. Standard Structure

```markdown
# Technical Test Cases: [Feature Name]

## Reference Specifications
- **Tech Spec Reference:** `tech-spec.md`
- **Behavior Spec Reference:** `behavior.md`

---

## 1. API & Contract Test Cases

### Test Case TTC-API-01: Endpoint `POST /api/v1/resource` Valid Payload
- **Tech Spec Ref:** Section 2 (API Contracts)
- **HTTP Method:** `POST`
- **Request Headers:** `{ "Authorization": "Bearer <ValidToken>", "Content-Type": "application/json" }`
- **Request Body:**
  ```json
  { "title": "Valid Record", "categoryId": 1 }
  ```
- **Expected HTTP Code:** `201 Created`
- **Response Validation:** Response body contains `id > 0` and `success: true`.
- **Database Assertion Query:**
  `SELECT COUNT(*) FROM feature_records WHERE title = 'Valid Record';` -> Returns `1`.

### Test Case TTC-API-02: Endpoint `POST /api/v1/resource` Schema Validation Error
- **Request Body:** `{ "title": "", "categoryId": -1 }`
- **Expected HTTP Code:** `400 Bad Request`
- **Response Validation:** Error code matches `"VALIDATION_FAILED"`.

---

## 2. Integration & Database Transaction Test Cases

### Test Case TTC-INT-01: DB Transaction Rollback on Downstream Service Exception
- **Precondition:** Mock downstream notification service to throw `500 Internal Server Error`.
- **Action:** Dispatch resource creation call.
- **Expected Outcome:** Transaction rolled back; DB query returns `0` records inserted.

---

## 3. Non-Functional & Performance Assertions

### Test Case TTC-PERF-01: API Endpoint Throughput & Latency SLA
- **Load Profile:** 50 Concurrent Virtual Users for 60 seconds.
- **Pass Criteria:**
  - Average latency < 150ms.
  - 95th Percentile (p95) latency < 250ms.
  - Error rate < 0.01%.
```
