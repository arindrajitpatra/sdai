---
name: Configurable Variables Guidelines
description: Best practices, security standards, and code patterns for externalizing configurations, environment variables, feature flags, and secrets management.
---

# Configurable Variables & Secret Management Guidelines Skill

This skill enforces environment variable externalization, feature flag management, and secret security policies across all code generated during Phase 3 (`spec-to-code.agent.md`) and audited during Phase 4 (`code-verifier.agent.md`).

---

## 1. Zero-Hardcoding Security Policy

1. **No Embedded Credentials:** Database connection strings, API keys, JWT signing keys, OAuth client secrets, and passwords MUST NEVER be hardcoded in source files.
2. **Environment Overrides:** Production applications must read settings strictly from operating system environment variables or cloud key vaults (Azure Key Vault, AWS Secrets Manager, HashiCorp Vault).

---

## 2. Strong Typing & Options Pattern (.NET & Node.js)

### C# .NET Options Pattern

```csharp
// 1. Definition
public class TaskTrackerOptions
{
    public const string SectionName = "TaskTracker";
    
    public int MaxTaskTitleLength { get; set; } = 50;
    public int MaxDefaultPageSize { get; set; } = 25;
    public bool EnableAuditLogging { get; set; } = true;
    public string ConnectionString { get; set; } = string.Empty;
}

// 2. Registration in Program.cs
builder.Services.Configure<TaskTrackerOptions>(
    builder.Configuration.GetSection(TaskTrackerOptions.SectionName));

// 3. Injection into Service
public class TaskService : ITaskService
{
    private readonly TaskTrackerOptions _options;
    
    public TaskService(IOptions<TaskTrackerOptions> options)
    {
        _options = options.Value;
    }
}
```

### TypeScript / Node.js Environment Validation

```typescript
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  DATABASE_URL: z.string().url(),
  ENABLE_FEATURE_FLAGS: z.string().transform((val) => val === 'true').default('false')
});

export const env = envSchema.parse(process.env);
```

---

## 3. Configuration Hierarchy

```text
1. System Environment Variables (Highest Priority - Production Overrides)
2. Secret Vault / Azure Key Vault / HashiCorp Vault
3. appsettings.{Environment}.json / .env.{environment}
4. appsettings.json / .env (Default Baseline Settings)
```
