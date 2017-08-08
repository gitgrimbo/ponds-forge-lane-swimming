const Stopwatch = require("./Stopwatch");

/**
 * Class to help with tracing the time spent in the application.
 */
class Trace {
    static start(shouldTrace) {
        const t = new Trace();
        if (!shouldTrace) {
            return t;
        }
        t.stopwatch = new Stopwatch().start();
        return t;
    }

    /**
     * Plucks out, deletes, and returns the "_trace" property from each object in the array.
     * @param {array} arr The array.
     */
    static pluckTraces(arr) {
        return arr.map(Trace.pluckTrace);
    }

    /**
     * Plucks out, deletes, and returns the "_trace" property from the object.
     * @param {object} it The object.
     */
    static pluckTrace(it) {
        const trace = it._trace;
        delete it._trace;
        return trace;
    }

    /**
     * Stops the trace and adds trace info to the response.
     * @param {string} name The name associated with the trace info.
     * @param {object} response The response to attach the trace info to.
     */
    stop(name, response) {
        if (!this.stopwatch) {
            return response;
        }
        response._trace = Object.assign({}, response._trace, {
            [name]: {
                startTime: this.stopwatch.startTime,
                duration: this.stopwatch.stop(),
            }
        });
        return response;
    }
}

module.exports = Trace;
