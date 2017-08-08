function formatForFilename(date) {
    return date.toISOString().replace(/\..*/gi, "").replace(/[:-]/gi, "").replace("T", "-");
}

module.exports = {
    formatForFilename,
};
