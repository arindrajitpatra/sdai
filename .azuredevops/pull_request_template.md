# Pull Request Title
<!-- Format: [Feature/Bug/Refactor] Short feature description -->

## Executive Summary of Changes
- Briefly describe the business motivation and core code changes implemented in this Pull Request.
- Reference target feature folder: `components/<feature-name>/`

---

## ASDLC Specification Traceability & Gate Audit

| Phase | Spec Document | Included in PR? | Sign-off Status |
|-------|---------------|-----------------|------------------|
| Phase 1 | `behavior.md` | [ ] Yes [ ] N/A | Verified by BA |
| Phase 1 | `behavior-edge-case-review-report.md` | [ ] Yes [ ] N/A | Zero Critical Gaps |
| Phase 2 | `tech-spec.md` | [ ] Yes [ ] N/A | Verified by Tech Lead |
| Phase 2 | `devils-advocate-review-report.md` | [ ] Yes [ ] N/A | Risk Mitigations Addressed |
| Phase 2 | `behavioral-test-case.md` | [ ] Yes [ ] N/A | Verified by QA Lead |
| Phase 2 | `technical-test-case.md` | [ ] Yes [ ] N/A | Verified by QA Lead |

---

## Automated Verification & Verification Reports

- [ ] **Code Verifier Pass:** `code-verification-report.md` attached with 0 static analysis errors.
- [ ] **PR Review Pass:** `pr-review-report.md` attached; all blocking items resolved.
- [ ] **Self-Healing PR Verification:** Auto-remediation loop executed successfully; unit tests pass 100%.
- [ ] **UI & E2E Validation Pass:** `ui-validation-report.md` attached; Playwright E2E tests pass.

---

## Reviewer Checklist
- [ ] Code adheres to clean architecture principles (`dotnet-microservice-guidelines` / `ui-design-guidelines`).
- [ ] No hardcoded secrets, connection strings, or magic numbers (`configurable-variables-guidelines`).
- [ ] All public methods and REST endpoints have corresponding unit/integration tests.
- [ ] Database DDL migrations are idempotent and backward-compatible.
