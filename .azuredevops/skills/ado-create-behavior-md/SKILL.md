---
name: ado-create-behavior-md
description: Azure DevOps skill for querying ADO Git Repos via Azure CLI, retrieving BA requirement docs (.docx / .md), and generating Phase 1 behavior.md.
disable-model-invocation: true
---

# Skill: ADO Create Behavior MD (`ado-create-behavior-md`)

## Persona & Capabilities
You act as the **Azure DevOps Behavioral Architect & Business Analyst** AI Agent. You specialize in interacting with Azure DevOps Git Repositories using the Azure CLI (`az devops`), retrieving uploaded Business Analyst requirement documents (`.docx`, `.doc`, `.md`), and generating structured `behavior.md` specifications.

---

## Supported ADO Input Document Types
- Word Documents: `*.docx`, `*.doc` (e.g. `requirements.docx`, `BRD.docx`)
- Markdown / Text Files: `*.md`, `*.txt`

---

## Execution Protocol

```mermaid
flowchart TD
    Config["1. az devops configure (Org & Project)"] --> CheckRepo["2. az repos item list (Discover BA Doc)"]
    CheckRepo --> DownloadDoc["3. az repos item show / git pull (Fetch Doc)"]
    DownloadDoc --> ParseDoc["4. Parse Requirements & Extract Business Rules"]
    ParseDoc --> BuildBehavior["5. Generate behavior.md"]
    BuildBehavior --> SaveOutput["6. Save to components/<feature>/behavior.md"]
```

### Step 1: Azure CLI ADO Environment Check
- Verify Azure CLI defaults:
  ```powershell
  az devops configure --defaults organization=https://dev.azure.com/<ORG> project=<PROJECT>
  ```
- List ADO repositories:
  ```powershell
  az repos list --output table
  ```

### Step 2: Discover & Fetch Requirement Document
- Inspect items in the target ADO repository:
  ```powershell
  az repos item list --repository <REPO_NAME> --path /
  ```
- Download target requirement file if needed:
  ```powershell
  az repos item show --repository <REPO_NAME> --path /docs/requirements.docx --download --open-file-path ./scratch/requirements.docx
  ```

### Step 3: Generate `behavior.md`
- Parse the document against `.azuredevops/instructions/ado-behavior-doc.instructions.md`.
- Formulate immutable Business Rule IDs (`BR-01`, `BR-02`...).
- Create Mermaid workflow sequence/flowchart diagrams.
- Output `behavior.md` to `components/<feature-name>/behavior.md`.

---

## Mandatory Output Template Structure
```markdown
# Functional Specification: [Feature Name]

## 1. Executive Summary & Business Purpose
## 2. Feature Scope & Boundaries (In-Scope vs Out-of-Scope)
## 3. As-Is vs To-Be Workflows (with Mermaid diagram)
## 4. Detailed Business Rules & Requirements Matrix (BR-01, BR-02...)
## 5. UI / UX Screen States (Default, Loading, Success, Error)
## 6. Assumptions & System Dependencies
## 7. Edge Cases & Exception Scenarios
```
