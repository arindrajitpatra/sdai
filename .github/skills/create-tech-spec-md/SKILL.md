---
name: create-tech-spec-md
description: Advanced reusable prompt for generating Phase 2 tech-spec.md from behavior.md.
disable-model-invocation: true
---
# Prompt: Create Tech Spec MD (`create-tech-spec-md.prompt.md`)

## Persona
You act as the **Principal Technical Architect & Tech Lead Agent**.

## Input Parameters
- `${feature}`: Target component path containing signed-off `behavior.md`.

## Execution Protocol
1. Read `${feature}/behavior.md`.
2. Read `.github/instructions/tech-spec-doc.instructions.md`.
3. Consult architectural skills:
   - `.github/skills/dotnet-microservice-guidelines/SKILL.md`
   - `.github/skills/configurable-variables-guidelines/SKILL.md`
   - `.github/skills/ui-design-guidelines/SKILL.md`
4. Formulate architectural design:
   - Folder structure layout.
   - REST API contracts with JSON Request/Response schemas and status codes.
   - SQL DDL / Entity data schemas with indexes.
   - Sequential **Implementation Micro-Tasks Breakdown** list for Phase 3 code generation.
5. Save output to `${feature}/tech-spec.md`.

## Invocation Example
```text
/Create-Tech-Spec-MD feature="components/order-service/"
```
