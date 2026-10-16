import { taskStore } from './state.js';
import { initTaskForm } from './components/taskForm.js';
import { initFilterBar } from './components/filterBar.js';
import { initDeleteModal } from './components/deleteModal.js';
import { renderTaskList } from './components/taskList.js';

document.addEventListener('DOMContentLoaded', () => {
    const taskListContainer = document.getElementById('task-list-container');
    const storageBanner = document.getElementById('storage-banner');
    const toast = document.getElementById('toast-notification');

    const statTotal = document.getElementById('stat-total');
    const statPending = document.getElementById('stat-pending');
    const statCompleted = document.getElementById('stat-completed');

    let toastTimeout = null;

    function showToast(message) {
        if (toastTimeout) clearTimeout(toastTimeout);
        toast.textContent = message;
        toast.classList.remove('hidden');

        toastTimeout = setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }

    // Initialize UI Components
    initTaskForm(showToast);
    initFilterBar();
    initDeleteModal(showToast);

    // Subscribe to State Engine Changes
    taskStore.subscribe((state) => {
        // 1. Update Storage Warning Banner Visibility (BR-08, EC-09)
        if (!state.isLocalStorageAvailable) {
            storageBanner.classList.remove('hidden');
        } else {
            storageBanner.classList.add('hidden');
        }

        // 2. Update Stats Counter Pills
        const total = state.tasks.length;
        const pending = state.tasks.filter(t => t.status === 'Pending').length;
        const completed = state.tasks.filter(t => t.status === 'Completed').length;

        statTotal.textContent = total;
        statPending.textContent = pending;
        statCompleted.textContent = completed;

        // 3. Render Task Cards Grid
        renderTaskList(taskListContainer, state);
    });

    // Trigger Initial Render
    taskStore.notify();
});
