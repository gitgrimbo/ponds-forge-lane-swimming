const { expect } = require("chai");

const TimetableParser = require("../TimetableParser");

const { brLines } = TimetableParser;

describe("ponds-forgev3/TimetableParser.brLines", () => {
  it("brLines", () => {
    const expected = [
      "6.30am - 3.15pm: Lane (25m) Swimming",
      "12.00pm - 1.00pm: Age UK (Session available to all Age UK card holders)",
      "3,15pm - 4.00pm: Lane Swimming - Limited Availability",
      "4.00pm - 9.30pm: Lane (50m) Swimming - Limited Availability",
      "7.30pm - 9.30pm: Swimfit",
    ];
    const $ = TimetableParser.loadHtml("");
    const paraHtml = "6.30am - 3.15pm: Lane (25m) Swimming<br />12.00pm - 1.00pm: Age UK&nbsp;(Session available to all Age UK card holders) <br />3,15pm - 4.00pm: Lane Swimming - Limited Availability<br />4.00pm - 9.30pm:<span>&nbsp;Lane (50m) Swimming - Limited Availability</span><br />7.30pm - 9.30pm: Swimfit&nbsp;";
    const actual = brLines($, paraHtml);
    expect(actual).to.be.an("array");
    expect(actual).to.deep.equal(expected);
  });
});
