---
description: ADO-native guidelines for fetching BA requirement docs from Azure DevOps Repos via Azure CLI and generating Phase 1 behavior.md specs.
---

# Azure DevOps Behavior Document Instructions (`behavior.md`)

When authoring or generating a `behavior.md` file from a Business Analyst's document uploaded to an **Azure DevOps Git Repository**, Copilot and custom ADO agents MUST follow these instructions.

---

## 1. ADO Requirement Document Discovery & Fetching

1. **BA Upload to ADO Repos:**
   - The Business Analyst uploads the requirements file (`.docx`, `.doc`, `.md`) to the target Azure DevOps Git Repository (e.g. in `/docs/` or repo root).
2. **Azure CLI Inspection:**
   - The ADO Agent uses Azure CLI (`az repos item list`) to check for newly committed requirement documents in the ADO repository:
     ```powershell
     az repos item list --repository <REPO_NAME> --path /docs
     ```
3. **Download Requirement Artifact:**
   - The agent fetches the document content via Azure CLI:
     ```powershell
     az repos item show --repository <REPO_NAME> --path /docs/requirements.docx --download --open-file-path ./scratch/requirements.docx
     ```
   - Or reads the file directly from the local cloned ADO workspace path.

---

## 2. Requirement Extraction & Traceability

1. **Non-Technical Source Processing:** Extract all business goals, user personas, step-by-step feature workflows, file attachment rules, approval thresholds, and non-functional requirements.
2. **Business Rule Mapping:** Map every requirement paragraph from the ADO document to a unique, immutable Business Rule ID (`BR-01`, `BR-02`, etc.).
3. **Target Output Placement:** Generate the complete output file directly to `artifacts/<feature-name>/behavior.md`.

---

## 3. Mandatory `behavior.md` Structure

```markdown
# Functional Specification: [Feature Name]

## 1. Executive Summary & Purpose (Extracted from ADO BRD)
## 2. In-Scope vs Out-of-Scope Capabilities
## 3. As-Is vs To-Be Workflows (with Mermaid diagram)
## 4. Business Rules Matrix (BR-01, BR-02...)
## 5. UI / UX Screen States (Default, Loading, Success, Error)
## 6. Assumptions & External Dependencies
## 7. Edge Cases & Exception Scenarios
```
