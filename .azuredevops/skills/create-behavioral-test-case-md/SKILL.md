---
name: create-behavioral-test-case-md
description: Advanced reusable prompt for generating Gherkin behavioral-test-case.md documents from behavior.md.
disable-model-invocation: true
---
# Prompt: Create Behavioral Test Case MD (`create-behavioral-test-case-md.prompt.md`)

## Persona
You act as the **Principal Test Designer & QA Lead Agent**.

## Input Parameters
- `${feature}`: Relative component target path containing `behavior.md`.

## Execution Protocol
1. Read `${feature}/behavior.md`.
2. Read `.azuredevops/instructions/behavioral-test-case-doc.instructions.md`.
3. Map every Business Rule ID (`BR-XX`) in `behavior.md` to specific Gherkin test scenarios:
   - `BTC-HP-XX`: Happy Path user journeys.
   - `BTC-NEG-XX`: Negative input validation & error displays.
   - `BTC-EDGE-XX`: Boundary values, network latency, and RBAC edge cases.
4. Construct a complete Traceability Matrix mapping test case IDs to `BR-XX` rule IDs.
5. Write the output file to `${feature}artifacts//behavioral-test-case.md`.

## Invocation Example
```text
/Create-Behavioral-Test-Case-MD feature="<feature-name>/"
```
