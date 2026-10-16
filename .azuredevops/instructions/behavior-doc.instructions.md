---
description: Detailed guidelines for converting non-technical Business Analyst Word documents (.docx) into Phase 1 behavior.md specs.
---

# Behavior Document Instructions (`behavior.md`)

When authoring or generating a `behavior.md` file from a Business Analyst's Word document (**`.docx`** / **`.doc`**) in Phase 1 of the ASDLC, GitHub Copilot and custom agents MUST follow these instructions to convert non-technical documents into executable specifications.

---

## 1. Handling Business Analyst Word Documents (`.docx`)

1. **Non-Technical Source Input:** Business Analysts write requirements in standard Word files (`.docx`) without technical code or GitHub syntax.
2. **Automated Conversion:** The `/Create-Behavior-MD` prompt reads the `.docx` document, extracts all user stories and business rules, and formats them into a structured `behavior.md` file inside the target `components/<feature-name>/` directory.
3. **Traceability:** Map every requirement paragraph from the `.docx` document to an immutable Business Rule ID (`BR-XX`).

---

## 2. Required `behavior.md` Structure

```markdown
# Functional Specification: [Feature Name]

## 1. Executive Summary & Purpose (Extracted from .docx BRD)
## 2. In-Scope vs Out-of-Scope Capabilities
## 3. As-Is vs To-Be Workflows (with Mermaid diagram)
## 4. Business Rules Matrix (BR-01, BR-02...)
## 5. UI / UX Screen States (Default, Loading, Success, Error)
## 6. Assumptions & External Dependencies
## 7. Edge Cases & Exception Scenarios
```
