export abstract class ScheduledTask{
    public readonly guid: string = crypto.randomUUID();
    public readonly callback: Function
    private _startExecutionTime: DOMHighResTimeStamp;
    public get startExecutiontime(): DOMHighResTimeStamp{ return this._startExecutionTime }

    private _lastExecutionTime: DOMHighResTimeStamp;
    public get lastExecutionTime() { return this._lastExecutionTime };

    private _lastPausedTime: DOMHighResTimeStamp | undefined;

    private _delay: number;
    public get delay(): number { return this._delay }

    public readonly ignorePause: boolean;

    protected abstract _type: "timeout" | "interval";
    public get type(){ return this._type }

    private logNote: string = "";

    constructor(callback: Function, now: DOMHighResTimeStamp, delay: number, ignorePause: boolean = false, logNote: string = ""){
        this.callback = callback; 
        this._startExecutionTime = now;
        this._lastExecutionTime = now;
        this.ignorePause = ignorePause;
        this._delay = delay;

        this.logNote = logNote;

    }
    private setLastExecution(now: DOMHighResTimeStamp){
        this._lastExecutionTime = now;
    }

    private hasToExecute(now: DOMHighResTimeStamp): boolean{
        return  (now - this._lastExecutionTime > this._delay) && (!this._lastPausedTime);
    }

    public pause(now: DOMHighResTimeStamp){
        if(!this.ignorePause){
            this._lastPausedTime = now;
        }
    }

    public resume(now: DOMHighResTimeStamp){
        if(!this.ignorePause){
            if(!!this._lastPausedTime){
                this._lastExecutionTime += (now - this._lastPausedTime)
                this._lastPausedTime = undefined;
            }
        }
    }   

    /**
     * Check if task has to be executed, execute it if needed, and returns true if task had been executed
     * @param now 
     */
    public __run(now: DOMHighResTimeStamp):boolean{
        if(this.hasToExecute(now)){
            this.callback();
            this.setLastExecution(now);
            return true;
        }
        return false

    }

    public reset(now: DOMHighResTimeStamp){
        this._startExecutionTime = now;
        this._lastExecutionTime = now;
    }


    public changeDelay(delay: number){
        this._delay = delay;
    }
}

export class ScheduledTimeout extends ScheduledTask{
    protected _type: "timeout" = "timeout"
    
}
export class ScheduledInterval extends ScheduledTask{
    protected _type: "interval" = "interval"

}