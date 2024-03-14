import { Button } from "./Prefabs/Button.js";
import { Game } from "./Game.js";
import { GameObject } from "./GameObject.js";
import { Vector2 } from "./Helpers/Vector2.js";
import { ScheduledInterval, ScheduledTask, ScheduledTimeout } from "./Helpers/ScheduledTask.js";

export abstract class Scene<T extends Game>{

    private keyListenerController: AbortController = new AbortController();


    // private intervalsPtrs: number[] = [];
    // private timeoutsPtrs: number[] = [];

    private arTimeouts: ScheduledTimeout[] = [];
    private arIntervals: ScheduledInterval[] = [];

    //Loaded GameObject list
    private gameObjList: GameObject<T>[] = [];

    //reference to the gameController
    protected readonly gameController: T;

    //Array with collidables gameObjects
    public get arCollidables(): GameObject<T>[]{
        return this.gameObjList.filter(el => el.collidable)
    }

    public get arButtons(): Button<T>[]{
        return this.gameObjList.filter(el => el instanceof Button) as Button<T>[];
    }

    private currentTimestamp: DOMHighResTimeStamp = performance.now();

   




    constructor(gameController: T){
        this.gameController = gameController;
    }



    /**
     * Create element into the scene
     * @param Factory 
     * @returns 
     */
    public istantiateEl<T2 extends GameObject<T>>(Factory: new (gameController: T)=>T2, position?: Vector2, size?: Vector2): T2{
        const instance: T2 = new Factory(this.gameController)

        if(!!position){
            instance.moveAtCentre(position);
        }
        instance.onLoad();
        this.gameObjList.push(instance);
        return instance;
    }


    /**
     * Remove gameObject from rendering array (elemnet will be destroyed if no other references are present)
     * @param gameObj gameObject to remove
     * @returns 
     */
    public destroyEl(gameObj: GameObject<T>): Symbol{
        const idx = this.gameObjList.findIndex(el => el == gameObj)
        if(idx >= 0){
            this.gameObjList[idx].onUnload();
            this.gameObjList.splice(idx, 1);
        }
        return Symbol("calling super is mandatory")
    }

    /**
     * Main method to draw a scene frame (clear canvas and draw, all the elements into scene)(called in every frame)
     * THIS METHOD IS CALLED IN MAIN LOOP ALSO IF PRIVATE
     * @param context 
     */
    public __render(){
        this.gameObjList.sort((el, el2) => el.zIndex - el2.zIndex).forEach(el => el.__callRender(this.gameController.mainContext))
        return Symbol("this mehtod is called in Game render pipeline and should not be overrided, use update instead")
    }
    
    /**
     * called in every frame; this method check the collision between all collidables and notify the properly event to the objects
     * THIS METHOD IS CALLED IN MAIN LOOP ALSO IF PRIVATE
     * @returns 
     */
    public __checkCollisions(){
        for (let idx = 0; idx < this.arCollidables.length; idx++) {
            for (let counter = idx+1; counter < this.arCollidables.length; counter++) {
                if (this.areColliding(this.arCollidables[idx], this.arCollidables[counter])){
                    this.arCollidables[idx]?.onCollisionEnter(this.arCollidables[counter]);
                    this.arCollidables[counter]?.onCollisionEnter(this.arCollidables[idx]);
                }
            }
        }
        
        return Symbol("this mehtod is called in Game render pipeline and should not be overrided, use update instead")
        
    }

    /**
     * Tell if el and el2 are overlapping on the screen
     * @param el 
     * @param el2 
     * @returns 
     */
    private areColliding(el: GameObject<T>, el2: GameObject<T>):boolean {
         return (el.position.y < el2.position.y? (el2.position.y - el.position.y) < el.size.y : (el.position.y - el2.position.y) < el2.size.y)
         && (el.position.x < el2.position.x? (el2.position.x - el.position.x) < el.size.x : (el.position.x - el2.position.x) < el2.size.x)
    }


    /**
     * called when a mouse click event is called; notify OnMouseClick event to gameObject overlapping pointer
     */
    public __checkButtonClick(ev: MouseEvent): Symbol{
        this.arButtons
                        .filter(button => (ev.offsetX > button.position.x && ev.offsetX < button.position.x + button.size.x)&&(ev.offsetY > button.position.y && ev.offsetY < button.position.y + button.size.y))
                        .forEach(el => el.onMouseClick(ev))
        return Symbol("this method should not be overriden");
    }


    /**
     * Set an interval relative to the scene; all intervals will be cleared at scene unload
     * @param callback callback to execute
     * @param millis time
     */
    // public setInterval(callback: Function, millis: number): number{
    //     const ptr = setInterval(callback, millis);
    //     this.intervalsPtrs.push(ptr);
    //     return ptr
    // }

    /**
     * Set a timeout relative to the scene; all timeouts will be cleared at scene unload
     * @param callback callback to execute
     * @param millis time
     */
    // public setTimeout(callback: Function, millis: number): number{
    //     const ptr = setTimeout(callback, millis);
    //     this.timeoutsPtrs.push(ptr);
    //     return ptr
    // }


    public setInterval(callback: Function, millis: number, ignorePause: boolean = false, logNote: string = ""): ScheduledInterval{
        const task = new ScheduledInterval(callback, this.currentTimestamp, millis, ignorePause, logNote);
        this.arIntervals.push(task)
        return task;
        
    }
    
    public setTimeout(callback: Function, millis: number, ignorePause: boolean = false, logNote: string = ""): ScheduledTimeout{
        const  task = new ScheduledTimeout(callback, this.currentTimestamp, millis, ignorePause, logNote)
        this.arTimeouts.push(task)
        return task;

    }

    public clearTimeout(task: ScheduledTimeout){
        const idx = this.arTimeouts.findIndex(el => el == task)
        if(idx >= 0){
            this.arTimeouts.splice(idx, 1)
        }
        
    }
    public clearInterval(task: ScheduledInterval){
        const idx = this.arIntervals.findIndex(el => el == task)
        if(idx >= 0){
            this.arIntervals.splice(idx, 1)
        }
    }

    /**
     * Register a SAFE callback when key is pressed; listener will be removed at scene unload 
     * @param key key to bind
     * @param callback callback to execute
     */
    protected registerKeyDownListener(key: string, callback: (ev: KeyboardEvent) => any):void{
        document.addEventListener("keydown", (ev) => {
            if(ev.key == key){
                callback(ev);
            }
        }, {signal: this.keyListenerController.signal})
        
    }

    /**
     * Register a SAFE callback when key is pressed; listener will be removed at scene unload 
     * @param key key to bind
     * @param callback callback to execute
     */
    protected registerKeyUpListener(key: string, callback: (ev: KeyboardEvent) => any):void{
        document.addEventListener("keyup", (ev) => {
            if(ev.key == key){
                callback(ev);
            }
        }, {signal: this.keyListenerController.signal})

    }


    /**
     * Add a SAFE listener of  specified type to the target. All listeners will be removed on scene unload 
     * @param target target element of the listener
     * @param type listener  type
     * @param callback callback fn
     */
    protected addEventListener<K extends keyof GlobalEventHandlersEventMap>(target: EventTarget, type: K, callback: (evt: GlobalEventHandlersEventMap[K]) => void): void{
        // @ts-ignore
        target.addEventListener(type, ev => callback(ev), {signal: this.keyListenerController.signal})
    }
    






    //#region Events

    /**
     * Called when the game pause
     */
    public onPause(currentTimestamp: DOMHighResTimeStamp): Symbol{
        this.arTimeouts.forEach(el => el.pause(currentTimestamp))
        this.arIntervals.forEach(el => el.pause(currentTimestamp))
        return Symbol("Calling super is mandatory")
    }
    
    /**
     * Called when the game resume from pause
    */
   public onResume(currentTimestamp: DOMHighResTimeStamp): Symbol{
       this.arTimeouts.forEach(el => el.resume(currentTimestamp))
       this.arIntervals.forEach(el => el.resume(currentTimestamp))
       
        return Symbol("Calling super is mandatory")
    }

    /**
     * Called once at scene loading
     */
    public abstract onLoad(): void;

    /**
     * Called once at scene unloading
     */
    public onUnload(): Symbol{
        this.gameObjList.forEach(el => el.destroy())
        this.arTimeouts.forEach(el => this.clearTimeout(el))
        this.arIntervals.forEach(el => this.clearInterval(el))

        this.keyListenerController.abort();
        return Symbol("Calling super is mandatory")
    };

    /**
     * Called every frame update
     */
    public onUpdate(currentTimestamp: DOMHighResTimeStamp){
        this.currentTimestamp = currentTimestamp;
        // Call update for every object
        this.gameObjList.forEach(gameObj => gameObj.onUpdate(currentTimestamp))

        // Run intervals and timeouts
        this.runIntervals(currentTimestamp);
        this.runTimeouts(currentTimestamp);


        return Symbol("calling super is mandatory");
    }

    //#endregion


    private runIntervals(now: DOMHighResTimeStamp){
        this.arIntervals.forEach(interval => {
            interval.__run(now);
        })
    }
    private runTimeouts(now: DOMHighResTimeStamp){
        this.arTimeouts.forEach(timeout => {
            const executed = timeout.__run(now);
            if(executed){
                this.clearTimeout(timeout);
            }
        })
    }

    
    

    
}