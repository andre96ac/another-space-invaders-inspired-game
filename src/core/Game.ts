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
     * Start the game
     */
    public start():void{
        
        //Loading firs scene
        this.onStart()

        //start rendering loop
        window.requestAnimationFrame((timestamp: DOMHighResTimeStamp) => this.frame(this, timestamp));
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
        this._currentScene?.onUpdate();
        this._currentScene?.render();
        this._currentScene?.checkCollisions();
        
        //Setting timestamp for delta time
        this.lastTimestamp = this.currentTimestamp;

        //Next frame
        window.requestAnimationFrame((timestamp: DOMHighResTimeStamp) => this.frame(pthis, timestamp));
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


    //#region Events

    /**
     * Called at game start
     */
    public abstract onStart(): void;

}