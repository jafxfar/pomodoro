export class ITimer {
    startTime: number;
    endTime: number;
    duration: number;
    isRunning: boolean;

    constructor(startTime: number, endTime: number, duration: number, isRunning: boolean) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.duration = duration;
        this.isRunning = isRunning;
    }

    start() {
        this.isRunning = true;
        this.startTime = Date.now();
        this.endTime = this.startTime + this.duration * 1000;
    }

    stop() {
        this.isRunning = false;
    }

    reset() {
        this.isRunning = false;
        this.startTime = 0;
        this.endTime = 0;
    }
    resume() {
        this.isRunning = true;
    }

    addTime(seconds: number) {
        if (this.isRunning) {
            this.duration += seconds;
            this.endTime = this.startTime + this.duration * 1000;
        }
    }
}