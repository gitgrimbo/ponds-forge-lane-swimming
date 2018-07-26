/**
 * Replaces NARROW NO-BREAK SPACE and NO-BREAK SPACE with space.
 * @param {string} s 
 */
function fixStr(s) {
    return s.replace(/[\u202F\u00A0]/g, " ");
};

module.exports = fixStr;
