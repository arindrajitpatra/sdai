/**
 * Client-Side Form Validation & Boundary Engine
 * Implements BR-02, BR-06, BR-07, EC-01, EC-02, EC-03 validation logic.
 */

export const MAX_TITLE_LENGTH = 50;
export const MAX_DESCRIPTION_LENGTH = 500;
export const MIN_DUE_DATE_PAST_DAYS = 365;
export const MAX_DUE_DATE_FUTURE_DAYS = 1825;

export function validateTaskForm(formData, referenceDate = new Date()) {
    const errors = {};
    const title = formData.title ? formData.title.trim() : '';
    const description = formData.description ? formData.description.trim() : '';
    const dueDateStr = formData.dueDate ? formData.dueDate.trim() : '';
    const priority = formData.priority || 'Medium';

    // 1. Title Validation (BR-02, BR-06, EC-01, EC-02)
    if (!title) {
        errors.title = 'Task title cannot be blank.';
    } else if (title.length > MAX_TITLE_LENGTH) {
        errors.title = `Task title cannot exceed ${MAX_TITLE_LENGTH} characters.`;
    }

    // 2. Description Validation (BR-02, BR-06, EC-02)
    if (description && description.length > MAX_DESCRIPTION_LENGTH) {
        errors.description = `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters.`;
    }

    // 3. Priority Validation
    const validPriorities = ['Low', 'Medium', 'High'];
    if (!validPriorities.includes(priority)) {
        errors.priority = "Priority must be 'Low', 'Medium', or 'High'.";
    }

    // 4. Due Date Validation (BR-07, EC-03)
    if (!dueDateStr) {
        errors.dueDate = 'Due date is required.';
    } else {
        const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!isoDateRegex.test(dueDateStr)) {
            errors.dueDate = 'Due date must be formatted in ISO YYYY-MM-DD format.';
        } else {
            const [year, month, day] = dueDateStr.split('-').map(Number);
            const inputDate = new Date(Date.UTC(year, month - 1, day));
            
            if (isNaN(inputDate.getTime())) {
                errors.dueDate = 'Invalid calendar date.';
            } else {
                const todayUtc = new Date(Date.UTC(
                    referenceDate.getUTCFullYear(),
                    referenceDate.getUTCMonth(),
                    referenceDate.getUTCDate()
                ));

                const minDate = new Date(todayUtc);
                minDate.setUTCDate(todayUtc.getUTCDate() - MIN_DUE_DATE_PAST_DAYS);

                const maxDate = new Date(todayUtc);
                maxDate.setUTCDate(todayUtc.getUTCDate() + MAX_DUE_DATE_FUTURE_DAYS);

                if (inputDate < minDate || inputDate > maxDate) {
                    errors.dueDate = 'Due date must be between 1 year in the past and 5 years in the future.';
                }
            }
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}
