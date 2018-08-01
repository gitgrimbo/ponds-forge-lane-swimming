const { expect } = require("chai");
const fs = require("fs");
const path = require("path");

const { newTimetableItem, expectTimetableItem } = require("./utils");
const TimetableParser = require("../TimetableParser");

describe("ponds-forgev2/TimetableParser", () => {
    it("swimming-ponds-forge.html", () => {
        const html = fs.readFileSync(path.join(__dirname, "./swimming-ponds-forge.html"));

        const timetable = TimetableParser.timetableFromHTML(html, { trace: true });

        expect(timetable).to.have.lengthOf(7);

        function checkMonday() {
            const tt0 = timetable[0];
            expect(tt0).to.be.an("object");
            expect(tt0.day).to.equal(1);
            expect(tt0.items).to.have.lengthOf(4);
            expectTimetableItem(tt0.items[0], newTimetableItem("1", "06:30", "08:00", "Lane (25m) Swimming", "Diving Pool", []));
            expectTimetableItem(tt0.items[1], newTimetableItem("1", "08:00", "22:00", "Lane (25m) Swimming", "Competition Pool", [{
                message: "(Monday 23rd July: Lane swimming session only available 6:30am - 9:45am and 8:30pm - 10:00pm in the 25 metre Leisure Pool and Monday 30th July: Lane swimming sessions only available 6:30am - 9:45am in the 25 metre Leisure Pool)",
            }]));
        }

        function checkTuesday() {
            const tt0 = timetable[1];
            expect(tt0).to.be.an("object");
            expect(tt0.day).to.equal(2);
            expect(tt0.items).to.have.lengthOf(4);
            expectTimetableItem(tt0.items[0], newTimetableItem("1", "06:30", "15:15", "Lane (25m) Swimming", "Competition Pool", [{
                message: "(Tuesday 24th July: Lane swimming session only available 6:30am - 9:45am in the 25 metre Leisure Pool and Tuesday 31st July: Lane swimming sessions only available 6:30am - 9:45am in the 25 metre Leisure Pool)",
            }]));
            // This next item is interesting as it's not formatted consistently in the HTML,
            // hence the parser gives a strange description and doesn't even try with the room.
            expectTimetableItem(tt0.items[2], newTimetableItem("1", "15:15", "16:00", "Lane Swimming", "Competition Pool", [{
                message: "(Tuesday 24th July: Lane swimming session only available 8:30pm - 10.00pm in the 25 metre Leisure Pool and 31st July: Lane swimming session is cancelled)",
            }]));
        }

        function checkSaturday() {
            const tt = timetable[5];
            expect(tt).to.be.an("object");
            expect(tt.day).to.equal(6);
            expect(tt.items).to.have.lengthOf(1);
            expectTimetableItem(tt.items[0], newTimetableItem("1", "08:00", "20:00", "Lane (50m) Swimming", "Competition Pool", [{
                message: "Saturday 21st July: Lane swimming available 6:30pm - 8:00pm in the Diving Pit",
            }, {
                message: "Saturday 28th July: Lane swimming unavailable all day",
            }]));
        }

        function checkSunday() {
            const tt = timetable[6];
            expect(tt).to.be.an("object");
            expect(tt.day).to.equal(0);
            expect(tt.items).to.have.lengthOf(1);
            expectTimetableItem(tt.items[0], newTimetableItem("1", "08:00", "20:00", "Lane (50m) Swimming", "Competition Pool", [{
                message: "Sunday 22nd: Lane swimming unavailable all day",
            }, {
                message: "Sunday 29th July: Lane swimming unavailable all day",
            }]));
        }

        checkMonday();
        checkTuesday();
        checkSaturday();
        checkSunday();
    });
});
