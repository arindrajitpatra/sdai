---
name: Test Automation Folder Structure Skill
description: Standardized directory layout for Playwright TypeScript test automation projects.
---

# Test Automation Folder Structure Skill

All Playwright E2E automation assets MUST adhere to this directory structure:

```text
e2e/
├── config/
│   └── playwright.config.ts
├── pages/
│   ├── base.page.ts
│   └── [feature].page.ts
├── tests/
│   ├── [feature].spec.ts
│   └── api-[feature].spec.ts
├── fixtures/
│   └── test-data.json
└── utils/
    └── api-client.ts
```
