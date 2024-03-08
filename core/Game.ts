import { GameScene } from "./scenes/GameScene.js";
import { Scene } from "./scenes/Scene.js";

export class Game{
    private _mainCanvas: HTMLCanvasElement;
    private _mainContext: CanvasRenderingContext2D;
    private _currentScene: Scene | undefined;

    public get mainContext(){ return this._mainContext}; 
    public get mainCanvas(){ return this._mainCanvas}; 

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D){
        this._mainCanvas = canvas;
        this._mainContext = context;
    }

    public start():void{
        this.mainContext.canvas.height = window.innerHeight-20;
        this.mainContext.canvas.width = window.innerWidth-15;
        

        this.loadScene(new GameScene(this))
        // setInterval(() =>{
        //     this._currentScene?.update();
        //     this._currentScene?.render();
        // }, 0)
        window.requestAnimationFrame(() => this.frame(this));
    }
    
    private frame(pthis: typeof this){
        this._currentScene?.update();
        this._currentScene?.render();
        window.requestAnimationFrame(() => this.frame(pthis));
    }

    public loadScene(scene: Scene){
        this._currentScene?.unload();
        this._currentScene = scene;
        this._currentScene.load();
    }
}