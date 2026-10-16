# Domain Components Architecture & Autonomous Agent Directives

The `components/` directory is the central housing location for feature modules, microservices, domain components, and UI packages developed under the **Agentic Software Development Lifecycle (ASDLC)**.

---

## 1. Directory Layout & Module Isolation Standards

Each feature component folder inside `components/` must be completely self-contained and structured as follows:

```text
components/<feature-name>/
├── behavior.md                           # Phase 1: Functional Specification & Requirements
├── behavior-edge-case-review-report.md    # Phase 1: Edge-case audit report
├── tech-spec.md                          # Phase 2: Technical Design & Micro-task breakdown
├── devils-advocate-review-report.md      # Phase 2: Architecture risk audit report
├── behavioral-test-case.md              # Phase 2: Acceptance & Gherkin test scenarios
├── technical-test-case.md               # Phase 2: API, DB, and performance test scenarios
├── code-verification-report.md           # Phase 4: Static & contract verification report
├── pr-review-report.md                  # Phase 4: Code review report
├── ui-validation-report.md              # Phase 5: UI & E2E execution report
├── src/                                 # Phase 3: Application source code
│   ├── controllers/ / api/
│   ├── services/ / domain/
│   ├── data/ / repositories/
│   └── models/ / dtos/
├── tests/                               # Phase 3: Unit and Integration Test Suites
│   ├── Unit/
│   └── Integration/
└── e2e/                                 # Phase 5: Playwright TypeScript Automation
    ├── pages/
    └── tests/
```

---

## 2. Mandatory Directives for Autonomous Agents

### A. Spec-Driven Code Generation (`spec-to-code.agent.md`)
1. **Zero Unspec Code:** Agents MUST NOT invent business logic, database tables, or REST routes that are not explicitly documented in `tech-spec.md` or `behavior.md`.
2. **Deterministic Task Resolution:** Read the `Implementation Micro-Tasks Breakdown` section of `tech-spec.md` and complete tasks sequentially.
3. **Mandatory Build & Test Loop:** After writing code for a micro-task, run compilation and unit test commands. Fix any errors immediately before proceeding to the next task.

### B. Code Quality & Architecture Skills
1. **.NET / C# Code:** Must conform to `.github/skills/dotnet-microservice-guidelines/SKILL.md`. Use async/await for all I/O operations, inject configurations via `IOptions<T>`, and return standard API envelope responses.
2. **Frontend UI Code:** Must conform to `.github/skills/ui-design-guidelines/SKILL.md`. Ensure full WCAG 2.1 AA accessibility, semantic HTML markup, responsive grid layouts, and user loading/error state indicators.
3. **Configuration & Secrets:** Must conform to `.github/skills/configurable-variables-guidelines/SKILL.md`. Never hardcode API keys, passwords, or connection strings into source files.

### C. Self-Healing & Verification Directives
1. **Self-Healing PR (`self-healing-pr.agent.md`):** Inspect exact stack traces and line numbers before modifying code. Apply surgical fixes without altering existing passing functionality. Max 3 self-healing retry attempts allowed.
2. **Test Automation (`test-automation-coordinator.agent.md`):** Generate Playwright TypeScript tests adhering to Page Object Model (POM) design patterns. Use resilient locators (`getByRole`, `getByTestId`) and avoid static sleeping timeouts.
