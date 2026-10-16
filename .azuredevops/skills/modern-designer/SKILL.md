---
name: Modern Designer
description: Design principles and architectural templates for cloud-native microservices, event-driven systems, and modern APIs.
---

# Modern Designer Skill

Equips `@devils-advocate` and `/Create-Tech-Spec-MD` with architectural principles for designing resilient cloud microservices.

---

## 1. Architectural Patterns

### CQRS (Command Query Responsibility Segregation)
- **Commands:** Mutate state (`CreateTaskCommand`, `CompleteTaskCommand`). Return minimal response payloads.
- **Queries:** Read state (`GetTasksQuery`, `SearchTasksQuery`). Optimized for read performance.

### Idempotency Guarantee
- Every state mutation API MUST support idempotency headers (`X-Idempotency-Key`) to prevent duplicate record creation during network retries.

---

## 2. Event-Driven Messaging Schema Template

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "DomainEventEnvelope",
  "type": "object",
  "properties": {
    "eventId": { "type": "string", "format": "uuid" },
    "eventType": { "type": "string", "example": "TaskCreatedEvent" },
    "timestamp": { "type": "string", "format": "date-time" },
    "correlationId": { "type": "string", "format": "uuid" },
    "payload": { "type": "object" }
  },
  "required": ["eventId", "eventType", "timestamp", "payload"]
}
```
