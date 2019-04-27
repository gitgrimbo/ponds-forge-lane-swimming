function formatForFilename(date) {
    const offset = date.getTimezoneOffset() * 60 * 1000;
    const isoString = new Date(date.getTime() - offset).toISOString();
    return isoString.replace(/\..*/gi, "").replace(/[:-]/gi, "").replace("T", "-");
}

module.exports = {
    formatForFilename,
};
