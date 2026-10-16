---
name: Discover Feature Repos
description: Discovery protocols and repository inspection routines to map microservices, components, and project structures.
---

# Discover Feature Repos Skill

This skill equips agents (`@app-launcher`, `@code-verifier`, `@pr-review`) with automated repository navigation protocols to discover project boundaries, dependency trees, and configuration manifests across mono-repo or multi-repo workspaces.

---

## 1. Directory & Manifest Scanning Rules

1. **Manifest File Scanning:** Search for project markers:
   - C# / .NET: `*.csproj`, `*.sln`
   - Node.js / React: `package.json`, `tsconfig.json`
   - Python: `pyproject.toml`, `requirements.txt`
   - Java / Kotlin: `pom.xml`, `build.gradle`
2. **Component Folder Isolation:** Treat every sub-folder inside `components/` as an isolated domain package containing specs (`behavior.md`, `tech-spec.md`), source code (`src/`), unit tests (`tests/`), and E2E automation (`e2e/`).

---

## 2. Discovery Shell Scripting Routines

```powershell
# PowerShell Repository Discovery Function
function Get-FeatureRepositories {
    param ([string]$RootPath = "components")
    
    Get-ChildItem -Path $RootPath -Directory | ForEach-Object {
        [PSCustomObject]@{
            ComponentName = $_.Name
            HasBehaviorSpec = Test-Path (Join-Path $_.FullName "behavior.md")
            HasTechSpec     = Test-Path (Join-Path $_.FullName "tech-spec.md")
            HasSourceCode   = Test-Path (Join-Path $_.FullName "src")
            HasE2ETests     = Test-Path (Join-Path $_.FullName "e2e")
        }
    }
}
```
