const fs = require("fs");
const path = require("path");
const rp = require("request-promise");

const date = require("./date");

function saveURL(folder, url, content) {
    const name = url.replace(/[^a-zA-Z0-9_-]/gi, "_");
    const filename = path.join(folder, date.formatForFilename(new Date()) + "_" + name);
    fs.writeFileSync(filename, content);
}

async function xhr(opts) {
    const { uri } = opts;
    const response = await rp(opts);
    if (opts.saveResources) {
        saveURL("temp", uri, response);
    }
    return response;
}

module.exports = xhr;
