/**
 * Safe Regex Special Character Escaper Utility
 * Escapes special regex characters in user search inputs to prevent invalid RegExp exceptions.
 * 
 * @param {string} input Raw search string
 * @returns {string} Escaped search string safe for RegExp construction
 */
export function escapeRegExp(input) {
    if (typeof input !== 'string') {
        return '';
    }
    // Escapes special characters: \ ^ $ * + ? . ( ) | [ ] { }
    return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Creates a case-insensitive safe RegExp for matching target text.
 * Trims leading and trailing whitespace without mutating user search input UI.
 * 
 * @param {string} searchTerm User search query
 * @returns {RegExp|null} Safe RegExp or null if empty
 */
export function createSearchRegex(searchTerm) {
    if (!searchTerm) return null;
    const trimmed = searchTerm.trim();
    if (!trimmed) return null;
    const escaped = escapeRegExp(trimmed);
    return new RegExp(escaped, 'i');
}
