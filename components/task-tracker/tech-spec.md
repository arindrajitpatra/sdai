# Technical Specification: Simple Task Tracker Application

## Metadata
- **Behavior Spec Reference:** `components/task-tracker/behavior.md`
- **Target Microservice/Component:** `components/task-tracker/`
- **Architecture Style:** ASP.NET Core Clean Architecture (REST Web API) + HTML5/ES2022 Modular Frontend
- **Design Guidelines:** `.github/skills/dotnet-microservice-guidelines/SKILL.md`, `.github/skills/configurable-variables-guidelines/SKILL.md`, `.github/skills/ui-design-guidelines/SKILL.md`

---

## 1. Component Architecture & Directory Structure

```text
components/task-tracker/
├── src/
│   ├── Backend/
│   │   ├── Controllers/
│   │   │   └── TasksController.cs             # REST API Controller handling endpoints & status codes
│   │   ├── Services/
│   │   │   ├── ITaskService.cs                 # Domain Service Interface
│   │   │   └── TaskService.cs                  # Business logic, validation rules & date boundary checks
│   │   ├── Repositories/
│   │   │   ├── ITaskRepository.cs              # Data Access Interface
│   │   │   └── TaskRepository.cs              # EF Core DbContext repository implementation
│   │   ├── Options/
│   │   │   └── TaskTrackerOptions.cs           # Strongly-typed options pattern configuration
│   │   └── Models/
│   │       ├── Entities/
│   │       │   └── TaskItem.cs                 # EF Core Entity definition
│   │       └── Dtos/
│   │           ├── TaskDto.cs                  # Task response transfer object
│   │           ├── CreateTaskRequest.cs        # Request DTO for task creation
│   │           ├── UpdateTaskStatusRequest.cs  # Request DTO for status update
│   │           └── ApiResponse.cs              # Standardized API envelope & error models
│   └── Frontend/
│       ├── index.html                          # Single-page semantic dashboard structure
│       ├── css/
│       │   └── styles.css                      # Modern CSS tokens, responsive layout, animations
│       └── js/
│           ├── app.js                          # Application entry point & DOM bindings
│           ├── state.js                        # Task state management & multi-tab storage handler
│           ├── validator.js                    # Client-side form validation & date range checks
│           ├── utils/
│           │   └── regex.js                    # Safe regex special character escaping helper
│           └── components/
│               ├── taskForm.js                 # Task input form with live character counters
│               ├── taskList.js                 # Task card grid rendering & strikethrough styling
│               ├── filterBar.js                # Search input & status filter tab triggers
│               └── deleteModal.js              # Accessible modal dialog with focus trap
└── tests/
    └── Unit/
        ├── Backend/
        │   ├── TaskServiceTests.cs             # xUnit business rule validation & boundary tests
        │   └── TasksControllerTests.cs         # xUnit controller response envelope tests
        └── Frontend/
            ├── validator.test.js               # Form input & date range validation logic tests
            └── regex.test.js                   # Regex escaping utility unit tests
```

---

## 2. API Contracts & Endpoint Definitions

### Common Request Headers
- `Authorization`: `Bearer <JWT_TOKEN>` (Optional/Extensible header)
- `Content-Type`: `application/json`
- `X-Correlation-ID`: `<UUID>` (Traceability ID)

### Standard Response Envelope (`ApiResponse<T>`)
All endpoints return responses wrapped in the standardized envelope defined in `.github/skills/dotnet-microservice-guidelines/SKILL.md`:

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

Error Response Format:
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "STRING_ERROR_CODE",
    "message": "Human-readable error summary",
    "details": [
      {
        "field": "title",
        "issue": "Specific field error description"
      }
    ]
  }
}
```

---

### Endpoint 1: `GET /api/v1/tasks`
- **Summary:** Retrieves all task items with optional status filtering and title search.
- **Requirement Ref:** `BR-01`, `BR-04`, `EC-04`, `EC-05`
- **Query Parameters:**
  - `status` (optional, string): Filter by `All` | `Pending` | `Completed` (default: `All`).
  - `search` (optional, string): Search query matched against task title.

#### 200 OK Response Schema
```json
{
  "success": true,
  "data": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "title": "Submit Q4 Budget Report",
      "description": "Prepare expense breakdown and upload sheet.",
      "priority": "High",
      "dueDate": "2026-10-15",
      "status": "Pending",
      "createdAt": "2026-10-07T22:00:00Z",
      "updatedAt": "2026-10-07T22:00:00Z"
    }
  ],
  "error": null
}
```

---

### Endpoint 2: `POST /api/v1/tasks`
- **Summary:** Creates a new task item.
- **Requirement Ref:** `BR-02`, `BR-06`, `BR-07`, `EC-01`, `EC-02`, `EC-03`, `EC-07`, `EC-08`

#### Request Body Schema (JSON)
```json
{
  "title": "Submit Q4 Budget Report",
  "description": "Prepare expense breakdown and upload sheet.",
  "priority": "High",
  "dueDate": "2026-10-15"
}
```
*Validation Rules:*
- `title`: String, required, non-empty after trim, min length 1, max length 50.
- `description`: String, optional, max length 500.
- `priority`: String enum (`Low`, `Medium`, `High`), default `Medium`.
- `dueDate`: String ISO date (`YYYY-MM-DD`), required, must be within -365 days to +1825 days from current date.

#### 201 Created Response Schema
```json
{
  "success": true,
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "title": "Submit Q4 Budget Report",
    "description": "Prepare expense breakdown and upload sheet.",
    "priority": "High",
    "dueDate": "2026-10-15",
    "status": "Pending",
    "createdAt": "2026-10-07T22:00:00Z",
    "updatedAt": "2026-10-07T22:00:00Z"
  },
  "error": null
}
```

#### 400 Bad Request Response Schema
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Task creation failed due to invalid input fields.",
    "details": [
      {
        "field": "title",
        "issue": "Task title cannot be blank or exceed 50 characters."
      },
      {
        "field": "dueDate",
        "issue": "Due date must be between 1 year in the past and 5 years in the future."
      }
    ]
  }
}
```

---

### Endpoint 3: `PATCH /api/v1/tasks/{id}/status`
- **Summary:** Toggles or sets task status (`Pending` <-> `Completed`).
- **Requirement Ref:** `BR-03`

#### Request Body Schema (JSON)
```json
{
  "status": "Completed"
}
```

#### 200 OK Response Schema
```json
{
  "success": true,
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "title": "Submit Q4 Budget Report",
    "description": "Prepare expense breakdown and upload sheet.",
    "priority": "High",
    "dueDate": "2026-10-15",
    "status": "Completed",
    "createdAt": "2026-10-07T22:00:00Z",
    "updatedAt": "2026-10-07T22:01:30Z"
  },
  "error": null
}
```

#### 404 Not Found Response Schema
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "TASK_NOT_FOUND",
    "message": "Task with ID '3fa85f64-5717-4562-b3fc-2c963f66afa6' was not found.",
    "details": []
  }
}
```

---

### Endpoint 4: `DELETE /api/v1/tasks/{id}`
- **Summary:** Permanently removes a task item.
- **Requirement Ref:** `BR-05`, `EC-06`

#### 200 OK Response Schema
```json
{
  "success": true,
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "message": "Task permanently deleted."
  },
  "error": null
}
```

---

## 3. Data Model & Database DDL

### PostgreSQL Database DDL
```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(50) NOT NULL,
    description VARCHAR(500) NULL,
    priority VARCHAR(10) NOT NULL DEFAULT 'Medium',
    due_date DATE NOT NULL,
    status VARCHAR(15) NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_tasks_priority CHECK (priority IN ('Low', 'Medium', 'High')),
    CONSTRAINT chk_tasks_status CHECK (status IN ('Pending', 'Completed'))
);

-- Index for status filtering and sorting optimization
CREATE INDEX idx_tasks_status_created_at ON tasks (status, created_at DESC);

-- Index for title search optimization
CREATE INDEX idx_tasks_title ON tasks (title);
```

### C# EF Core Entity Model (`TaskItem.cs`)
```csharp
namespace TaskTracker.Models.Entities
{
    public class TaskItem
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Priority { get; set; } = "Medium";
        public DateTime DueDate { get; set; }
        public string Status { get; set; } = "Pending";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
```

---

## 4. Configurable Variables & Options Pattern

### `TaskTrackerOptions.cs`
```csharp
namespace TaskTracker.Options
{
    public class TaskTrackerOptions
    {
        public const string SectionName = "TaskTracker";

        public int MaxTitleLength { get; set; } = 50;
        public int MaxDescriptionLength { get; set; } = 500;
        public int PastDueDateDaysLimit { get; set; } = 365;
        public int FutureDueDateDaysLimit { get; set; } = 1825;
        public string DefaultPriority { get; set; } = "Medium";
        public string ConnectionString { get; set; } = string.Empty;
    }
}
```

### `appsettings.json` Configuration
```json
{
  "TaskTracker": {
    "MaxTitleLength": 50,
    "MaxDescriptionLength": 500,
    "PastDueDateDaysLimit": 365,
    "FutureDueDateDaysLimit": 1825,
    "DefaultPriority": "Medium"
  },
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=TaskTrackerDb;Username=postgres;Password=secret"
  }
}
```

---

## 5. Frontend Architecture & UI Component Specification

### Component Architecture & State Machine

```text
┌────────────────────────────────────────────────────────┐
│                   App Dashboard Root                   │
│  - Storage Fallback Banner (BR-08 / EC-09)             │
│  - Task Summary Header (Total, Pending, Completed)     │
└──────────────────────────┬─────────────────────────────┘
                           │
         ┌─────────────────┴─────────────────┐
         ▼                                   ▼
┌──────────────────┐               ┌──────────────────┐
│  Task Form View  │               │ Filter Bar View  │
│  (BR-02, BR-06,  │               │ (BR-04, EC-05)   │
│   BR-07, EC-01..3│               └─────────┬────────┘
└──────────────────┘                         │
                                             ▼
                                   ┌──────────────────┐
                                   │  Task List View  │
                                   │ (BR-01, BR-03)   │
                                   └─────────┬────────┘
                                             │
                                             ▼
                                   ┌──────────────────┐
                                   │ Accessible Modal │
                                   │ Delete Dialog    │
                                   │ (BR-05, EC-06)   │
                                   └──────────────────┘
```

### UI Component Guidelines & Accessibility (WCAG 2.1 AA)
1. **Form Validation Timing:**
   - Validation checks execute on form submit (`onSubmit`).
   - Red inline error labels appear directly beneath target input fields with `aria-live="polite"`.
   - Error styles clear dynamically as user types (`onInput`).
2. **Accessible Delete Modal Dialog (`deleteModal.js`):**
   - Modal container has `role="dialog"`, `aria-modal="true"`, and `aria-labelledby="modal-title"`.
   - Focus is locked within the dialog using keyboard trap (`Tab`, `Shift+Tab`).
   - Keypress bindings: `Escape` key closes modal (`Cancel`), `Enter` confirms deletion.
3. **Multi-Tab State Synchronization (`state.js`):**
   - Application subscribes to `window.addEventListener('storage', handleStorageEvent)`.
   - Changes in `localStorage` update task state across open browser tabs automatically (`EC-10`).
4. **Local Storage Fallback Handler (`state.js`):**
   - On init, system attempts a write/delete test on `localStorage`.
   - If disabled/Incognito or `QuotaExceededError` occurs, seamlessly switches to in-memory session storage array and displays top warning banner: *"Local storage unavailable. Tasks will only persist during the current browser session."* (`BR-08`, `EC-09`).

---

## 6. Implementation Micro-Tasks Breakdown

Sequential checklist for `spec-to-code.agent.md`:

- [x] **Task 1: Backend Configuration & Data Layer**
  - Create `TaskItem.cs` entity model and database context mapping in `src/Backend/Models/Entities/`.
  - Create PostgreSQL DDL migration script with indexes (`idx_tasks_status_created_at`, `idx_tasks_title`) and constraints.
  - Implement `TaskTrackerOptions.cs` options pattern class and register in `Program.cs`.

- [x] **Task 2: Backend Repositories & Domain Services**
  - Define `ITaskRepository.cs` and implement `TaskRepository.cs` using EF Core async operations.
  - Define `ITaskService.cs` and implement `TaskService.cs` containing business rules:
    - Title required, non-whitespace, max 50 chars (`BR-02`, `BR-06`, `EC-01`).
    - Description max 500 chars (`BR-02`, `BR-06`).
    - Due Date boundary check (-365 days to +1825 days) (`BR-07`, `EC-03`).
    - Status toggle logic (`BR-03`).

- [x] **Task 3: Backend REST Controllers & Envelope Formatting**
  - Implement `ApiResponse<T>` envelope model in `src/Backend/Models/Dtos/ApiResponse.cs`.
  - Implement `TasksController.cs` with routes: `GET /api/v1/tasks`, `POST /api/v1/tasks`, `PATCH /api/v1/tasks/{id}/status`, `DELETE /api/v1/tasks/{id}`.
  - Apply OpenAPI documentation annotations and exact status codes (200, 201, 400, 404).

- [x] **Task 4: Backend xUnit Unit Testing Suite**
  - Create `TaskServiceTests.cs` covering 100% of domain validation rules and date range boundary scenarios (`BR-02`, `BR-06`, `BR-07`, `EC-01`, `EC-03`).
  - Create `TasksControllerTests.cs` verifying response envelope structure for success and failure outcomes.

- [x] **Task 5: Frontend Utilities & Storage Engine**
  - Build `utils/regex.js` to escape regex special characters (`[`, `*`, `?`, `\`, etc.) (`BR-04`, `EC-05`).
  - Build `state.js` featuring `localStorage` detection, in-memory session fallback, top persistent warning banner trigger, and multi-tab `storage` event broadcast/listener (`BR-08`, `EC-09`, `EC-10`).
  - Build `validator.js` with client-side form rules, title whitespace trimming, character length caps, and date boundary checks (`BR-06`, `BR-07`).

- [x] **Task 6: Frontend UI Component Implementation**
  - Construct `index.html` structure with semantic tags, ARIA attributes, search input, and summary header (`BR-01`).
  - Build `styles.css` with CSS variables, priority badges, strikethrough styling (`.completed-task`), submit button disabled loading states, and modal animations.
  - Build `taskForm.js` with live character counters (`0/50`, `0/500`), submit button double-click lock, and dynamic inline error rendering (`BR-02`, `BR-06`, `EC-08`).
  - Build `taskList.js` & `filterBar.js` for dynamic card rendering, status filtering (`All`, `Pending`, `Completed`), and title search (`BR-01`, `BR-03`, `BR-04`, `EC-04`).
  - Build `deleteModal.js` with WCAG 2.1 AA accessible keyboard focus trap, `Escape` key cancel, and `Enter` key confirm handlers (`BR-05`, `EC-06`).

- [x] **Task 7: Frontend Unit Testing Suite & E2E Validation**
  - Create `regex.test.js` verifying regex character escaping.
  - Create `validator.test.js` verifying form submission validation timing and date range constraints.
  - Verify complete end-to-end user workflows against all `BR-01` through `BR-08` business rules and edge cases `EC-01` through `EC-10`.
