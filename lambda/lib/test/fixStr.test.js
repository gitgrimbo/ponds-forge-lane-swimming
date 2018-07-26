const chai = require("chai");
const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const fixStr = require("../fixStr");

const expect = chai.expect;

function extractHTMLText(html) {
    const $ = cheerio.load("<div>" + html + "</div>");
    return $(":root").find("div").text();
}

describe("fixStr", () => {
    it("nbsp.html", () => {
        const html = fs.readFileSync(path.join(__dirname, "./nbsp.html"), "utf8");
        const actual = extractHTMLText(html);
        expect(fixStr(actual)).to.be.equal("9:45am Tuesday 31st July");
    });
});
