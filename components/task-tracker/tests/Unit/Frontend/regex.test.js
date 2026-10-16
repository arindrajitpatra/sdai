import { escapeRegExp, createSearchRegex } from '../../../src/Frontend/js/utils/regex.js';

export function runRegexTests(assert) {
    assert.test('escapeRegExp - Escapes special regex characters safely', () => {
        const input = 'Report [2026] * budget? (v1)';
        const escaped = escapeRegExp(input);
        assert.equal(escaped, 'Report \\[2026\\] \\* budget\\? \\(v1\\)');
    });

    assert.test('createSearchRegex - Returns case-insensitive regex for search term', () => {
        const regex = createSearchRegex('  budget*  ');
        assert.notNull(regex);
        assert.isTrue(regex.test('Q4 Budget* Report'));
        assert.isTrue(regex.test('BUDGET*'));
        assert.isFalse(regex.test('Other Task'));
    });

    assert.test('createSearchRegex - Handles empty or whitespace queries', () => {
        assert.null(createSearchRegex(''));
        assert.null(createSearchRegex('   '));
        assert.null(createSearchRegex(null));
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
    runRegexTests(nodeAssertAdapter);
}

