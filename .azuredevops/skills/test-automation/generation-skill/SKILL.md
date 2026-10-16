---
name: Test Automation Generation Skill
description: Design patterns, Page Object Model templates, and Playwright TypeScript code synthesis rules.
---

# Test Automation Generation Skill

Equips `@test-automation-generator` to output clean, resilient Playwright TypeScript test scripts.

---

## 1. Page Object Model (POM) Template

```typescript
import { Page, Locator, expect } from '@playwright/test';

export class TaskTrackerPage {
  readonly page: Page;
  readonly taskTitleInput: Locator;
  readonly addTaskButton: Locator;
  readonly taskItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.taskTitleInput = page.getByPlaceholder('Enter task title...');
    this.addTaskButton = page.getByRole('button', { name: 'Add Task' });
    this.taskItems = page.getByTestId('task-item');
  }

  async navigateTo(): Promise<void> {
    await this.page.goto('/tasks');
    await expect(this.taskTitleInput).toBeVisible();
  }

  async addTask(title: string): Promise<void> {
    await this.taskTitleInput.fill(title);
    await this.addTaskButton.click();
  }

  async assertTaskCount(expectedCount: number): Promise<void> {
    await expect(this.taskItems).toHaveCount(expectedCount);
  }
}
```

---

## 2. Test Script Template

```typescript
import { test, expect } from '@playwright/test';
import { TaskTrackerPage } from '../pages/<feature-name>.page';

test.describe('Task Tracker E2E Suite', () => {
  let taskPage: TaskTrackerPage;

  test.beforeEach(async ({ page }) => {
    taskPage = new TaskTrackerPage(page);
    await taskPage.navigateTo();
  });

  test('BTC-HP-01: User can add a new task successfully', async () => {
    await taskPage.addTask('Complete ASDLC Documentation');
    await taskPage.assertTaskCount(1);
  });
});
```
