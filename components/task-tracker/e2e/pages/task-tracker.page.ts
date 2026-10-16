import { Page, Locator, expect } from '@playwright/test';

export class TaskTrackerPage {
  readonly page: Page;
  readonly titleInput: Locator;
  readonly descInput: Locator;
  readonly prioritySelect: Locator;
  readonly dueDateInput: Locator;
  readonly submitBtn: Locator;
  readonly searchInput: Locator;
  readonly tabAll: Locator;
  readonly tabPending: Locator;
  readonly tabCompleted: Locator;
  readonly taskListContainer: Locator;
  readonly toastNotification: Locator;
  readonly deleteModal: Locator;
  readonly confirmDeleteBtn: Locator;
  readonly cancelDeleteBtn: Locator;
  readonly titleError: Locator;
  readonly titleCharCounter: Locator;

  constructor(page: Page) {
    this.page = page;
    this.titleInput = page.locator('#task-title-input');
    this.descInput = page.locator('#task-desc-input');
    this.prioritySelect = page.locator('#task-priority-select');
    this.dueDateInput = page.locator('#task-duedate-input');
    this.submitBtn = page.locator('#submit-task-btn');
    this.searchInput = page.locator('#task-search-input');
    this.tabAll = page.locator('#tab-all');
    this.tabPending = page.locator('#tab-pending');
    this.tabCompleted = page.locator('#tab-completed');
    this.taskListContainer = page.locator('#task-list-container');
    this.toastNotification = page.locator('#toast-notification');
    this.deleteModal = page.locator('#delete-modal');
    this.confirmDeleteBtn = page.locator('#modal-confirm-btn');
    this.cancelDeleteBtn = page.locator('#modal-cancel-btn');
    this.titleError = page.locator('#title-error');
    this.titleCharCounter = page.locator('#title-char-counter');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
    await expect(this.titleInput).toBeVisible();
  }

  async createTask(title: string, desc: string = '', priority: string = 'Medium', dueDate?: string): Promise<void> {
    await this.titleInput.fill(title);
    if (desc) await this.descInput.fill(desc);
    await this.prioritySelect.selectOption(priority);

    if (!dueDate) {
      // Default due date to 3 days in future
      const future = new Date();
      future.setDate(future.getDate() + 3);
      dueDate = future.toISOString().split('T')[0];
    }
    await this.dueDateInput.fill(dueDate);

    await this.submitBtn.click();
  }
}
