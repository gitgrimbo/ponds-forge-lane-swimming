const Stopwatch = require("./lib/Stopwatch");
const LaneSwimmingAPI = require("./lib/LaneSwimmingAPI");
const PondsForgeAPI = require("./lib/ponds-forgev2/PondsForgeAPI");
const S10API = require("./lib/s10/S10API");

const pondsForgeAPI = new PondsForgeAPI();
const s10API = new S10API();
const api = new LaneSwimmingAPI();

function makeDone(callback) {
    const sw = new Stopwatch().start();
    return (err, res) => {
        console.log("duration:", sw.stop());
        callback(null, {
            statusCode: err ? "400" : "200",
            body: err ? err.message : JSON.stringify(res, null, 1),
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
                "Content-Type": "application/json",
            },
        });
    };
}

exports.pondsForgeLaneSwimmingDataHandler = (event, context, callback) => {
    console.log("pondsForgeLaneSwimmingDataHandler", new Date());
    //console.log("EVENT", JSON.stringify(event, null, 1));

    const done = makeDone(callback);

    switch (event.httpMethod) {
        case "GET":
            pondsForgeAPI.timetables()
                .then(response => done(null, response))
                .catch(done);
            break;
        default:
            done(new Error(`Unsupported method "${event.httpMethod}"`));
    }
};

exports.s10LaneSwimmingDataHandler = (event, context, callback) => {
    console.log("s10LaneSwimmingDataHandler", new Date());
    //console.log("EVENT", JSON.stringify(event, null, 1));

    const done = makeDone(callback);

    switch (event.httpMethod) {
        case "GET":
            s10API.timetables()
                .then(response => done(null, response))
                .catch(done);
            break;
        default:
            done(new Error(`Unsupported method "${event.httpMethod}"`));
    }
};


exports.laneSwimmingDataHandler = (event, context, callback) => {
    console.log("laneSwimmingDataHandler", new Date());
    //console.log("EVENT", JSON.stringify(event, null, 1));

    const done = makeDone(callback);

    switch (event.httpMethod) {
        case "GET":
            api.timetables()
                .then(response => done(null, response))
                .catch(done);
            break;
        default:
            done(new Error(`Unsupported method "${event.httpMethod}"`));
    }
};
