---
name: Test Automation Healing Skill
description: Self-healing locator repair protocols, DOM tree inspection rules, and automatic test script update procedures.
---

# Test Automation Healing Skill

Equips `@test-automation-healer` to inspect failing Playwright trace logs and auto-repair broken selectors.

---

## 1. Selector Auto-Healing Decision Matrix

```mermaid
flowchart TD
    Fail["Playwright Test Failed (Timeout / Locator Not Found)"] --> InspectTrace["1. Read trace.zip & HTML Snapshot"]
    InspectTrace --> CheckRole{"Does element have ARIA role?"}
    CheckRole -->|Yes| HealRole["Replace with page.getByRole(role, { name })"]
    CheckRole -->|No| CheckTestId{"Does element have data-testid?"}
    CheckTestId -->|Yes| HealTestId["Replace with page.getByTestId(id)"]
    CheckTestId -->|No| HealText["Replace with page.getByText(text)"]
    HealRole & HealTestId & HealText --> ReTest["2. Re-run npx playwright test"]
    ReTest -->|Pass| CommitFix["3. Commit Repaired Page Object"]
```

---

## 2. Auto-Healing Audit Log Entry Format

When a selector is healed, append an audit entry to `e2e/healing-audit.log`:

```text
[2026-10-07T21:30:00Z] HEALED: components/task-tracker/e2e/pages/task-tracker.page.ts
- Old Locator: page.locator('button#btn-submit-task-v1')
- New Locator: page.getByRole('button', { name: 'Add Task' })
- Failure Cause: Button ID changed from #btn-submit-task-v1 to #btn-submit-task-v2
- Verification: Re-test passed in 1,240ms.
```
