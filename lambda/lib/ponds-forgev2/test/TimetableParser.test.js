const chai = require("chai");
const fs = require("fs");
const path = require("path");
const TimetableParser = require("../TimetableParser");

const expect = chai.expect;

describe("ponds-forgev2/TimetableParser", () => {
    it("timetableFromHTML", () => {
        const html = fs.readFileSync(path.join(__dirname, "./swimming-ponds-forge.html"));

        const timetable = TimetableParser.timetableFromHTML(html, { trace: true });

        expect(timetable).to.have.lengthOf(7);

        function checkFirstDay() {
            const tt0 = timetable[0];
            expect(tt0).to.be.an("object");
            expect(tt0.day).to.equal(1);
            expect(tt0.items).to.have.lengthOf(4);

            const item0 = tt0.items[0];
            expect(item0).to.be.an("object");
            expect(item0.venueId).to.equal("1");
            expect(item0.startTime).to.equal("06:30");
            expect(item0.endTime).to.equal("08:00");
            expect(item0.description).to.equal("Lane (25m) Swimming");
            expect(item0.room).to.equal("Diving Pool");
            expect(item0.alterations).to.have.lengthOf(0);

            const item1 = tt0.items[1];
            expect(item1).to.be.an("object");
            expect(item1.venueId).to.equal("1");
            expect(item1.startTime).to.equal("08:00");
            expect(item1.endTime).to.equal("22:00");
            expect(item1.description).to.equal("Lane (25m) Swimming");
            expect(item1.room).to.equal("Competition Pool");
            expect(item1.alterations).to.have.lengthOf(1);

            const alteration0 = item1.alterations[0];
            expect(alteration0).to.be.an("object");
            //expect(alteration0.date).to.equal("29th May");
            expect(alteration0.message).to.equal("(Monday 23rd July: Lane swimming session only available 6:30am - 9:45am and 8:30pm - 10:00pm in the 25 metre Leisure Pool and Monday 30th July: Lane swimming sessions only available 6:30am - 9:45am in the 25 metre Leisure Pool)");
        }

        function checkSaturday() {
            const tt5 = timetable[5];
            const item0 = tt5.items[0];
            expect(item0).to.be.an("object");
            expect(item0.venueId).to.equal("1");
            expect(item0.startTime).to.equal("08:00");
            expect(item0.endTime).to.equal("20:00");
            expect(item0.description).to.equal("Lane (50m) Swimming");
            expect(item0.room).to.equal("Competition Pool");
            expect(item0.alterations).to.have.lengthOf(2);

            const alteration0 = item0.alterations[0];
            expect(alteration0).to.be.an("object");
            //expect(alteration0.date).to.equal("29th May");
            expect(alteration0.message).to.equal("Saturday 21st July: Lane swimming available 6:30pm - 8:00pm in the Diving Pit");

            const alteration1 = item0.alterations[1];
            expect(alteration1).to.be.an("object");
            //expect(alteration0.date).to.equal("29th May");
            expect(alteration1.message).to.equal("Saturday 28th July: Lane swimming unavailable all day");
        }

        function checkLastDay() {
            const tt6 = timetable[6];
            const item0 = tt6.items[0];
            expect(item0).to.be.an("object");
            expect(item0.venueId).to.equal("1");
            expect(item0.startTime).to.equal("08:00");
            expect(item0.endTime).to.equal("20:00");
            expect(item0.description).to.equal("Lane (50m) Swimming");
            expect(item0.room).to.equal("Competition Pool");
            expect(item0.alterations).to.have.lengthOf(2);

            const alteration0 = item0.alterations[0];
            expect(alteration0).to.be.an("object");
            //expect(alteration0.date).to.equal("29th May");
            expect(alteration0.message).to.equal("Sunday 22nd: Lane swimming unavailable all day");

            const alteration1 = item0.alterations[1];
            expect(alteration1).to.be.an("object");
            //expect(alteration0.date).to.equal("29th May");
            expect(alteration1.message).to.equal("Sunday 29th July: Lane swimming unavailable all day");
        }

        checkFirstDay();
        checkSaturday();
        checkLastDay();
    });
});
