---
name: Test Automation Execution Skill
description: CLI execution protocols, environment variable overrides, parallel worker configurations, and report parsing for Playwright test automation.
---

# Test Automation Execution Skill

Used by `@test-automation-executor` to run Playwright test suites cleanly across local and CI environments.

---

## 1. CLI Execution Command Matrix

| Scenario | Terminal Command | Artifact Outputs |
|----------|------------------|------------------|
| **Live Visual Headed Execution (Default)** | `npx playwright test --headed` | Interactive Live Browser & HTML Report |
| **Interactive Debugger UI Mode** | `npx playwright test --ui` | Playwright Interactive Dashboard |
| **Single Feature Spec (Headed)** | `npx playwright test e2e/tests/task-tracker.spec.ts --headed` | Filtered HTML Report & Live Browser |
| **CI / Silent Headless Execution** | `npx playwright test --workers=2 --reporter=html,json` | `results.json`, `trace.zip` |


---

## 2. Execution Result Parsing Protocol

When test runs complete, parse `playwright-report/results.json` to extract:
- Total Executed
- Passed Count
- Failed Test Scenarios (extract exact error line numbers and failing locators)
- Pass failing scenario details to `@test-automation-healer` if failures occur.
