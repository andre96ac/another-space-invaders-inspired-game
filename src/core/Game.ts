import { GameScene } from "../scenes/GameScene.js";
import { AudioController } from "./Helpers/AudioController.js";
import { Scene } from "./Scene.js";

export abstract class Game{

    //Main assets path
    private _assetsPath: string = "./assets";

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


    public  stdWidth: number | undefined;
    public  stdHeight: number | undefined;

    public get currentRatio(): {x: number, y: number}{
        if(!!this.stdHeight && !! this.stdWidth)
        return{
            x: this.mainCanvas.width / this.stdWidth,
            y: this.mainCanvas.height / this.stdHeight
        }
        else{
            throw Error("Unable to access currentRatio: stdHeight or stdWidth not setted")
        }
    }


    
    //Current Scene
    private _currentScene: Scene<typeof this> | undefined;
    public get currentScene(){ 
        if(!!this._currentScene){
            return this._currentScene 
        }
        else{
            throw Error("No scene loaded")
        }
    }

    //Delta time
    private lastTimestamp: DOMHighResTimeStamp = 0;
    private currentTimestamp: DOMHighResTimeStamp = 0;
    public get deltaTime(): number{
        if(this.paused){
            return 0;
        }
        return (this.currentTimestamp - this.lastTimestamp)/6;
    }

    //Frame call stack reference
    private animationCallstackRef: number | undefined;

    //Pause
    private _paused: boolean = false;
    public get paused() {return this._paused};


    //region audio
    private audioController: AudioController = new AudioController(this);
    private _audioLoaded: Promise<void> | undefined;
    public get audioLoaded(): Promise<void> {
        if(!!this._audioLoaded){
            return this._audioLoaded
        }
        else {
            throw Error("Audio loading not started; call 'loadAudioClips' before listening for 'audioloaded'")
        }
    }

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
        this._uiCanvas.style.setProperty("position", "absolute");
        container.appendChild(this._uiCanvas) ;

        this._uiContext = this._uiCanvas.getContext("2d") as CanvasRenderingContext2D;

    
        //Setup mouse click check
        this.uiCanvas.addEventListener("click", (ev) => this.currentScene?.__checkButtonClick(ev))

        

    }

    protected loadAudioClips(clips: string[]){
        this._audioLoaded = this.audioController.loadClips(clips)
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
     * This function will
     * call onPause event
     * set delta time to 0
     * pause all Scene Intervals and Timeouts if not setted to ignore pause
     */
    public pause(): void{
            this.onPause(this.currentTimestamp);
            this.currentScene.onPause(this.currentTimestamp);
            // window.cancelAnimationFrame(this.animationCallstackRef);
            // this.animationCallstackRef = undefined;
            this._paused = true;
    }
    
    
    /**
     * This function will
     * call onResume event
     * restore deltaTime
     * resume all Scene Intervals and Timeouts if not setted to ignore pause
     */
    public resume(): void{
        if(this.paused){
            // this.animationCallstackRef = window.requestAnimationFrame((timestamp: DOMHighResTimeStamp) => this.frame(this, timestamp))
            this.onResume(this.currentTimestamp);
            this.currentScene.onResume(this.currentTimestamp);

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
        this._currentScene?.onUpdate(timestamp);
        this._currentScene?.__render();
        this._currentScene?.__checkCollisions();
        
        //Setting timestamp for delta time
        this.lastTimestamp = this.currentTimestamp;

        
    }

    /**
     * Called to change scene (old scene will be destroyed)
     * @param sceneFactory Scene to load
     */
    public loadScene(sceneFactory:  new(gameController: typeof this) => Scene<Game>){
        this._currentScene?.onUnload();
        this._currentScene = new sceneFactory(this) as Scene<typeof this>;
        this._currentScene.onLoad();
    }

    public clearContext(contextType: ContextType){
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

    /**
     * Create an htmlimageelement with source setted to te assets
     * @param assetName path of the asset relative to 'assets' folder example: myfolder/myasset.jpg or myasset.jpg
     * @returns 
     */
    public getImgElFromAssetName(assetName: string): Promise<HTMLImageElement>{
        return new Promise<HTMLImageElement>((resolve, reject) => {
            const imgElem = document.createElement("img");
            imgElem.src = this.getAssetPath(assetName);
            imgElem.onload = () => {resolve(imgElem)}
        })
    }


    /**
     * Get the full asset path
     * @param relativeAssetPath path of the asset relative to 'assets' folder example: myfolder/myasset.jpg or myasset.jpg
     * @returns 
     */
    public getAssetPath(relativeAssetPath: string): string{
        return `${this._assetsPath}/${relativeAssetPath}`
    }



    public playAudioLoop(assetName?: string){
       this.audioController.playAudioLoop(assetName)
    }

    public stopAudioLoop(){
        this.audioController.stopAudioLoop();
    }


    public playAudioOneShot(assetName: string){
        this.audioController.playAudioOneShot(assetName)
    }


    //#region Events

    /**
     * Called at game start
     */
    public abstract onStart(): void;
    /**
     * Called when game paused
     */
    public abstract onPause(currentTimestamp: DOMHighResTimeStamp): void;
    /**
     * Called when game resumed
     */
    public abstract onResume(currentTimestamp: DOMHighResTimeStamp): void;
    /**
     * Called when game exit
     */
    public abstract onExit(): void;

    //#endregion

}


export type ContextType = "background" | "main" | "ui";
