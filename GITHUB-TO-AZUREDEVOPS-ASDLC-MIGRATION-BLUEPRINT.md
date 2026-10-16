# Enterprise Architecture & Migration Blueprint: Agentic SDLC (ASDLC) on Azure DevOps

## Executive Summary
This document defines the comprehensive architecture, design principles, operational mechanics, and prompt-driven agent interactions required to implement an **Agentic Software Development Lifecycle (ASDLC)** natively on **Azure DevOps (ADO)**.

Originally conceptualized in GitHub-centric ecosystems (relying on `.github/` workflows, pull request templates, and issue boards), this enterprise blueprint establishes how to re-architect that methodology into a secure, fully auditable, and automated Azure DevOps environment (`.azuredevops/`).

This guide serves as a universal master specification. Any engineer, engineering manager, or AI assistant (such as Copilot) provided with a generic `.github/` ASDLC folder can use this document to understand the underlying theory, operational workflows, and prompt invocations, and autonomously implement identical enterprise-grade capabilities within Azure DevOps without needing ad-hoc code snippets.

---

## 1. Architectural Philosophy: The Agentic SDLC in Enterprise DevOps

### 1.1 The Need for Structured Agentic Orchestration
Autonomous AI coding agents perform significantly better when given full-context feature boundaries rather than fragmented micro-prompts. However, in enterprise environments, unconstrained agent autonomy presents severe risks:
- Premature codebase modifications before architectural consensus.
- Inadequate traceability between high-level business goals and generated code.
- Board clutter from eager pre-allocation of tasks.
- Exclusion of human specialists (Security, Architects, Quality Engineers, and Product Owners) from critical quality gates.

The **Azure DevOps ASDLC** solves this by embedding autonomous AI agents within a structured, gated Scrum framework. Agents operate as specialized digital team members who collaborate with human counterparts, strictly adhering to formal lifecycle phases.

---

### 1.2 Comparison: Legacy GitHub vs. Enterprise Azure DevOps

| Lifecycle Dimension | Legacy GitHub Implementation (`.github/`) | Enterprise Azure DevOps Implementation (`.azuredevops/`) |
| :--- | :--- | :--- |
| **Framework Segregation** | Often coupled directly with application code in a single repository. | Decoupled: Dedicated ASDLC Framework repository vs. Target Application repositories. |
| **Folder Architecture** | Everything stored under `.github/` (prompts, instructions, workflows). | Clean three-tier separation under `.azuredevops/`: `agents/`, `instructions/`, and `skills/`. |
| **Work Item Topology** | Flat GitHub Issues, milestones, and project board cards. | Multi-tier Scrum hierarchy: **Epic ➔ Feature ➔ Product Backlog Items (PBIs) ➔ Child Tasks**. |
| **Traceability Engine** | Basic issue number references (`#123`). | Native Git-to-Board linkage via work item ID mentions in commit messages, reflecting in the work item **Development** panel. |
| **Task Allocation** | Markdown checklist items within issue descriptions. | **Just-In-Time (JIT)** child tasks partitioned into `[Agent]` automation and `[Human-*]` disciplines. |
| **Workspace Governance** | Edits directly committed to local repo branches. | Isolated target workspace folders with automated bi-directional local sync (`git pull`). |
| **Deliverable Isolation** | Reports and markdown documents mixed with source files. | Strict filesystem partitioning: `artifacts/<feature-name>/` for all deliverables vs. clean source directories (`src/`, `tests/`). |
| **Quality Gates** | Informal PR approvals. | Blocking Pre-Execution Gates requiring explicit sign-off on preceding human review tasks. |

---

## 2. Framework Directory Architecture: The Three Pillars of `.azuredevops/`

To achieve enterprise-grade maintainability and modularity, the entire framework is organized into three distinct layers under `.azuredevops/`:

### 1. `.azuredevops/agents/`: Persona Definitions
- Holds `.agent.md` persona files (for example, `ado-board-feature-coordinator.agent.md`, `ado-behavior-generator.agent.md`, `code-verifier.agent.md`).
- Defines the agent's identity, role, scope boundary, required permissions, and step-by-step operational protocol.
- Enforces guardrails such as repository isolation (never touching framework files during feature delivery) and human review gates.

### 2. `.azuredevops/instructions/`: Operational Rules & Specifications
- Holds `.instructions.md` operational rules (for example, `ado-board-feature-pbi.instructions.md`, `overall-behavior-doc.instructions.md`, `tech-spec-doc.instructions.md`).
- Serves as the immutable standard for document structure, enterprise coding standards, and compliance rules.
- Specifies exactly how deliverables must be structured (such as requiring Business Rule IDs `BR-01`, Mermaid flowcharts, REST API contract tables, and test matrices).

### 3. `.azuredevops/skills/`: Reusable Prompts & Tool Capabilities
- Holds reusable prompt definitions and tool capabilities organized into modular subdirectories (for example, `skills/create-behavior-md/SKILL.md`, `skills/create-tech-spec-md/SKILL.md`).
- Encapsulates domain-specific workflows and agent slash-commands (such as `/Create-Behavior-MD`, `/Create-Tech-Spec-MD`).
- Contains executable recipes for interacting with Azure DevOps tools, running test harnesses, and generating structured artifacts.

---

## 3. Core Architectural Principles

### Principle 1: Repository Decoupling & Work Isolation Theory

An enterprise ASDLC enforces strict physical separation between **Framework Logic** and **Target Application Code**:

1. **The ASDLC Framework Repository**:
   - Contains immutable agent personas (`.azuredevops/agents/`), prompt definitions (`.azuredevops/skills/`), and operational instructions (`.azuredevops/instructions/`).
   - **Theoretical Constraint:** Agents **never** branch, write application code, or push feature deliverables to the framework repository. It remains 100% agnostic to any single application.
2. **The Target Application Repository**:
   - The business application repository where feature development occurs.
   - The agent operates strictly inside an isolated local workspace folder cloned from this repository, creating dedicated feature branches and committing code exclusively here.

---

### Principle 2: The 4-Tier Azure Boards Hierarchy Standard

Every initiative is structured within Azure Boards using standard Scrum work item types:
- **Epic**: High-level business initiative or product capability.
- **Feature**: Discrete deliverable capability (tagged with `#<FEATURE_ID>`).
- **Product Backlog Items (PBIs)**: Exactly **5 sequential child PBIs** representing the 5 phases of feature delivery:
  1. `[C/O]01. Requirement Engineering - <Feature Name>`
  2. `[C/O]02. Technical Specification - <Feature Name>`
  3. `[C/O]03. Semi Autonomous Feature Implementation - <Feature Name>`
  4. `[C/O]04. Feature Review - <Feature Name>`
  5. `[C/O]05. Feature Validation - <Feature Name>`
- **Child Tasks**: Detailed execution units belonging to a specific phase, created Just-In-Time.

---

### Principle 3: Just-In-Time (JIT) Task Provisioning & Role Demarcation

#### The Problem with Upfront Allocation:
Creating all 20+ child tasks across all 5 PBIs at the moment a feature is created introduces significant board clutter, confuses sprint burndown metrics, and falsely implies that implementation is underway before requirements are signed off.

#### The Just-In-Time (JIT) Model:
- **Feature Coordinator Agent (`ado-board-feature-coordinator.agent.md`)**: Provisions **ONLY** the feature Git branch and the **5 empty PBIs**. It stops immediately without provisioning any child tasks.
- **Phase Agents**: When a user invokes a specific phase agent (e.g., Phase 1 Requirement Engineering), **only then** are the child tasks for that specific PBI instantiated on Azure Boards.

#### Explicit Role-Prefixed Task Separation:
To provide immediate visual clarity on the Scrum board, every task has an explicit owner discipline prefix:

| Task Prefix | Target Owner | Operational Contract |
| :--- | :--- | :--- |
| **`[Agent]`** | AI Agent | Executed autonomously by the agent. The agent writes the artifact, commits with `#<PBI_ID>`, updates the task description, and automatically marks the task as **`Done`**. |
| **`[Human-DEV]`** | Software Developer | Developer pulls the branch locally, validates technical feasibility or debugs code, commits manual adjustments if needed, and manually marks the task as **`Done`**. |
| **`[Human-BA]`** | Business Analyst | Product owner or BA validates functional alignment with business rules and acceptance criteria, then manually marks the task as **`Done`**. |
| **`[Human-LEAD]`** | Tech Lead / Architect | Lead verifies architecture, schema soundness, scalability, and security models, then manually marks the task as **`Done`**. |
| **`[Human-QA]`** | Quality Assurance Lead | QA confirms test matrices, scenario completeness, and test pass assertions, then manually marks the task as **`Done`**. |

---

### Principle 4: Strict Filesystem Partitioning: `artifacts/` vs Application Code

To keep production code clean, all intermediate reports, specifications, and test matrices are strictly isolated from the application source code:
- **`artifacts/<feature-name>/` (Strictly Documentation & Audit Reports):**
  - `behavior.md` (Functional Behavior Specification)
  - `behavior-edge-case-review-report.md` (Edge Case & Boundary Review)
  - `tech-spec.md` (Technical Architecture & DB Contracts)
  - `behavioral-test-case.md` (BDD Test Scenarios)
  - `technical-test-case.md` (Technical & Unit Test Matrices)
  - `devils-advocate-review-report.md` (Architecture Challenge Report)
  - `code-verification-report.md` (Static Analysis & Lint Audit)
  - `pr-review-report.md` (Pull Request Audit Report)
  - `ui-validation-report.md` (E2E & UI Validation Report)
- **Application Source Code (Strictly outside `artifacts/`):**
  - Production code lives exclusively in `src/`, `lib/`, etc.
  - Test suites live in `tests/`, `e2e/`, etc.
  - Build scripts and project manifests live in root configuration files.

---

### Principle 5: Deep Git-to-Board Traceability ("Development" Section Integration)

Azure DevOps provides a dedicated **Development** panel on the right side of work item cards. To automatically populate this section without third-party plugins:
1. **Work Item ID Tagging in Commit Messages**:
   Every Git commit created by an agent includes the target PBI ID formatted as `#<PBI_ID>` in the commit message (for example: `feat(spec): Create behavior.md for <feature-name> #<PBI_ID>`). When pushed to Azure Repos, the server-side Git hook detects the `#` mention and registers the commit under the work item's **Development ➔ Commits** list.
2. **Rich Description Hyperlinking**:
   The agent automatically updates the PBI's description field using Azure CLI to embed direct HTML hyperlinks pointing to the exact file view on Azure Repos, allowing stakeholders to view generated markdown files in a single click from the board.

---

### Principle 6: Pre-Execution Gates & Interactive Human Review Verification

A fundamental principle of the ASDLC is that **AI agents cannot advance to the next phase while preceding human reviews remain incomplete**.

1. **Pre-Flight Inspection**: Before generating deliverables for Phase `N`, the agent inspects Azure Boards to check the status of all `[Human-*]` tasks in Phase `N-1`.
2. **Interactive Decision Gate**: If any preceding human task is pending, the agent pauses and presents an interactive decision modal to the user:
   - **Recommended Choice:** Stop execution so the user can perform the review and mark the task `Done`.
   - **Override Choice:** Proceed with execution under explicit human authorization.

---

### Principle 7: Auto-Context Discovery & Continuous Local Synchronization

1. **Dynamic ID Resolution (Zero Hardcoded IDs)**:
   - Users are never asked to look up work item numbers or manually type `#<ID>`.
   - Agents inspect the current Git branch name, extract the Feature ID using regex (`feature/<FEATURE_ID>-<feature-slug>`), query Azure Boards dynamically via Azure CLI WIQL queries, and automatically resolve parent PBIs and child tasks.
2. **Automatic Local Sync (`git pull`)**:
   - Immediately after committing and pushing new deliverables to remote Azure Repos, the agent automatically executes `git pull origin <branch>` inside the local workspace.
   - This ensures that local files are always in sync with remote repositories, allowing human team members to immediately inspect or edit files locally in their IDE.

---

## 4. Phase-by-Phase End-to-End Operational Lifecycle

The lifecycle consists of an initial setup phase followed by five sequential delivery phases.

---

### Phase 0: Feature Initialization & Board Setup
- **Primary Agent**: `ado-board-feature-coordinator.agent.md`
- **Supported Skills / Prompts**:
  - Skill: `.azuredevops/skills/ado-board-feature-orchestrator/SKILL.md`
  - Prompt: Initialized with Feature ID, Target Application Repository URL, and Local Workspace Directory path.
- **Operational Workflow**:
  1. The agent inspects the parent Feature in Azure Boards to fetch the title, area path, and iteration path.
  2. The agent generates a clean URL slug from the title and provisions a dedicated branch in the target application repository: `feature/<FEATURE_ID>-<feature-slug>`.
  3. The agent provisions the **5 Child PBIs** (01 to 05) directly linked under the parent Feature.
  4. The agent **stops immediately**. No child tasks are created, and no code or documents are modified.
- **JIT Tasks Created**: None (JIT task creation is deferred to individual phase agents).
- **Deliverables**:
  - Remote feature branch: `feature/<FEATURE_ID>-<feature-slug>`.
  - 5 Linked Child PBIs in Azure Boards in `New` state.
- **Review Gate**: Human developer or tech lead reviews the 5 PBIs created in Azure Boards.

---

### Phase 1: Requirement Engineering
- **Primary Agents**:
  - Requirement Generator: `ado-behavior-generator.agent.md`
  - Edge Case Reviewer: `behavior-edge-case-review.agent.md`
- **Supported Skills / Prompts**:
  - Skill: `.azuredevops/skills/create-behavior-md/SKILL.md`
  - Skill: `.azuredevops/skills/review-behavior-edge-cases/SKILL.md`
  - Reusable Prompt: `/Create-Behavior-MD feature="<feature-name>/"`
  - Reusable Prompt: `/Review-Behavior-Edge-Cases feature="<feature-name>/"`
  - Operating Instruction: `.azuredevops/instructions/overall-behavior-doc.instructions.md`
- **Operational Workflow**:
  1. The agent dynamically extracts the Feature ID from the branch name, verifies that PBI 01 exists, and creates the 4 child tasks for Phase 1 Just-In-Time.
  2. The agent reads the business requirements and generates the comprehensive behavioral specification (`behavior.md`).
  3. The edge case reviewer agent analyzes boundary conditions, failure modes, concurrency, and RBAC rules, generating the edge case report.
  4. The agent commits deliverables with `#<PBI_ID>`, pushes to the remote feature branch, updates task states to `Done`, and executes a local `git pull`.
- **JIT Tasks Created**:
  - `[Agent] Generate behavior.md`
  - `[Agent] Edge Case & Boundary Review`
  - `[Human-DEV] Dev Validation of behavior.md`
  - `[Human-BA] BA / QA Validation of behavior.md`
- **Deliverables**:
  - `artifacts/<feature-name>/behavior.md` (Functional specification with Business Rule IDs `BR-01`, As-Is/To-Be workflows, and Mermaid diagrams).
  - `artifacts/<feature-name>/behavior-edge-case-review-report.md` (Edge case, security, and boundary condition audit).
- **Review Gate (Gate 1)**:
  - Developer (`[Human-DEV]`) verifies technical feasibility.
  - Business Analyst (`[Human-BA]`) verifies business logic accuracy.
  - Both human reviewers make adjustments if necessary, push changes, and mark their tasks as `Done`.

---

### Phase 2: Technical Specification
- **Primary Agents**:
  - Architecture Designer: `create-tech-spec-md` skill
  - Architectural Reviewer: `devils-advocate.agent.md`
  - Behavioral Test Designer: `create-behavioral-test-case-md` skill
  - Technical Test Designer: `create-technical-test-case-md` skill
  - Test Case Reviewers: `behavioral-test-case-review.agent.md`, `technical-test-case-review.agent.md`
- **Supported Skills / Prompts**:
  - Skill: `.azuredevops/skills/create-tech-spec-md/SKILL.md`
  - Skill: `.azuredevops/skills/create-behavioral-test-case-md/SKILL.md`
  - Skill: `.azuredevops/skills/create-technical-test-case-md/SKILL.md`
  - Reusable Prompt: `/Create-Tech-Spec-MD feature="<feature-name>/"`
  - Reusable Prompt: `/Create-Behavioral-Test-Case-MD feature="<feature-name>/"`
  - Reusable Prompt: `/Create-Technical-Test-Case-MD feature="<feature-name>/"`
  - Operating Instruction: `.azuredevops/instructions/tech-spec-doc.instructions.md`
- **Operational Workflow**:
  1. The agent checks Gate 1: Verifies that Phase 1 human tasks are marked `Done`.
  2. The agent provisions Phase 2 child tasks Just-In-Time.
  3. The agent ingests `behavior.md` and generates `tech-spec.md` with complete REST schemas, database DDL, and an implementation micro-tasks list.
  4. The Devil's Advocate agent stresses the design for performance bottlenecks and single points of failure.
  5. Test designers generate behavioral BDD scenarios (`behavioral-test-case.md`) and technical test matrices (`technical-test-case.md`).
  6. Deliverables are committed with `#<PBI_ID>`, pushed remotely, linked on Azure Boards, and synced locally.
- **JIT Tasks Created**:
  - `[Agent] Generate tech-spec.md & Test Matrices`
  - `[Agent] Devil's Advocate Review`
  - `[Human-LEAD] Tech Lead Architecture Review`
  - `[Human-QA] QA Lead Test Matrix Sign-off`
- **Deliverables**:
  - `artifacts/<feature-name>/tech-spec.md` (Living architecture specification with micro-tasks list).
  - `artifacts/<feature-name>/behavioral-test-case.md` (Gherkin BDD test scenarios mapped to `BR-XX`).
  - `artifacts/<feature-name>/technical-test-case.md` (Unit, integration, and database contract test matrices).
  - `artifacts/<feature-name>/devils-advocate-review-report.md` (Architectural stress-test findings).
- **Review Gate (Gate 2)**:
  - Tech Lead (`[Human-LEAD]`) reviews and signs off on architecture and schemas.
  - QA Lead (`[Human-QA]`) reviews and signs off on test matrices.

---

### Phase 3: Semi-Autonomous Implementation
- **Primary Agents**:
  - Code Generator: `spec-to-code.agent.md`
  - Technical Test Generator: `create-technical-test-case-md` skill
  - Test Case Reviewer: `technical-test-case-review.agent.md`
  - Verification Harness: Local compilers and test runners
- **Supported Skills / Prompts**:
  - Reusable Prompt: `/Spec-To-Code feature="<feature-name>/"`
  - Reusable Prompt: `/Create-Technical-Test-Case-MD feature="<feature-name>/"`
- **Operational Workflow**:
  1. The agent checks Gate 2: Verifies that Phase 2 human tasks are marked `Done`.
  2. The agent provisions Phase 3 child tasks Just-In-Time.
  3. In parallel, QA engineers and agents generate and review technical test cases based on `tech-spec.md`.
  4. The code generator sequentially executes the implementation micro-tasks from `tech-spec.md`, writing production source code and unit tests directly in standard codebase directories.
  5. The agent executes local build and unit test suites, iterating until zero compilation errors and 100% test pass rates are achieved.
  6. The agent commits with `#<PBI_ID>`, pushes remotely, updates the `[Agent]` task to `Done`, and syncs locally.
- **JIT Tasks Created**:
  - `[Agent] Implement Source Code & Unit Tests`
  - `[Agent] Verify Compilation & Test Execution`
  - `[Human-DEV] Dev Local Code & Debug Validation`
- **Deliverables**:
  - Production source code in standard application directories (`src/`, `lib/`, etc.).
  - Unit and integration tests in test directories (`tests/`).
  - Clean local build and test execution logs confirming zero errors.
- **Review Gate (Gate 3)**:
  - Developer (`[Human-DEV]`) pulls the branch locally, validates functionality and debug logs in the local development environment, commits any necessary refinements, and marks the task `Done`.

---

### Phase 4: Feature Review
- **Primary Agents**:
  - Static Code Verifier: `code-verifier.agent.md`
  - PR Reviewer: `pr-review.agent.md`
  - Self-Healing PR Agent: `self-healing-pr.agent.md`
- **Supported Skills / Prompts**:
  - Reusable Prompt: `/Verify-Code feature="<feature-name>/"`
  - Reusable Prompt: `/Review-PR feature="<feature-name>/"`
  - Reusable Prompt: `/Self-Heal-PR feature="<feature-name>/"`
- **Operational Workflow**:
  1. The agent checks Gate 3: Verifies that Phase 3 human tasks are marked `Done`.
  2. The agent provisions Phase 4 child tasks Just-In-Time.
  3. The code verifier runs static analysis, linting, and spec contract compliance checks against the code diff.
  4. The PR reviewer conducts an automated peer review, identifying security concerns, style inconsistencies, or regression risks.
  5. If actionable issues are discovered, the self-healing PR agent applies surgical fixes, re-runs tests, and commits updates.
  6. Deliverables are committed with `#<PBI_ID>`, pushed remotely, linked on Azure Boards, and synced locally.
- **JIT Tasks Created**:
  - `[Agent] Code Verification & Static Audit`
  - `[Agent] Generate PR Review Audit Report`
  - `[Human-DEV] Peer Engineer Code Review Sign-off`
- **Deliverables**:
  - `artifacts/<feature-name>/code-verification-report.md` (Static analysis, linting, and compliance audit).
  - `artifacts/<feature-name>/pr-review-report.md` (PR code review findings and suggestions).
  - Clean, verified codebase ready for pull request merge.
- **Review Gate (Gate 4)**:
  - Senior Peer Reviewer (`[Human-DEV]`) audits the code diff and generated reports, conducts a feature walkthrough/demo with leads, and marks the task `Done`.

---

### Phase 5: Feature Validation
- **Primary Agents**:
  - Test Automation Coordinator: `test-automation-coordinator.agent.md`
  - Environment Launcher: `app-launcher.md`
  - UI Validator: `ui-validator.agent.md`
  - Test Automation Generator: `test-automation-generator.agent.md`
  - Test Automation Healer: `test-automation-healer.agent.md`
- **Supported Skills / Prompts**:
  - Skill: `.azuredevops/skills/test-automation/startup-stability-preflight/SKILL.md`
  - Skill: `.azuredevops/skills/test-automation/generation-skill/SKILL.md`
  - Skill: `.azuredevops/skills/test-automation/execution-skill/SKILL.md`
  - Skill: `.azuredevops/skills/test-automation/healing-skill/SKILL.md`
  - Reusable Prompt: `/Validate-UI feature="<feature-name>/"`
  - Reusable Prompt: `/Coordinate-Test-Automation feature="<feature-name>/"`
- **Operational Workflow**:
  1. The agent checks Gate 4: Verifies that Phase 4 human tasks are marked `Done`.
  2. The agent provisions Phase 5 child tasks Just-In-Time.
  3. The UI validator launches the application in the target environment (e.g., dev, test, UAT) and validates functional UI behavior against `behavioral-test-case.md`.
  4. The test automation coordinator orchestrates test generation, execution, and self-healing across the test automation suite (e.g., Playwright TypeScript suites).
  5. If selectors or DOM elements break due to layout updates, the healing agent analyzes DOM diffs, repairs locators, and re-executes tests.
  6. Deliverables are committed with `#<PBI_ID>`, pushed remotely, linked on Azure Boards, and synced locally.
- **JIT Tasks Created**:
  - `[Agent] E2E Automation Suites & UI Validation`
  - `[Agent] Run Self-Healing Validation Loops`
  - `[Human-QA] Final QA Acceptance Sign-off`
- **Deliverables**:
  - `artifacts/<feature-name>/ui-validation-report.md` (UI rendering, visual layout, and user journey audit).
  - Automated test execution suites and run summary reports.
  - Self-healing locator repair audit logs.
- **Review Gate (Gate 5)**:
  - QA Lead (`[Human-QA]`) verifies 100% automated test execution pass rate, signs off on the feature release, marks the task `Done`, and marks the overall Feature work item as `Done`.

---

## 5. Master ASDLC Governance Summary Matrix

| ASDLC Phase & Child PBI | Executing / Primary Agent | Review / Quality Agent | Supported Reusable Prompts | JIT Tasks Created | Primary Deliverables | Review Gate & Sign-off |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Phase 0: Feature Initialization** | `ado-board-feature-coordinator.agent.md` | Tech Lead / Human Review | Feature Coordinator initialization prompt | None (PBIs created; child tasks deferred) | Remote feature branch (`feature/<FEATURE_ID>-<feature-slug>`) and 5 Linked Child PBIs | Human verifies board hierarchy and branch creation |
| **Phase 1: Requirement Engineering** | `ado-behavior-generator.agent.md` | `behavior-edge-case-review.agent.md` | `/Create-Behavior-MD`<br/>`/Review-Behavior-Edge-Cases` | • `[Agent] Generate behavior.md`<br/>• `[Agent] Edge Case & Boundary Review`<br/>• `[Human-DEV] Dev Validation of behavior.md`<br/>• `[Human-BA] BA / QA Validation of behavior.md` | `artifacts/<feature>/behavior.md`<br/>`artifacts/<feature>/behavior-edge-case-review-report.md` | **Gate 1:** DEV and BA verify business rules and sign off |
| **Phase 2: Technical Specification** | `create-tech-spec-md` skill | `devils-advocate.agent.md`<br/>`behavioral-test-case-review.agent.md`<br/>`technical-test-case-review.agent.md` | `/Create-Tech-Spec-MD`<br/>`/Create-Behavioral-Test-Case-MD`<br/>`/Create-Technical-Test-Case-MD` | • `[Agent] Generate tech-spec.md & Test Matrices`<br/>• `[Agent] Devil's Advocate Review`<br/>• `[Human-LEAD] Tech Lead Architecture Review`<br/>• `[Human-QA] QA Lead Test Matrix Sign-off` | `artifacts/<feature>/tech-spec.md`<br/>`artifacts/<feature>/behavioral-test-case.md`<br/>`artifacts/<feature>/technical-test-case.md`<br/>`artifacts/<feature>/devils-advocate-review-report.md` | **Gate 2:** Tech Lead and QA Lead approve architecture and sign off |
| **Phase 3: Semi-Autonomous Implementation** | `spec-to-code.agent.md` | Local build and test runners | `/Spec-To-Code`<br/>`/Create-Technical-Test-Case-MD` | • `[Agent] Implement Source Code & Unit Tests`<br/>• `[Agent] Verify Compilation & Test Execution`<br/>• `[Human-DEV] Dev Local Code & Debug Validation` | Production source code in `src/`, unit tests in `tests/` (outside `artifacts/`) | **Gate 3:** DEV validates local compilation, debugging, and signs off |
| **Phase 4: Feature Review** | `code-verifier.agent.md`<br/>`self-healing-pr.agent.md` | `pr-review.agent.md` | `/Verify-Code`<br/>`/Review-PR`<br/>`/Self-Heal-PR` | • `[Agent] Code Verification & Static Audit`<br/>• `[Agent] Generate PR Review Audit Report`<br/>• `[Human-DEV] Peer Engineer Code Review Sign-off` | `artifacts/<feature>/code-verification-report.md`<br/>`artifacts/<feature>/pr-review-report.md` | **Gate 4:** Senior Peer Reviewer audits code diff and signs off |
| **Phase 5: Feature Validation** | `test-automation-coordinator.agent.md`<br/>`app-launcher.md` | `ui-validator.agent.md`<br/>`test-automation-healer.agent.md` | `/Validate-UI`<br/>`/Coordinate-Test-Automation` | • `[Agent] E2E Automation Suites & UI Validation`<br/>• `[Agent] Run Self-Healing Validation Loops`<br/>• `[Human-QA] Final QA Acceptance Sign-off` | Playwright test suites, `artifacts/<feature>/ui-validation-report.md`, healing logs | **Gate 5:** QA Lead signs off on automated test pass; marks Feature `Done` |

---

## 6. Migration Guide: Converting `.github` to `.azuredevops`

When migrating an existing `.github/` ASDLC framework to `.azuredevops/`, execute the following systematic procedure:

### Step 1: Directory & Asset Re-Structuring
1. Create a root `.azuredevops/` directory.
2. Mirror the three essential subdirectories:
   - `.azuredevops/agents/`: Holds `.agent.md` persona files.
   - `.azuredevops/instructions/`: Holds `.instructions.md` operational rules.
   - `.azuredevops/skills/`: Holds reusable prompts and tool capabilities.
3. Move all GitHub Copilot custom prompts (e.g. `/Create-Behavior-MD`) into corresponding `.azuredevops/skills/<skill-name>/SKILL.md` files.

### Step 2: Syntax & Tooling Abstraction
1. Replace all GitHub CLI concepts (`gh issue`, `gh pr`) with Azure DevOps primitives (`az boards`, `az repos`).
2. Replace component output paths with the unified enterprise destination: `artifacts/<feature-name>/`.
3. Ensure application code generation targets standard repository folders (`src/`, `tests/`) rather than documentation folders.

### Step 3: Implement the Feature Coordinator Agent
1. Create `ado-board-feature-coordinator.agent.md` as the Phase 0 entrypoint.
2. Instruct the agent to accept the Feature ID, target repository URL, and local workspace directory.
3. Implement branch creation adhering to `feature/<FEATURE_ID>-<feature-slug>`.
4. Implement autonomous provisioning of the 5 Child PBIs under the Feature in Azure Boards.
5. Enforce strict immediate stopping: zero child tasks created upfront; zero deliverables generated.

### Step 4: Implement Phase Agents with JIT Tasks & Auto-Discovery
1. Add Git branch inspection logic to automatically extract the Feature ID and resolve the target PBI ID from Azure Boards without manual typing.
2. Add JIT provisioning: Check if tasks exist under the active PBI; if not, create the standard role-prefixed child tasks.
3. Enforce `#<PBI_ID>` inclusion in all Git commit messages to trigger Azure DevOps native commit linking.
4. Add automated `git pull` execution immediately following any `git push` to keep local workspaces in continuous synchronization.
5. Implement pre-execution gate logic checking that preceding `[Human-*]` tasks are in `Done` state before proceeding.

---

## 7. The Golden Rules of ASDLC on Azure DevOps

1. **Framework Decoupling:** Never touch the ASDLC framework repository during feature delivery; all work belongs in the target application repository.
2. **Three-Tier Directory Standard:** Strictly maintain `.azuredevops/agents/` for personas, `.azuredevops/instructions/` for rules, and `.azuredevops/skills/` for prompts and capabilities.
3. **Phase 0 Coordinator Initiation:** Always initialize new features using `ado-board-feature-coordinator.agent.md` to create the feature branch and 5 PBIs, without creating upfront tasks.
4. **JIT Task Provisioning:** Never create child tasks across all PBIs upfront; create tasks dynamically when their specific phase agent is executed.
5. **Role Demarcation:** Clearly separate `[Agent]` automation tasks from `[Human-DEV]`, `[Human-BA]`, `[Human-LEAD]`, and `[Human-QA]` review tasks.
6. **Artifact Partitioning:** Keep intermediate specs and reports in `artifacts/<feature-name>/`; keep source code in standard application directories (`src/`, `tests/`).
7. **Git-to-Board Traceability:** Always include `#<PBI_ID>` in commit messages to automatically populate the right-side **Development** panel on Azure Boards.
8. **Enforced Human Gates:** Check preceding human task completion before starting the next phase; pause and prompt the user if reviews are pending.
9. **Continuous Local Sync:** Always run `git pull` locally after remote pushes so workspace files are immediately up to date for human review.
