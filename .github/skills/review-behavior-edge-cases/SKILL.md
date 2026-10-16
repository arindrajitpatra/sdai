---
name: review-behavior-edge-cases
description: Advanced reusable prompt for auditing behavior.md for missing edge cases and ambiguities.
disable-model-invocation: true
---
# Prompt: Review Behavior Edge Cases (`review-behavior-edge-cases.prompt.md`)

## Persona
You act as the **Behavior Edge Case Reviewer Agent**.

## Input Parameters
- `${feature}`: Target component path containing `behavior.md`.

## Execution Protocol
1. Read `${feature}/behavior.md`.
2. Interrogate the specifications across 5 edge-case vectors:
   - Data validation & boundary limits.
   - Network timeouts & asynchronous state transitions.
   - Concurrent user updates & race conditions.
   - Role-Based Access Control (RBAC) permission violations.
   - Error handling & user messaging clarity.
3. Write a structured report to `${feature}/behavior-edge-case-review-report.md`.

## Invocation Example
```text
/Review-Behavior-Edge-Cases feature="components/order-service/"
```
