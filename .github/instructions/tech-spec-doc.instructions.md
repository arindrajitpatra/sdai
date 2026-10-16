---
description: Comprehensive architecture standards for authoring Phase 2 tech-spec.md technical specification documents.
---

# Technical Specification Document Instructions (`tech-spec.md`)

When generating or refining `tech-spec.md` in Phase 2 of the ASDLC, GitHub Copilot and technical architects MUST follow these detailed engineering standards to ensure `spec-to-code.agent.md` can build the feature code with zero ambiguity.

---

## 1. Architectural Integrity & Rules

1. **Direct Spec Mapping:** Every technical component, API route, and database model in `tech-spec.md` MUST map directly back to requirement IDs (`BR-XX`) in `behavior.md`.
2. **Concrete Schemas:** Provide exact JSON request/response schemas, TypeScript interfaces, and SQL DDL tables. Do NOT leave fields as vague descriptions.
3. **Ordered Micro-Task Checklist:** The document MUST terminate with an ordered, checkable **Implementation Micro-Tasks Breakdown** list that `spec-to-code.agent.md` can execute sequentially.

---

## 2. Mandatory Section Structure

```markdown
# Technical Specification: [Feature Name]

## Metadata
- **Behavior Spec Reference:** `behavior.md`
- **Target Microservice/Component:** `components/<feature-name>/`
- **Architecture Style:** Clean Architecture / REST / gRPC

---

## 1. Component Architecture & Directory Structure

```text
components/<feature-name>/
├── src/
│   ├── Controllers/
│   │   └── FeatureController.cs
│   ├── Services/
│   │   ├── IFeatureService.cs
│   │   └── FeatureService.cs
│   ├── Repositories/
│   │   ├── IFeatureRepository.cs
│   │   └── FeatureRepository.cs
│   └── Models/
│       ├── Entities/
│       └── Dtos/
└── tests/
    └── Unit/
```

---

## 2. API Contracts & Endpoint Definitions

### Endpoint: `POST /api/v1/[resource]`
- **Summary:** Creates a new feature record.
- **Requirement Ref:** `BR-01`, `BR-02`
- **Headers:**
  - `Authorization`: `Bearer <JWT_TOKEN>`
  - `Content-Type`: `application/json`
  - `X-Correlation-ID`: `<UUID>`

#### Request Body Schema (JSON)
```json
{
  "title": "string (required, max 100 chars)",
  "categoryId": "integer (required, > 0)",
  "metadata": {
    "tags": ["string"]
  }
}
```

#### Response Schemas
##### 201 Created
```json
{
  "success": true,
  "data": {
    "id": 12345,
    "title": "Sample Title",
    "createdAt": "2026-10-07T20:00:00Z"
  },
  "error": null
}
```

##### 400 Bad Request
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Title cannot be empty",
    "details": [{ "field": "title", "issue": "Required field" }]
  }
}
```

---

## 3. Data Model & Database DDL

```sql
CREATE TABLE feature_records (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    category_id INT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_feature_records_status ON feature_records(status);
```

---

## 4. Implementation Micro-Tasks Breakdown

Sequential checklist for `spec-to-code.agent.md`:
- [ ] Task 1: Create SQL DDL migration file and entity data models in `src/Models/Entities/`.
- [ ] Task 2: Implement Repository interface `IFeatureRepository` and EF Core implementation.
- [ ] Task 3: Build Service layer `IFeatureService` with domain validation rules (`BR-01`, `BR-02`).
- [ ] Task 4: Implement REST API Controller `FeatureController` with OpenAPI annotations.
- [ ] Task 5: Build frontend UI components and bind HTTP requests.
- [ ] Task 6: Write xUnit/Jest unit tests covering 100% of Service and Controller methods.
```
