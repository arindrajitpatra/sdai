import { taskStore } from '../state.js';

let activeTaskToDelete = null;
let lastFocusedElement = null;

export function initDeleteModal(showToastCallback) {
    const modal = document.getElementById('delete-modal');
    const closeXBtn = document.getElementById('modal-close-x');
    const cancelBtn = document.getElementById('modal-cancel-btn');
    const confirmBtn = document.getElementById('modal-confirm-btn');

    closeXBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Backdrop overlay click triggers Cancel (EC-06)
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    confirmBtn.addEventListener('click', () => {
        if (activeTaskToDelete) {
            taskStore.deleteTask(activeTaskToDelete.id);
            closeModal();
            if (showToastCallback) {
                showToastCallback('Task permanently deleted.');
            }
        }
    });

    // Keyboard bindings & Focus Trap (BR-05, EC-06)
    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('hidden')) return;

        if (e.key === 'Escape') {
            e.preventDefault();
            closeModal();
        } else if (e.key === 'Enter' && !e.target.matches('button, input, select, textarea')) {
            e.preventDefault();
            confirmBtn.click();
        } else if (e.key === 'Tab') {
            trapFocus(e, modal);
        }
    });
}

export function openDeleteModal(task) {
    activeTaskToDelete = task;
    lastFocusedElement = document.activeElement;

    const modal = document.getElementById('delete-modal');
    const preview = document.getElementById('modal-task-preview');
    const confirmBtn = document.getElementById('modal-confirm-btn');

    preview.textContent = task.title;
    modal.classList.remove('hidden');

    // Set initial focus to confirm button for accessibility
    setTimeout(() => {
        confirmBtn.focus();
    }, 50);
}

export function closeModal() {
    const modal = document.getElementById('delete-modal');
    modal.classList.add('hidden');
    activeTaskToDelete = null;

    if (lastFocusedElement) {
        lastFocusedElement.focus();
    }
}

function trapFocus(event, modalElement) {
    const focusableElements = modalElement.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
        if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        }
    } else {
        if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    }
}
