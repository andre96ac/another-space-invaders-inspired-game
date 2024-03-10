import { GameScene } from "./scenes/GameScene.js";
import { Scene } from "./scenes/Scene.js";

export class Game{
    private _mainCanvas: HTMLCanvasElement;
    private _mainContext: CanvasRenderingContext2D;
    private _currentScene: Scene | undefined;

    public get mainContext(){ return this._mainContext}; 
    public get mainCanvas(){ return this._mainCanvas}; 
    public get currentScene(){  return this._currentScene};

    private lastTimestamp: DOMHighResTimeStamp = 0;
    private currentTimestamp: DOMHighResTimeStamp = 0;
    public get deltaTime(): number{
        return (this.currentTimestamp - this.lastTimestamp)/6;
    }

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D){
        this._mainCanvas = canvas;
        this._mainContext = context;
    }

    public start():void{
        this.mainContext.canvas.height = window.innerHeight-20;
        this.mainContext.canvas.width = window.innerWidth-15;
        

        this.loadScene(GameScene)
        window.requestAnimationFrame((timestamp: DOMHighResTimeStamp) => this.frame(this, timestamp));
    }
    
    private frame(pthis: typeof this, timestamp: DOMHighResTimeStamp){
        this.currentTimestamp = timestamp;
        if(this.lastTimestamp == undefined){
            this.lastTimestamp = timestamp
        }
        this._currentScene?.update();
        this._currentScene?.render();
        this._currentScene?.checkCollisions();
        this.lastTimestamp = this.currentTimestamp;

        window.requestAnimationFrame((timestamp: DOMHighResTimeStamp) => this.frame(pthis, timestamp));
    }

    public loadScene(sceneFactory:  new(gameController: Game) => Scene){
        this._currentScene?.unload();
        this._currentScene = new sceneFactory(this);
        this._currentScene.load();
    }

}