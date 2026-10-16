---
name: .NET Microservice Guidelines
description: Architectural standards, Clean Architecture guidelines, C# coding conventions, and xUnit testing patterns for .NET microservices.
---

# .NET Microservice Guidelines Skill

This skill enforces enterprise C# .NET Web API microservice design standards for Phase 3 implementation by `spec-to-code.agent.md`.

---

## 1. Clean Architecture Pattern

```text
src/
├── Controllers/         # HTTP Controllers handling routing & model binding
├── Services/            # Core Domain Logic & Business Rules
├── Repositories/        # EF Core DbContext & Data Access
└── Models/
    ├── Entities/        # EF Core Database Table Entities
    └── Dtos/            # Request / Response Data Transfer Objects
```

---

## 2. Standard API Response Envelope

All controllers MUST return responses wrapped in a standard JSON response structure:

```csharp
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public T? Data { get; set; }
    public ApiError? Error { get; set; }

    public static ApiResponse<T> Ok(T data) => new ApiResponse<T> { Success = true, Data = data };
    public static ApiResponse<T> Fail(string code, string message) => 
        new ApiResponse<T> { Success = false, Error = new ApiError { Code = code, Message = message } };
}
```

---

## 3. Mandatory Coding Rules
1. **Asynchronous I/O:** Always use `async` / `await` for database, file, and HTTP network calls (`await _dbContext.SaveChangesAsync()`).
2. **Dependency Injection:** Inject interfaces (`IFeatureService`) via constructor injection.
3. **Strongly-Typed Settings:** Inject environment configuration via `IOptions<FeatureOptions>`.
4. **Unit Tests:** Provide xUnit unit test classes under `tests/Unit/` covering 100% of domain service methods.
