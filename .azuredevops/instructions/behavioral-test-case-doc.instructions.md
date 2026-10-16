---
description: Detailed guidelines for generating Phase 2 behavioral-test-case.md documents from behavior.md.
---

# Behavioral Test Case Document Instructions (`behavioral-test-case.md`)

When generating or auditing `behavioral-test-case.md` in Phase 2 of the ASDLC, GitHub Copilot and QA agents MUST follow these instructions to produce deterministic, Gherkin-formatted test case specifications traceable directly to `behavior.md`.

---

## 1. Governance & Traceability Standards

1. **100% Requirement Coverage:** Every business rule (`BR-XX`) defined in `behavior.md` MUST have at least one corresponding Happy Path scenario, one Negative scenario, and relevant Edge Case scenarios.
2. **Gherkin Compliance:** All scenarios MUST be written in strict **Given-When-Then** format to allow automatic parsing by Playwright automation generators and UI validation agents.
3. **Deterministic Assertions:** Assertions MUST specify exact observable UI outcomes, state changes, error messages, and URL navigation changes. Never write vague assertions like "System works correctly".

---

## 2. Standard Document Structure

```markdown
# Behavioral Test Cases: [Feature Name]

## Specification References
- **Functional Spec:** `behavior.md`
- **Target Suite:** Acceptance / UI Functional Testing

---

## 1. Executive Test Suite Summary & Traceability Matrix

| Test Case ID | Business Rule Ref | Test Category | Execution Mode | Priority |
|--------------|-------------------|---------------|----------------|----------|
| BTC-HP-01    | BR-01             | Happy Path    | Automated      | P0       |
| BTC-NEG-01   | BR-01, BR-04      | Negative      | Automated      | P1       |
| BTC-EDGE-01  | BR-07             | Edge Case     | Automated      | P2       |

---

## 2. Happy Path Scenarios (BTC-HP)

### Scenario BTC-HP-01: Successful Feature Submission with Valid Data
- **Traceability:** `BR-01`, `BR-02`
- **Preconditions:** User is logged in as `StandardUser` and navigated to feature page URL `/feature-path`.
- **Given** the user is on the Feature Form page
- **And** all form fields are initialized with default state
- **When** the user fills in "Title" with "Sample Title"
- **And** the user selects "Option A" from the "Category" dropdown
- **And** the user clicks the "Submit" button
- **Then** a loading spinner overlay should appear
- **And** the system should display a green success notification reading "Record created successfully"
- **And** the page URL should change to `/feature-path/view/123`

---

## 3. Negative & Error Scenarios (BTC-NEG)

### Scenario BTC-NEG-01: Submission with Empty Required Fields
- **Traceability:** `BR-01`, `BR-05`
- **Preconditions:** User is on Feature Form page.
- **Given** the user leaves the "Title" input field empty
- **When** the user clicks the "Submit" button
- **Then** form submission should be blocked
- **And** the "Title" input box border should turn red
- **And** an inline error hint reading "Title is required" should be displayed beneath the input box
- **And** no API request should be dispatched to the server

---

## 4. Edge Cases & Boundary Scenarios (BTC-EDGE)

### Scenario BTC-EDGE-01: Submission under High Latency / Network Timeout
- **Traceability:** `BR-07`
- **Preconditions:** Network latency throttled to 5000ms.
- **Given** the user submits valid form data
- **When** the server response exceeds the 3000ms timeout threshold
- **Then** the UI should display a user-friendly retry banner reading "Request timed out. Please try again."
- **And** the "Submit" button should re-enable without data loss
```

---

## 3. Verification Criteria
- [ ] Every scenario has a unique ID (`BTC-HP-XX`, `BTC-NEG-XX`, `BTC-EDGE-XX`).
- [ ] Gherkin keywords (`Given`, `When`, `Then`, `And`) are strictly capitalized and formatted.
- [ ] Traceability matrix lists 100% of `BR-XX` rules from `behavior.md`.
