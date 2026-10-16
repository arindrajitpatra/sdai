---
description: Instructions for comparing requirement documents across two Git commits, generating behavioral diffs, prompting for user clarification, creating behavior.md, and pushing to the target branch.
---

# Commit Diff Behavior Generator Instructions

When an agent is tasked with comparing requirement documents across two separate commits, generating an updated `behavior.md`, and pushing to a Git branch, follow these sequential steps.

---

## 1. Commit Analysis & Document Extraction
1. Accept two commit identifiers from the user:
   - Base commit (`<COMMIT_A>`)
   - Target / comparison commit (`<COMMIT_B>`)
2. Inspect the documents modified or present at both commits using git or Azure CLI:
   ```powershell
   git diff --name-only <COMMIT_A> <COMMIT_B>
   ```
3. Extract and read the requirement document (e.g., `*.docx`, `*.md`, `*.txt`) from each commit:
   ```powershell
   git show <COMMIT_A>:<path/to/doc>
   git show <COMMIT_B>:<path/to/doc>
   ```
   *(Or via `az repos item show --version <COMMIT_ID> ...`)*

---

## 2. Document Diff Analysis & User Clarification
1. Compare the two versions:
   - Identify added, modified, or deprecated business rules, workflows, or acceptance criteria.
   - Summarize the exact differences between the two versions clearly for the user.
2. **Clarification Check:**
   - If there are ambiguous requirement changes, conflicting business rules, or undefined edge cases, invoke `ask_question` to clarify the business intent with the user before proceeding.

---

## 3. Generate & Save `behavior.md`
1. Synthesize the requirements into a structured `behavior.md` adhering to the standard template:
   - Executive Summary
   - In-Scope vs Out-of-Scope
   - Mermaid Workflow Diagram
   - Business Rules Matrix (`BR-01`, `BR-02`...)
   - UI/UX States
   - Assumptions & Edge Cases
   - **Commit Evolution & Delta Section** documenting changes between `<COMMIT_A>` and `<COMMIT_B>`.
2. Save the generated specification to the target component path:
   - `components/<feature-name>/behavior.md`

---

## 4. Difference Report & Branch Push Confirmation
1. Present the user with:
   - A clear summary of the differences between the two commit documents.
   - The file path where `behavior.md` was saved.
2. Prompt the user for permission to push to the target branch:
   - Ask if the agent should self-commit and push the newly created `behavior.md` to the specified branch.
   - If approved, execute:
     ```powershell
     git checkout <target-branch>
     git add components/<feature-name>/behavior.md
     git commit -m "docs(behavior): generate behavior.md from commit diff <COMMIT_A>..<COMMIT_B>"
     git push origin <target-branch>
     ```
