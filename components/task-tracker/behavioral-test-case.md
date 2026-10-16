# Behavioral Test Cases: Simple Task Tracker Application

## Specification References
- **Functional Spec:** `components/task-tracker/behavior.md`
- **Target Suite:** Acceptance / UI Functional Testing

---

## 1. Executive Test Suite Summary & Traceability Matrix

| Test Case ID | Business Rule Ref | Test Category | Execution Mode | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **BTC-HP-01** | `BR-01` | Happy Path | Automated | P0 |
| **BTC-HP-02** | `BR-01`, `BR-02` | Happy Path | Automated | P0 |
| **BTC-HP-03** | `BR-03` | Happy Path | Automated | P0 |
| **BTC-HP-04** | `BR-03` | Happy Path | Automated | P1 |
| **BTC-HP-05** | `BR-04` | Happy Path | Automated | P1 |
| **BTC-HP-06** | `BR-04` | Happy Path | Automated | P1 |
| **BTC-HP-07** | `BR-05` | Happy Path | Automated | P0 |
| **BTC-HP-08** | `BR-02`, `BR-06` | Happy Path | Automated | P2 |
| **BTC-NEG-01** | `BR-02`, `BR-06` | Negative | Automated | P0 |
| **BTC-NEG-02** | `BR-02`, `BR-06`, `EC-01` | Negative | Automated | P0 |
| **BTC-NEG-03** | `BR-02`, `BR-06`, `EC-02` | Negative | Automated | P1 |
| **BTC-NEG-04** | `BR-02`, `BR-06`, `EC-02` | Negative | Automated | P1 |
| **BTC-NEG-05** | `BR-07`, `EC-03` | Negative | Automated | P1 |
| **BTC-NEG-06** | `BR-07`, `EC-03` | Negative | Automated | P1 |
| **BTC-NEG-07** | `BR-05`, `EC-06` | Negative | Automated | P2 |
| **BTC-EDGE-01** | `BR-02`, `EC-08` | Edge Case | Automated | P1 |
| **BTC-EDGE-02** | `BR-04`, `EC-05` | Edge Case | Automated | P1 |
| **BTC-EDGE-03** | `BR-08`, `EC-09` | Edge Case | Automated | P0 |
| **BTC-EDGE-04** | `Section 6`, `EC-10` | Edge Case | Automated | P1 |
| **BTC-EDGE-05** | `BR-05`, `EC-06` | Edge Case | Automated | P1 |
| **BTC-EDGE-06** | `BR-02`, `BR-06`, `EC-07` | Edge Case | Automated | P0 |
| **BTC-EDGE-07** | `BR-04`, `EC-04` | Edge Case | Automated | P2 |
| **BTC-EDGE-08** | `BR-07` | Edge Case | Automated | P2 |

---

## 2. Happy Path Scenarios (BTC-HP)

### Scenario BTC-HP-01: Task List View Initial Rendering & Default Sorting
- **Traceability:** `BR-01`
- **Preconditions:** The user opens the Task Tracker application with pre-existing tasks stored in `localStorage`.
- **Given** the user navigates to the Task Tracker single-screen dashboard
- **And** the local storage contains 3 tasks created at different timestamps
- **When** the page initialization finishes
- **Then** the task list container should render all 3 task cards
- **And** each task card should display Title, Priority badge (`Low`, `Medium`, or `High`), Due Date, and Status toggle
- **And** tasks should be sorted in descending order by creation date (newest task first)
- **And** long task descriptions should truncate with a line-clamp ellipsis

---

### Scenario BTC-HP-02: Successful Task Creation with Valid Fields
- **Traceability:** `BR-01`, `BR-02`
- **Preconditions:** User is on the Task Tracker dashboard with the creation form open.
- **Given** the user enters "Prepare Q4 Financial Report" into the "Title" input field
- **And** the user enters "Include budget variance and revenue breakdown." into the "Description" field
- **And** the user selects "High" from the "Priority" dropdown
- **And** the user selects a valid date 3 days in the future for "Due Date"
- **When** the user clicks the "Add Task" button
- **Then** the system should validate all inputs successfully
- **And** a new task card titled "Prepare Q4 Financial Report" with "High" priority badge should appear at the top of the task list
- **And** the form inputs should reset to default values (Title empty, Description empty, Priority set to `Medium`, Due Date cleared)
- **And** a temporary toast message reading "Task created successfully" should be displayed

---

### Scenario BTC-HP-03: Toggle Task Status from Pending to Completed
- **Traceability:** `BR-03`
- **Preconditions:** A task titled "Submit Expense Report" exists with status `Pending`.
- **Given** the task "Submit Expense Report" is displayed in the task list with an unchecked status checkbox
- **When** the user clicks the checkbox for "Submit Expense Report"
- **Then** the task status should update to `Completed`
- **And** a visual strikethrough effect should instantly apply across the task title "Submit Expense Report"
- **And** the total completed task counter in the summary header should increment by 1

---

### Scenario BTC-HP-04: Toggle Task Status from Completed Back to Pending
- **Traceability:** `BR-03`
- **Preconditions:** A task titled "Audit Security Logs" exists with status `Completed`.
- **Given** the task "Audit Security Logs" is displayed in the task list with a checked status checkbox and strikethrough styling
- **When** the user clicks the checkbox for "Audit Security Logs" to uncheck it
- **Then** the task status should revert to `Pending`
- **And** the strikethrough effect across the task title should be removed
- **And** the total pending task counter in the summary header should increment by 1

---

### Scenario BTC-HP-05: Filtering Tasks by Status Tabs
- **Traceability:** `BR-04`
- **Preconditions:** The task list contains 2 `Pending` tasks and 2 `Completed` tasks.
- **Given** the user is viewing the task list under the default "All" filter tab
- **When** the user clicks the "Pending" status filter tab
- **Then** only the 2 `Pending` tasks should be visible in the task list
- **And** the 2 `Completed` tasks should be hidden
- **When** the user clicks the "Completed" status filter tab
- **Then** only the 2 `Completed` tasks should be visible in the task list
- **And** the 2 `Pending` tasks should be hidden

---

### Scenario BTC-HP-06: Real-Time Search by Task Title
- **Traceability:** `BR-04`
- **Preconditions:** The task list contains tasks titled "Update Documentation", "Fix Login Bug", and "Update Dependencies".
- **Given** the search input field is currently empty
- **When** the user types "Update" into the search input box
- **Then** the task list should dynamically filter in real time
- **And** only "Update Documentation" and "Update Dependencies" should remain visible in the task list
- **And** "Fix Login Bug" should be hidden from view

---

### Scenario BTC-HP-07: Successful Task Deletion via Accessible Modal
- **Traceability:** `BR-05`
- **Preconditions:** A task titled "Legacy Code Cleanup" exists in the task list.
- **Given** the user clicks the "Delete" button on the "Legacy Code Cleanup" task card
- **Then** an accessible confirmation modal dialog should pop up displaying "Are you sure you want to delete this task?"
- **When** the user clicks the "Confirm" button inside the modal dialog
- **Then** the modal dialog should close
- **And** the task "Legacy Code Cleanup" should animate out and be permanently removed from the task list and `localStorage`

---

### Scenario BTC-HP-08: Live Character Counter and Input Reset
- **Traceability:** `BR-02`, `BR-06`
- **Preconditions:** User is on the Task Tracker form panel.
- **Given** the Title character counter displays `0/50` and Description counter displays `0/500`
- **When** the user types a 25-character title into the "Title" field
- **Then** the Title helper text should immediately update to `25/50`
- **When** the user types a 100-character description into the "Description" field
- **Then** the Description helper text should immediately update to `100/500`
- **When** the form is submitted successfully
- **Then** both character counters should reset to `0/50` and `0/500` respectively

---

## 3. Negative & Error Scenarios (BTC-NEG)

### Scenario BTC-NEG-01: Submission with Empty Title Field
- **Traceability:** `BR-02`, `BR-06`
- **Preconditions:** User has left the "Title" field completely blank.
- **Given** the user leaves the "Title" input field empty
- **And** fills in a valid "Description" and "Due Date"
- **When** the user clicks the "Add Task" button
- **Then** form submission should be blocked
- **And** the "Title" input box border should turn red
- **And** an inline error hint reading "Task title cannot be blank." should be displayed beneath the input box
- **And** no new task should be added to the task list

---

### Scenario BTC-NEG-02: Submission with Whitespace-Only Title Field
- **Traceability:** `BR-02`, `BR-06`, `EC-01`
- **Preconditions:** User enters spaces into the title field.
- **Given** the user enters "     " (whitespace only) into the "Title" input field
- **When** the user clicks the "Add Task" button
- **Then** the system should trim leading and trailing whitespace
- **And** form submission should be blocked
- **And** an inline error hint reading "Task title cannot be blank." should be displayed beneath the "Title" input field

---

### Scenario BTC-NEG-03: Title Character Exceedance Handling
- **Traceability:** `BR-02`, `BR-06`, `EC-02`
- **Preconditions:** Title input field has a `maxlength="50"` attribute.
- **Given** the user attempts to type or paste a 60-character string into the "Title" input box
- **When** the input event processes
- **Then** the input value should be automatically truncated to the first 50 characters
- **And** the Title character counter should show `50/50`
- **And** no characters beyond line 50 should be accepted into the field

---

### Scenario BTC-NEG-04: Description Character Exceedance Handling
- **Traceability:** `BR-02`, `BR-06`, `EC-02`
- **Preconditions:** Description textarea has a `maxlength="500"` attribute.
- **Given** the user attempts to paste a 550-character string into the "Description" textarea
- **When** the paste event fires
- **Then** the textarea value should be automatically capped at 500 characters
- **And** the Description helper counter should indicate `500/500`

---

### Scenario BTC-NEG-05: Submission with Due Date Over 1 Year in the Past
- **Traceability:** `BR-07`, `EC-03`
- **Preconditions:** Current client date is `2026-10-07`.
- **Given** the user selects a due date of `2024-01-01` (more than 365 days in the past)
- **And** enters a valid task title
- **When** the user clicks the "Add Task" button
- **Then** form submission should be blocked
- **And** the "Due Date" input box border should turn red
- **And** an inline error reading "Due date must be between 1 year in the past and 5 years in the future." should appear beneath the date input field

---

### Scenario BTC-NEG-06: Submission with Due Date Over 5 Years in the Future
- **Traceability:** `BR-07`, `EC-03`
- **Preconditions:** Current client date is `2026-10-07`.
- **Given** the user enters a due date of `2032-12-31` (more than 1,825 days in the future)
- **And** enters a valid task title
- **When** the user clicks the "Add Task" button
- **Then** form submission should be blocked
- **And** the "Due Date" input box border should turn red
- **And** an inline error reading "Due date must be between 1 year in the past and 5 years in the future." should appear beneath the date input field

---

### Scenario BTC-NEG-07: Cancellation of Task Deletion Modal
- **Traceability:** `BR-05`, `EC-06`
- **Preconditions:** Delete confirmation modal is open for task "Important Meeting Notes".
- **Given** the delete confirmation modal dialog is active on screen
- **When** the user clicks the "Cancel" button (or clicks the modal background backdrop overlay)
- **Then** the modal dialog should close immediately
- **And** the task "Important Meeting Notes" should remain untouched in the task list

---

## 4. Edge Cases & Boundary Scenarios (BTC-EDGE)

### Scenario BTC-EDGE-01: Anti-Double Submission Lock Behavior
- **Traceability:** `BR-02`, `EC-08`
- **Preconditions:** User has filled out valid form inputs and is ready to submit.
- **Given** all form inputs are valid
- **When** the user rapidly double-clicks or multi-clicks the "Add Task" button
- **Then** the "Add Task" button should disable immediately on the very first click
- **And** a loading indicator should display on the button
- **And** exactly 1 task record should be created and added to state
- **And** the button should re-enable only after state mutation and form reset complete

---

### Scenario BTC-EDGE-02: Safe Real-Time Search with Regex Special Characters
- **Traceability:** `BR-04`, `EC-05`
- **Preconditions:** The task list contains tasks titled "Fix [Auth] Issue", "Test * wildcard", and "Normal Task".
- **Given** the search input field is empty
- **When** the user types regex special characters `[Auth]*?` into the search box
- **Then** the search handler should safely sanitize and escape the input query string
- **And** no JavaScript regex syntax errors or runtime exceptions should be thrown
- **And** only the task matching literal title "Fix [Auth] Issue" should be displayed in the list
- **And** the search input field UI should display `[Auth]*?` without modifying user-typed text

---

### Scenario BTC-EDGE-03: LocalStorage Failure & In-Memory Fallback Banner
- **Traceability:** `BR-08`, `EC-09`
- **Preconditions:** Browser `localStorage` is disabled (incognito mode strict policy) or throws `QuotaExceededError`.
- **Given** the application is initializing on page load
- **When** the storage test execution fails or catches a storage exception
- **Then** the application state manager should seamlessly switch to an in-memory session array
- **And** a persistent warning banner should render at the top of the viewport reading: "Local storage unavailable. Tasks will only persist during the current browser session."
- **And** full task creation, toggle, and search functionality should operate normally within the current session

---

### Scenario BTC-EDGE-04: Multi-Tab Real-Time State Synchronization
- **Traceability:** `Section 6`, `EC-10`
- **Preconditions:** The Task Tracker application is open simultaneously in Tab A and Tab B of the same browser.
- **Given** Tab A and Tab B display identical initial task lists
- **When** the user adds a new task "Sync Test Item" in Tab A
- **Then** `window.localStorage` should emit a `storage` event to Tab B
- **And** Tab B should receive the event and automatically refresh its task list view to render "Sync Test Item" in real time without a manual page reload

---

### Scenario BTC-EDGE-05: Keyboard Trapping and Accessibility in Delete Confirmation Modal
- **Traceability:** `BR-05`, `EC-06`
- **Preconditions:** The Task Deletion confirmation modal is active.
- **Given** the deletion modal is displayed on screen
- **When** the user presses the `Tab` key repeatedly
- **Then** focus should cycle exclusively between modal interactive elements ("Confirm" button, "Cancel" button, and Close icon) without escaping to background page elements
- **When** the user presses the `Escape` key
- **Then** the modal should close and retain the task item
- **When** the user focuses the "Confirm" button and presses the `Enter` key
- **Then** the modal should confirm deletion and permanently remove the task item

---

### Scenario BTC-EDGE-06: HTML and XSS Injection Sanitization
- **Traceability:** `BR-02`, `BR-06`, `EC-07`
- **Preconditions:** User attempts to inject script tags via input fields.
- **Given** the user enters `<script>alert('xss')</script>` as the task "Title"
- **And** enters `<img src=x onerror=alert('hack')>` as the "Description"
- **When** the user submits the task and views the newly generated task card
- **Then** the system should escape/sanitize the inputs prior to DOM rendering
- **And** no script or image error callbacks should execute
- **And** the text string should render safely as visible plain text content in the card

---

### Scenario BTC-EDGE-07: Empty Search and Filter Results State Display
- **Traceability:** `BR-04`, `EC-04`
- **Preconditions:** Task list contains 0 completed tasks, or search term matching 0 tasks.
- **Given** the user selects the "Completed" filter tab when no completed tasks exist
- **When** the view updates
- **Then** the task list container should render an Empty State graphic and message reading "No completed tasks found."
- **When** the user types "NonexistentTaskQuery" into the search box
- **Then** the list container should render an Empty State message reading "No tasks found matching your search. Try adjusting your query or filter."

---

### Scenario BTC-EDGE-08: Exact Boundary Testing for Due Date Range (-365 Days and +1,825 Days)
- **Traceability:** `BR-07`
- **Preconditions:** Current client date is `2026-10-07`.
- **Given** the user enters a due date exactly 365 days in the past (`2025-10-07`)
- **When** the user submits the task
- **Then** validation should pass and the task should be created successfully
- **Given** the user enters a due date exactly 1,825 days (5 years) in the future (`2031-10-07`)
- **When** the user submits the task
- **Then** validation should pass and the task should be created successfully
