import { taskStore } from '../state.js';
import { createSearchRegex } from '../utils/regex.js';
import { openDeleteModal } from './deleteModal.js';

export function renderTaskList(container, state) {
    container.innerHTML = '';

    const { tasks, filterStatus, searchQuery } = state;
    const regex = createSearchRegex(searchQuery);

    // Filter Tasks (BR-01, BR-04, EC-04, EC-05)
    let filtered = tasks.filter(task => {
        // Status filter
        if (filterStatus === 'Pending' && task.status !== 'Pending') return false;
        if (filterStatus === 'Completed' && task.status !== 'Completed') return false;

        // Search filter with regex escape
        if (regex && !regex.test(task.title)) return false;

        return true;
    });

    // Empty State UI (EC-04)
    if (filtered.length === 0) {
        let emptySubtitle = 'Create a new task using the form or adjust your search filters.';
        if (filterStatus === 'Completed') emptySubtitle = 'No completed tasks found. Keep making progress!';
        if (filterStatus === 'Pending') emptySubtitle = 'No pending tasks! All caught up.';
        if (searchQuery.trim()) emptySubtitle = `No tasks matching "${escapeHtml(searchQuery.trim())}".`;

        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📋</div>
                <h3 class="empty-title">No Tasks Found</h3>
                <p class="empty-subtitle">${emptySubtitle}</p>
            </div>
        `;
        return;
    }

    // Render Cards
    filtered.forEach(task => {
        const isCompleted = task.status === 'Completed';
        const card = document.createElement('article');
        card.className = 'task-card';
        card.dataset.id = task.id;

        card.innerHTML = `
            <div class="task-checkbox-wrapper">
                <input type="checkbox" class="task-checkbox" ${isCompleted ? 'checked' : ''} 
                       aria-label="Mark task '${escapeHtml(task.title)}' as ${isCompleted ? 'pending' : 'completed'}">
            </div>

            <div class="task-content">
                <div class="task-card-header">
                    <h3 class="task-card-title ${isCompleted ? 'completed-title' : ''}">${escapeHtml(task.title)}</h3>
                    <span class="priority-badge ${task.priority.toLowerCase()}">${escapeHtml(task.priority)}</span>
                </div>
                ${task.description ? `<p class="task-card-desc">${escapeHtml(task.description)}</p>` : ''}
                <div class="task-meta-row">
                    <span class="due-date-label">📅 Due: ${escapeHtml(task.dueDate)}</span>
                </div>
            </div>

            <button type="button" class="delete-btn" aria-label="Delete task '${escapeHtml(task.title)}'">
                🗑️
            </button>
        `;

        // Checkbox Toggle Event (BR-03)
        const checkbox = card.querySelector('.task-checkbox');
        checkbox.addEventListener('change', () => {
            taskStore.toggleTaskStatus(task.id);
        });

        // Delete Button Modal Event (BR-05)
        const deleteBtn = card.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            openDeleteModal(task);
        });

        container.appendChild(card);
    });
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
