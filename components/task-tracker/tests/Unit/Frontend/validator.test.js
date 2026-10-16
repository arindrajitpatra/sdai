import { validateTaskForm } from '../../../src/Frontend/js/validator.js';

export function runValidatorTests(assert) {
    const refDate = new Date('2026-10-07T00:00:00Z');

    assert.test('validateTaskForm - Valid inputs pass validation', () => {
        const formData = {
            title: 'Submit Q4 Budget',
            description: 'Prepare expense breakdown.',
            priority: 'High',
            dueDate: '2026-10-15'
        };
        const result = validateTaskForm(formData, refDate);
        assert.isTrue(result.isValid);
        assert.equal(Object.keys(result.errors).length, 0);
    });

    assert.test('validateTaskForm - Blank title fails validation (EC-01)', () => {
        const formData = {
            title: '   ',
            dueDate: '2026-10-15'
        };
        const result = validateTaskForm(formData, refDate);
        assert.isFalse(result.isValid);
        assert.equal(result.errors.title, 'Task title cannot be blank.');
    });

    assert.test('validateTaskForm - Title > 50 chars fails validation (EC-02)', () => {
        const formData = {
            title: 'A'.repeat(51),
            dueDate: '2026-10-15'
        };
        const result = validateTaskForm(formData, refDate);
        assert.isFalse(result.isValid);
        assert.equal(result.errors.title, 'Task title cannot exceed 50 characters.');
    });

    assert.test('validateTaskForm - Description > 500 chars fails validation (EC-02)', () => {
        const formData = {
            title: 'Valid Title',
            description: 'D'.repeat(501),
            dueDate: '2026-10-15'
        };
        const result = validateTaskForm(formData, refDate);
        assert.isFalse(result.isValid);
        assert.equal(result.errors.description, 'Description cannot exceed 500 characters.');
    });

    assert.test('validateTaskForm - Due date > 365 days in past fails validation (EC-03)', () => {
        const formData = {
            title: 'Past Task',
            dueDate: '2025-10-06' // 366 days in past from 2026-10-07
        };
        const result = validateTaskForm(formData, refDate);
        assert.isFalse(result.isValid);
        assert.equal(result.errors.dueDate, 'Due date must be between 1 year in the past and 5 years in the future.');
    });

    assert.test('validateTaskForm - Due date > 1825 days in future fails validation (EC-03)', () => {
        const formData = {
            title: 'Far Future Task',
            dueDate: '2031-10-08' // 1827 days in future
        };
        const result = validateTaskForm(formData, refDate);
        assert.isFalse(result.isValid);
        assert.equal(result.errors.dueDate, 'Due date must be between 1 year in the past and 5 years in the future.');
    });
}

if (typeof process !== 'undefined' && process?.versions?.node) {
    const { default: test } = await import('node:test');
    const { default: assert } = await import('node:assert/strict');
    const nodeAssertAdapter = {
        test: (name, fn) => test(name, fn),
        equal: (actual, expected, msg) => assert.strictEqual(actual, expected, msg),
        isTrue: (val, msg) => assert.strictEqual(val, true, msg),
        isFalse: (val, msg) => assert.strictEqual(val, false, msg),
        null: (val, msg) => assert.strictEqual(val, null, msg),
        notNull: (val, msg) => assert.notStrictEqual(val, null, msg) && assert.notStrictEqual(val, undefined, msg)
    };
    runValidatorTests(nodeAssertAdapter);
}

