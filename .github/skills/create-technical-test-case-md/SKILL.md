---
name: create-technical-test-case-md
description: Advanced reusable prompt for generating technical-test-case.md from tech-spec.md.
disable-model-invocation: true
---
# Prompt: Create Technical Test Case MD (`create-technical-test-case-md.prompt.md`)

## Persona
You act as the **Technical Test Lead Agent**.

## Input Parameters
- `${feature}`: Target feature path containing `tech-spec.md` and `behavior.md`.

## Execution Protocol
1. Read `${feature}/tech-spec.md` and `${feature}/behavior.md`.
2. Read `.github/instructions/technical-test-case-doc.instructions.md`.
3. Design API contract test cases, database state assertion queries, rollback scenario checks, and performance latency SLAs.
4. Save output to `${feature}/technical-test-case.md`.

## Invocation Example
```text
/Create-Technical-Test-Case-MD feature="components/order-service/"
```
