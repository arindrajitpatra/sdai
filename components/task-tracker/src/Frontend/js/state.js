/**
 * Task State Management Engine
 * Handles local storage persistence, quota/disabled fallback, multi-tab sync, and reactive updates.
 */

const STORAGE_KEY = 'simple_task_tracker_items_v1';

class TaskStateManager {
    constructor() {
        this.tasks = [];
        this.filterStatus = 'All';
        this.searchQuery = '';
        this.isLocalStorageAvailable = false;
        this.listeners = [];

        this.initStorage();
        this.setupMultiTabSync();
    }

    /**
     * Tests localStorage capability (BR-08, EC-09).
     */
    initStorage() {
        try {
            const testKey = '__storage_test__';
            window.localStorage.setItem(testKey, testKey);
            window.localStorage.removeItem(testKey);
            this.isLocalStorageAvailable = true;
            this.loadFromStorage();
        } catch (e) {
            console.warn('localStorage is unavailable or disabled. Falling back to in-memory state.', e);
            this.isLocalStorageAvailable = false;
            this.tasks = this.getInitialSeedTasks();
        }
    }

    /**
     * Seeds initial default task items if storage is empty.
     */
    getInitialSeedTasks() {
        const today = new Date();
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + 7);

        return [
            {
                id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                title: 'Submit Q4 Budget Report',
                description: 'Prepare expense breakdown and upload sheet.',
                priority: 'High',
                dueDate: futureDate.toISOString().split('T')[0],
                status: 'Pending',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
                title: 'Team Alignment Sync',
                description: 'Review product roadmap and upcoming sprint backlog.',
                priority: 'Medium',
                dueDate: today.toISOString().split('T')[0],
                status: 'Completed',
                createdAt: new Date(Date.now() - 86400000).toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
    }

    loadFromStorage() {
        if (!this.isLocalStorageAvailable) return;
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (raw) {
                this.tasks = JSON.parse(raw);
            } else {
                this.tasks = this.getInitialSeedTasks();
                this.saveToStorage();
            }
        } catch (e) {
            console.error('Failed to parse localStorage tasks:', e);
            this.tasks = this.getInitialSeedTasks();
        }
    }

    saveToStorage() {
        if (!this.isLocalStorageAvailable) return;
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks));
        } catch (e) {
            console.error('QuotaExceededError or write failure in localStorage:', e);
            this.isLocalStorageAvailable = false;
            this.notify();
        }
    }

    /**
     * Listens for multi-tab updates (EC-10).
     */
    setupMultiTabSync() {
        if (typeof window !== 'undefined') {
            window.addEventListener('storage', (event) => {
                if (event.key === STORAGE_KEY) {
                    try {
                        this.tasks = event.newValue ? JSON.parse(event.newValue) : [];
                        this.notify();
                    } catch (e) {
                        console.error('Error syncing tab state from storage event:', e);
                    }
                }
            });
        }
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notify() {
        this.listeners.forEach(listener => listener(this.getState()));
    }

    getState() {
        return {
            tasks: [...this.tasks],
            filterStatus: this.filterStatus,
            searchQuery: this.searchQuery,
            isLocalStorageAvailable: this.isLocalStorageAvailable
        };
    }

    setFilterStatus(status) {
        this.filterStatus = status;
        this.notify();
    }

    setSearchQuery(query) {
        this.searchQuery = query;
        this.notify();
    }

    addTask(taskData) {
        const newTask = {
            id: crypto.randomUUID ? crypto.randomUUID() : 'task-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            title: taskData.title.trim(),
            description: taskData.description ? taskData.description.trim() : '',
            priority: taskData.priority || 'Medium',
            dueDate: taskData.dueDate,
            status: 'Pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.tasks.unshift(newTask);
        this.saveToStorage();
        this.notify();
        return newTask;
    }

    toggleTaskStatus(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.status = task.status === 'Completed' ? 'Pending' : 'Completed';
            task.updatedAt = new Date().toISOString();
            this.saveToStorage();
            this.notify();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveToStorage();
        this.notify();
    }
}

export const taskStore = new TaskStateManager();
