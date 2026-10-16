import { validateTaskForm } from '../validator.js';
import { taskStore } from '../state.js';

export function initTaskForm(showToastCallback) {
    const form = document.getElementById('create-task-form');
    const titleInput = document.getElementById('task-title-input');
    const descInput = document.getElementById('task-desc-input');
    const prioritySelect = document.getElementById('task-priority-select');
    const dueDateInput = document.getElementById('task-duedate-input');
    const submitBtn = document.getElementById('submit-task-btn');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');
    const btnText = submitBtn.querySelector('.btn-text');

    const titleCharCounter = document.getElementById('title-char-counter');
    const descCharCounter = document.getElementById('desc-char-counter');

    const titleError = document.getElementById('title-error');
    const descError = document.getElementById('desc-error');
    const dateError = document.getElementById('date-error');

    // Default Due Date to today's date in YYYY-MM-DD
    const todayISO = new Date().toISOString().split('T')[0];
    dueDateInput.value = todayISO;

    // Live Character Counters (BR-02)
    titleInput.addEventListener('input', () => {
        titleCharCounter.textContent = `${titleInput.value.length}/50`;
        clearError(titleInput, titleError);
    });

    descInput.addEventListener('input', () => {
        descCharCounter.textContent = `${descInput.value.length}/500`;
        clearError(descInput, descError);
    });

    dueDateInput.addEventListener('input', () => {
        clearError(dueDateInput, dateError);
    });

    function clearError(inputElement, errorElement) {
        inputElement.classList.remove('input-error');
        errorElement.textContent = '';
        errorElement.classList.add('hidden');
    }

    function showError(inputElement, errorElement, message) {
        inputElement.classList.add('input-error');
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    }

    function clearAllErrors() {
        clearError(titleInput, titleError);
        clearError(descInput, descError);
        clearError(dueDateInput, dateError);
    }

    // Form Submission Handler (BR-02, BR-06, BR-07, EC-08)
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Anti-Double Submission Lock (BR-02, EC-08)
        if (submitBtn.disabled) return;

        submitBtn.disabled = true;
        btnSpinner.classList.remove('hidden');
        btnText.textContent = 'Adding Task...';

        clearAllErrors();

        const formData = {
            title: titleInput.value,
            description: descInput.value,
            priority: prioritySelect.value,
            dueDate: dueDateInput.value
        };

        const validation = validateTaskForm(formData);

        if (!validation.isValid) {
            if (validation.errors.title) showError(titleInput, titleError, validation.errors.title);
            if (validation.errors.description) showError(descInput, descError, validation.errors.description);
            if (validation.errors.dueDate) showError(dueDateInput, dateError, validation.errors.dueDate);

            // Re-enable submit button
            submitBtn.disabled = false;
            btnSpinner.classList.add('hidden');
            btnText.textContent = '+ Add Task';
            return;
        }

        // Save Task to Store
        taskStore.addTask(formData);

        // Reset Form & Re-enable Submit
        form.reset();
        titleInput.value = '';
        descInput.value = '';
        prioritySelect.value = 'Medium';
        dueDateInput.value = todayISO;
        titleCharCounter.textContent = '0/50';
        descCharCounter.textContent = '0/500';

        submitBtn.disabled = false;
        btnSpinner.classList.add('hidden');
        btnText.textContent = '+ Add Task';

        if (showToastCallback) {
            showToastCallback('Task created successfully!');
        }
    });
}
