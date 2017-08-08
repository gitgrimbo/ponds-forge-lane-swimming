class Stopwatch {
    constructor() {
        this.startTime = null;
    }

    start() {
        this.startTime = +new Date();
        return this;
    }

    read() {
        return +new Date() - this.startTime;
    }

    stop() {
        this.duration = this.read();
        return this.duration;
    }
}

module.exports = Stopwatch;
