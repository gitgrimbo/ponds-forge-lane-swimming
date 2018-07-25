const fs = require("fs");
const path = require("path");

const date = require("../date");

function saveFile(name, content) {
    const filename = path.join("temp", date.formatForFilename(new Date()) + "_" + name);
    fs.writeFileSync(filename, content, "UTF8");
}

module.exports = {
    saveFile,
};
