export abstract class ScheduledTask{
    public readonly guid: string = crypto.randomUUID();
    public readonly callback: Function
    public readonly startExecutionTime: DOMHighResTimeStamp;

    private _lastExecutionTime: DOMHighResTimeStamp;
    public get lastExecutionTime() { return this._lastExecutionTime };

    private _lastPausedTime: DOMHighResTimeStamp | undefined;

    public readonly delay: number;

    public readonly ignorePause: boolean;

    protected abstract _type: "timeout" | "interval";
    public get type(){ return this._type }

    constructor(callback: Function, now: DOMHighResTimeStamp, delay: number, ignorePause: boolean = false){
        this.callback = callback; 
        this.startExecutionTime = now;
        this._lastExecutionTime = now;
        this.ignorePause = ignorePause;
        this.delay = delay;



    }
    public setLastExecution(now: DOMHighResTimeStamp){
        this._lastExecutionTime = now;
    }

    public hasToExecute(now: DOMHighResTimeStamp): boolean{
        return  now - this._lastExecutionTime > this.delay;
    }

    public pause(now: DOMHighResTimeStamp){
        this._lastPausedTime = now;
    }

    public resume(now: DOMHighResTimeStamp){
        if(!!this._lastPausedTime){
            this._lastExecutionTime += (now - this._lastPausedTime)
            this._lastPausedTime = undefined;
        }
    }   
}

export class ScheduledTimeout extends ScheduledTask{
    protected _type: "timeout" = "timeout"
    
}
export class ScheduledInterval extends ScheduledTask{
    protected _type: "interval" = "interval"

}