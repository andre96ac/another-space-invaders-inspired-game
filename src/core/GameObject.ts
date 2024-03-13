import { Game } from "./Game.js";
import { Vector2 } from "./Helpers/Vector2.js";

export abstract class GameObject<T extends Game>{

    //Reference to the game Controller
    protected readonly gameController: T;
    
  
    //Posizion
    private _position: Vector2;
    public get position(): Vector2{ return  this._position; }
    protected set position(value: Vector2){
        // this.checkCollisions();
        this._position = value;
        if(this.destroyOffScreen && this.isOffScreen){
            this.destroy();
        }
    }

    //Size
    private _size: Vector2;
    public get size(): Vector2{ return  this._size; }
    protected set size(value: Vector2){ this._size = value; }

    //Collidable
    private _collidable: boolean = false;
    public get collidable(): boolean{ return  this._collidable }
    protected set collidable(value: boolean){ this._collidable = value }


    //hidden
    private _hidden: boolean = false;
    public get hidden(){ return this._hidden};
    protected set hidden(value: boolean){ this._hidden = value }

    //Destroy off scren
    private _destroyOffScreen = true;
    public get destroyOffScreen() {return this._destroyOffScreen }
    protected set destroyOffScreen(value: boolean){ this._destroyOffScreen = value }

    //Tag System
    private arTags: string[] = [];
    public hasTag(tag: string): boolean{ return this.arTags.includes(tag); }
    public removeTag(tag: string){ this.arTags.splice(this.arTags.findIndex(el => el == tag), 1); }
    public addTag(tag: string): void{
        if(!this.hasTag(tag)){
            this.arTags.push(tag);
        }
    }

    // Center position
    public get center(): Vector2{
        return Vector2.create(this._position.x + this._size.x/2, this._position.y + this._size.y/2)
    }

    // Check if obj is off the screen
    public get isOffScreen(): boolean{
        return this.center.x < 0 - this.size.x/2
        || this.center.x > this.gameController.mainCanvas.width + this.size.x/2
        || this.center.y < 0 - this.size.y/2
        || this.center.y > this.gameController.mainCanvas.height + this.size.y/2
    }


    //color of obj
    protected color: string = "black";
    //Shape
    protected shape: ShapeType;
    //Filled
    protected fill: boolean = false;
    //line width
    protected lineWidth: number = 1;


    

    constructor(gameController: T, shape: ShapeType, position: Vector2 = Vector2.zero, size: Vector2 = Vector2.zero){
        this.shape = shape;
        this._position = position;
        this._size = size;
        this.gameController = gameController;
    }


    /**
     * Main method to draw the element (called every frame)
     * Will draw circles and squares based on shape property
     * Override this to draw custom shapes
     * @param context 
     */
    public render(context: CanvasRenderingContext2D): Symbol{
        if(!this.hidden){
            context.beginPath();
            context.fillStyle = this.color;
            context.strokeStyle = this.color;
            context.lineWidth = this.lineWidth;
            switch (this.shape){
                case "circle":
                        context.ellipse(Math.round(this._position.x + this.size.x/2) , Math.round(this._position.y + this.size.y/2), Math.round(this._size.x/2), Math.round(this._size.y/2), 0, 0, 360)
                    break;
                case "rectangle":
                        context.rect(Math.round(this._position.x), Math.round(this._position.y), Math.round(this._size.x), Math.round(this._size.y));
                    break;

                case "triangle":
                        context.beginPath();
                        context.moveTo(this.position.x, this.position.y+this.size.y);
                        context.lineTo(this.position.x + this.size.x, this.position.y+this.size.y);
                        context.lineTo(this.position.x + this.size.x/2, this.position.y);
                        context.closePath();
                    break;

                }
                if(this.fill){
                    context.fill();
                }
                else{
                    context.stroke();
                }
            }
        return Symbol("Calling super is mandatory");
    }

    /**
     * Move the center of gameObject to the specified position
     * @param position 
     */
    public moveAtCentre(position: Vector2):void{
        switch(this.shape){
            case "circle": 
                this.position = Vector2.create(position.x - this._size.x/2, position.y - this._size.y/2)
            break;
            case "rectangle":
                this.position = Vector2.create(position.x - this._size.x/2, position.y - this._size.y/2)
                break;
                case "triangle":
                this.position = Vector2.create(position.x - this._size.x/2, position.y - this._size.y/2)
            break;
            case "custom": {
                this.position = Vector2.copy(position);
            }
        }
    }

    /**
     * Destroy gameObject from the scene (calling currentScene.destroyEl(this))
     */
    public destroy(): Symbol{
        this.gameController.currentScene?.destroyEl(this);
        return Symbol("Calling super is mandatory");
    }


    //#region GameObject Events
    
    /**
     * Called every Frame if this is colliding with other collidable gameObject
     * @param other Other GameObject colliding
     */
    public abstract onCollisionEnter(other: GameObject<T>): void;


    /**
     * Called at the gameObject creation
     */
    public abstract onLoad(): void;

    /**
     * Called every frame
     */
    public abstract onUpdate(): void;

    /**
     * Called when the element is destroyed
     */
    public abstract onUnload(): void;
    
    //#endregion


}

export type ShapeType = "circle" | "rectangle" | "triangle" | "custom";
