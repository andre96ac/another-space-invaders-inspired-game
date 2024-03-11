import { GameScene } from "../scenes/GameScene.js";
import { Scene } from "./Scene.js";

export abstract class Game{

    //Main Canvas
    private readonly _mainCanvas: HTMLCanvasElement;
    public get mainCanvas(){ return this._mainCanvas}; 

    //Main Context
    private readonly _mainContext: CanvasRenderingContext2D;
    public get mainContext(){ return this._mainContext}; 

    //Current Scene
    private _currentScene: Scene | undefined;
    public get currentScene(){  return this._currentScene};

    //Delta time
    private lastTimestamp: DOMHighResTimeStamp = 0;
    private currentTimestamp: DOMHighResTimeStamp = 0;
    public get deltaTime(): number{
        return (this.currentTimestamp - this.lastTimestamp)/6;
    }

    //Frame call stack reference
    private animationCallstackRef: number | undefined;

    private _paused: boolean = false;
    public get paused() {return this._paused};

    constructor(canvas: HTMLCanvasElement){
        //setting canvas and context
        this._mainCanvas = canvas;
        const context = canvas.getContext("2d")
        if(!! context){
            this._mainContext = context;
        }
        else{
            throw new Error("Main context is undefined")
        }

        //setting context size
        this.mainContext.canvas.height = window.innerHeight-20;
        this.mainContext.canvas.width = window.innerWidth-15;
    }

    /**
     * Call onStart, then start animation frame loop
     */
    public start():void{
        
        if(this.animationCallstackRef == undefined){
            //Loading firs scene
            this.onStart()
    
            //start rendering loop
            this.animationCallstackRef = window.requestAnimationFrame((timestamp: DOMHighResTimeStamp) => this.frame(this, timestamp));
        }
        else {
            console.error("Error calling start; game already running")
        }
        
    }
    
    /**
     * Call onPause, then stop animation frame loop
     */
    public pause(): void{
        if(this.animationCallstackRef != undefined){
            this.onPause();
            window.cancelAnimationFrame(this.animationCallstackRef);
            this.animationCallstackRef = undefined;
            this._paused = true;
        }
        else{
            console.error("Error calling pause; game not running")
        }
    }
    
    /**
     * Call onResume, then start animation framae loop
     */
    public resume(): void{
        if(this.animationCallstackRef == undefined){
            this.onResume();
            this.animationCallstackRef = window.requestAnimationFrame((timestamp: DOMHighResTimeStamp) => this.frame(this, timestamp))
            this._paused = false
        }
        else{
            console.error("Error calling resume; game already running")
        }
    }

    public exit(): void{
        this.onExit()
        if(this.animationCallstackRef != undefined){
            window.cancelAnimationFrame(this.animationCallstackRef);
            this.animationCallstackRef = undefined;
        }
        this._currentScene = undefined;
        this.clearMainContext();
        
    }
    
    /**
     * Render frame function
     * @param pthis 
     * @param timestamp 
     */
    private frame(pthis: typeof this, timestamp: DOMHighResTimeStamp){
        //Setting timestamp for delta time
        this.currentTimestamp = timestamp;
        if(this.lastTimestamp == undefined){
            this.lastTimestamp = timestamp
        }

        //Game engine pipeline
        this.clearMainContext();
        this._currentScene?.onUpdate();
        this._currentScene?.render();
        this._currentScene?.checkCollisions();
        
        //Setting timestamp for delta time
        this.lastTimestamp = this.currentTimestamp;

        //Next frame
        this.animationCallstackRef = window.requestAnimationFrame((timestamp: DOMHighResTimeStamp) => this.frame(pthis, timestamp));
    }

    /**
     * Called to change scene (old scene will be destroyed)
     * @param sceneFactory Scene to load
     */
    public loadScene(sceneFactory:  new(gameController: Game) => Scene){
        this._currentScene?.onUnload();
        this._currentScene = new sceneFactory(this);
        this._currentScene.onLoad();
    }

    private clearMainContext(){
        this.mainContext.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height)

    }


    //#region Events

    /**
     * Called at game start
     */
    public abstract onStart(): void;
    /**
     * Called when game paused
     */
    public abstract onPause(): void;
    /**
     * Called when game resumed
     */
    public abstract onResume(): void;
    /**
     * Called when game exit
     */
    public abstract onExit(): void;

    //#endregion

}