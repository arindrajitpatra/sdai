---
name: Test Automation Handoff Contract
description: Standard JSON schemas and state contracts for handoffs between test automation agents (Planner -> Generator -> Executor -> Healer).
---

# Test Automation Handoff Contract Skill

Specifies state objects passed between Phase 5 sub-agents:

```json
{
  "featureId": "feature-auth-01",
  "planPath": "e2e/plans/auth-plan.json",
  "generatedTests": ["e2e/tests/auth.spec.ts"],
  "lastExecutionResult": {
    "status": "FAILED",
    "failedScenario": "BTC-HP-02",
    "errorTrace": "Timeout 5000ms exceeded waiting for locator('button#submit')"
  }
}
```
