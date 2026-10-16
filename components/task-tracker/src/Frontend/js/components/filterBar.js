import { taskStore } from '../state.js';

export function initFilterBar() {
    const searchInput = document.getElementById('task-search-input');
    const tabButtons = document.querySelectorAll('.filter-tabs .tab-btn');

    // Real-Time Search Handler (BR-04, EC-05)
    searchInput.addEventListener('input', (e) => {
        taskStore.setSearchQuery(e.target.value);
    });

    // Filter Tab Buttons Handler (BR-04)
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });

            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');

            const filterValue = button.getAttribute('data-filter');
            taskStore.setFilterStatus(filterValue);
        });
    });
}
