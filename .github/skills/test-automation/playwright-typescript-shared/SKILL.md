---
name: Playwright TypeScript Shared Utilities
description: Shared Page Object Model base classes, resilient locators, authentication fixtures, and API context wrappers.
---

# Playwright TypeScript Shared Utilities Skill

This skill provides code standards for Playwright TypeScript E2E test suites generated in Phase 5.

---

## 1. Base Page Object Pattern (`base.page.ts`)

```typescript
import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async getToastMessage(): Promise<string> {
    const toast = this.page.getByRole('alert');
    await expect(toast).toBeVisible();
    return (await toast.textContent()) ?? '';
  }
}
```

---

## 2. Locators & Assertion Guidelines
- **Preferred Locators:** `page.getByRole()`, `page.getByTestId()`, `page.getByLabel()`.
- **Forbidden Methods:** `page.waitForTimeout()`, brittle XPath selectors (e.g. `//div[3]/span[2]`).
- **Assertions:** Always use web-first assertions: `await expect(locator).toBeVisible()`.
