import { test, expect } from '@playwright/test';
import { TaskTrackerPage } from '../pages/task-tracker.page';

test.describe('Task Tracker E2E Live Test Suite', () => {
  let taskPage: TaskTrackerPage;

  test.beforeEach(async ({ page }) => {
    taskPage = new TaskTrackerPage(page);
    await taskPage.goto();
  });

  test('BTC-HP-02: Successful Task Creation with Valid Fields', async ({ page }) => {
    const taskTitle = 'Prepare Q4 Financial Report';
    const taskDesc = 'Include budget variance and revenue breakdown.';

    await taskPage.createTask(taskTitle, taskDesc, 'High');

    // Verify task card appears
    const taskCard = page.locator('.task-card', { hasText: taskTitle });
    await expect(taskCard).toBeVisible();

    // Verify Toast notification
    await expect(taskPage.toastNotification).toBeVisible();
    await expect(taskPage.toastNotification).toContainText('Task created successfully');
  });

  test('BTC-HP-03: Toggle Task Status from Pending to Completed', async ({ page }) => {
    const taskTitle = 'Submit Expense Report';
    await taskPage.createTask(taskTitle);

    const taskCard = page.locator('.task-card', { hasText: taskTitle });
    const checkbox = taskCard.locator('.task-checkbox');

    // Click checkbox to complete task
    await checkbox.click();

    // Verify status update on title
    const title = taskCard.locator('.task-card-title');
    await expect(title).toHaveClass(/completed-title/);
  });

  test('BTC-HP-05: Filtering Tasks by Status Tabs', async ({ page }) => {
    await taskPage.createTask('Pending Task 1');
    await taskPage.createTask('Completed Task 1');

    // Complete the second task
    const card2 = page.locator('.task-card', { hasText: 'Completed Task 1' });
    await card2.locator('.task-checkbox').click();

    // Filter Pending
    await taskPage.tabPending.click();
    await expect(page.locator('.task-card', { hasText: 'Pending Task 1' })).toBeVisible();
    await expect(page.locator('.task-card', { hasText: 'Completed Task 1' })).not.toBeVisible();

    // Filter Completed
    await taskPage.tabCompleted.click();
    await expect(page.locator('.task-card', { hasText: 'Completed Task 1' })).toBeVisible();
    await expect(page.locator('.task-card', { hasText: 'Pending Task 1' })).not.toBeVisible();
  });

  test('BTC-HP-06: Real-Time Search by Task Title', async ({ page }) => {
    await taskPage.createTask('Update Documentation');
    await taskPage.createTask('Fix Login Bug');

    await taskPage.searchInput.fill('Update');

    await expect(page.locator('.task-card', { hasText: 'Update Documentation' })).toBeVisible();
    await expect(page.locator('.task-card', { hasText: 'Fix Login Bug' })).not.toBeVisible();
  });

  test('BTC-HP-07: Successful Task Deletion via Accessible Modal', async ({ page }) => {
    const taskTitle = 'Legacy Code Cleanup';
    await taskPage.createTask(taskTitle);

    const taskCard = page.locator('.task-card', { hasText: taskTitle });
    await taskCard.locator('.delete-btn').click();

    // Modal should be visible
    await expect(taskPage.deleteModal).toBeVisible();
    await taskPage.confirmDeleteBtn.click();

    // Task card should be removed
    await expect(taskCard).not.toBeVisible();
  });

  test('BTC-NEG-01: Submission with Empty Title Field', async () => {
    await taskPage.submitBtn.click();

    // Validation hint should appear
    await expect(taskPage.titleError).toBeVisible();
    await expect(taskPage.titleError).toContainText('Task title cannot be blank');
  });
});
