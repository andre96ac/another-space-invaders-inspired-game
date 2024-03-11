import { GameScene } from "../scenes/GameScene.js";
import { Scene } from "./Scene.js";

export abstract class Game{

    //Main Canvas
    private readonly _mainCanvas: HTMLCanvasElement;
    public get mainCanvas(){ return this._mainCanvas}; 
    
    //Main Context
    private readonly _mainContext: CanvasRenderingContext2D;
    public get mainContext(){ return this._mainContext}; 
    
    //Background canvas
    private readonly _backCanvas: HTMLCanvasElement;
    public get backCanvas(){ return this._backCanvas}; 
    
    //Background context
    private readonly _backContext: CanvasRenderingContext2D;
    public get backContext(){ return this._backContext}; 

    //UI canvas
    private readonly _uiCanvas: HTMLCanvasElement;
    public get uiCanvas(){ return this._uiCanvas}; 
    
    //UI context
    private readonly _uiContext: CanvasRenderingContext2D;
    public get uiContext(){ return this._uiContext}; 


    
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

    //Pause
    private _paused: boolean = false;
    public get paused() {return this._paused};


    //region audio
    private htmlAudioLoop: HTMLAudioElement;

    constructor(container: HTMLDivElement){

        if(!container){
            throw new Error("Main container is undefined")
        }
        container.style.setProperty("position", "relative")
        
        //setting main canvas and context
        this._mainCanvas = document.createElement("canvas");
        this._mainCanvas.height = parseInt(window.getComputedStyle(container).height.replace("px", ""));
        this._mainCanvas.width = parseInt(window.getComputedStyle(container).width.replace("px", ""));
        this._mainCanvas.id = "mainCanvas";
        this._mainCanvas.style.setProperty("z-index", "20");
        this._mainCanvas.style.setProperty("position", "absolute");
        container.appendChild(this._mainCanvas);
        
        this._mainContext = this._mainCanvas.getContext("2d") as CanvasRenderingContext2D;
        
        
        //background canvas
        this._backCanvas = document.createElement("canvas");
        this._backCanvas.height = this.mainCanvas.height;
        this._backCanvas.width = this.mainCanvas.width;
        this._backCanvas.id = "backgroundCanvas";
        this._backCanvas.style.setProperty("z-index", "10")
        this._backCanvas.style.setProperty("position", "absolute");
        container.appendChild(this._backCanvas);
        
        this._backContext = this._backCanvas.getContext("2d") as CanvasRenderingContext2D;
        
        
        //UI canvas
        this._uiCanvas = document.createElement("canvas");
        this._uiCanvas.height = this.mainCanvas.height;
        this._uiCanvas.width = this.mainCanvas.width;
        this._uiCanvas.id = "uiCanvas";
        this._uiCanvas.style.setProperty("z-index", "30")
        this._backCanvas.style.setProperty("position", "absolute");
        container.appendChild(this._uiCanvas) ;

        this._uiContext = this._uiCanvas.getContext("2d") as CanvasRenderingContext2D;


        //Audio
        this.htmlAudioLoop = document.createElement("audio");
        this.htmlAudioLoop.loop = true;

        //Setup mouse click check
        this.mainCanvas.addEventListener("click", (ev) => this.currentScene?.checkButtonClick(ev))

    }
    


    /**
     * Call onStart, then start animation frame loop
     */
    public start():void{
        
        if(this.animationCallstackRef == undefined){
            //start rendering loop
            this.animationCallstackRef = window.requestAnimationFrame((timestamp: DOMHighResTimeStamp) => this.frame(this, timestamp));



            //Loading firs scene
            this.onStart()
    
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
            this.currentScene?.onPause();
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
            this.animationCallstackRef = window.requestAnimationFrame((timestamp: DOMHighResTimeStamp) => this.frame(this, timestamp))
            this.onResume();
            this.currentScene?.onResume();

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
        this.clearContext("background");
        this.clearContext("main");
        this.clearContext("ui");
        
    }
    
    /**
     * Render frame function
     * @param pthis 
     * @param timestamp 
     */
    private frame(pthis: typeof this, timestamp: DOMHighResTimeStamp){
        //Next frame
        this.animationCallstackRef = window.requestAnimationFrame((timestamp: DOMHighResTimeStamp) => this.frame(pthis, timestamp));
        
        //Setting timestamp for delta time
        this.currentTimestamp = timestamp;
        if(this.lastTimestamp == undefined){
            this.lastTimestamp = timestamp
        }

        //Game engine pipeline
        this.clearContext("main");
        this._currentScene?.onUpdate();
        this._currentScene?.render();
        this._currentScene?.checkCollisions();
        
        //Setting timestamp for delta time
        this.lastTimestamp = this.currentTimestamp;

        
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

    private clearContext(contextType: ContextType){
        switch(contextType){
            case "background":
                this._backContext.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height)
            break;
            
            case "main":
                this._mainContext.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height)
            break;

            case "ui":
                this._uiContext.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height)
            break;
        }

    }

    public drawBackground(assetName: string){
        this.clearContext("background");
        this.getImgElFromAssetName(assetName).then(imgEl => {
            if(this.mainCanvas.width/this.mainCanvas.height >imgEl.width / imgEl.height){
                this.backContext.drawImage(imgEl, 0, 0, this.mainCanvas.width, this.mainCanvas.width * imgEl.height / imgEl.width)
            }
            else{
                this.backContext.drawImage(imgEl, 0, 0, this.mainCanvas.height * imgEl.width / imgEl.height , this.mainCanvas.height)
            }
        })
    }

    public getImgElFromAssetName(assetName: string): Promise<HTMLImageElement>{
        return new Promise<HTMLImageElement>((resolve, reject) => {
            const imgElem = document.createElement("img");
            imgElem.src = `./assets/${assetName}`;
            imgElem.onload = () => {resolve(imgElem)}
        })
    }



    public playAudioLoop(assetName?: string){
        if(!!assetName){
            this.htmlAudioLoop.src = `./assets/${assetName}`;
        }
        this.htmlAudioLoop.play();
    }

    public stopAudioLoop(){
        this.htmlAudioLoop.pause();
    }


    public playAudioOneShot(assetName: string){
        const audioEl = document.createElement("audio");
        audioEl.src = `./assets/${assetName}`;
        audioEl.onended = () => audioEl.remove();
        audioEl.play();
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


export type ContextType = "background" | "main" | "ui";
