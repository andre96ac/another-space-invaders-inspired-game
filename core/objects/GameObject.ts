import { Game } from "../Game.js";
import { Vector2 } from "../Utils/Vector2.js";

export abstract class GameObject{
    private shape: "circle" | "rectangle";
    private _position: Vector2;
    protected _size: Vector2;
    protected gameController: Game;
    private _collidable: boolean = false;
    protected hidden: boolean = false;

    protected destroyOffScreen = true;

    private arTags: string[] = [];

    public hasTag(tag: string): boolean{
        return this.arTags.includes(tag);
    }
    public addTag(tag: string): void{
        if(!this.hasTag(tag)){
            this.arTags.push(tag);
        }

    }
    public removeTag(tag: string){
        this.arTags.splice(this.arTags.findIndex(el => el == tag), 1);
    }

    public get collidable(): boolean{
        return  this._collidable;
    }
    protected set collidable(value: boolean){
        this._collidable = value
    }


    public get position(): Vector2{
        return  this._position;
    }
    protected set position(value: Vector2){
        // this.checkCollisions();
        this._position = value;
        if(this.destroyOffScreen && this.isOffScreen()){
            this.destroy();
        }
    }
    public get size(): Vector2{
        return  this._size;
    }

    public get center(): Vector2{
        return Vector2.create(this._position.x + this._size.x/2, this._position.y + this._size.y/2)
    }

    constructor(gameController: Game, shape: ShapeType = "rectangle", position: Vector2 = Vector2.zero, size: Vector2 = Vector2.zero){
        this.shape = shape;
        this._position = position;
        this._size = size;
        this.gameController = gameController;
    }

    public render(context: CanvasRenderingContext2D): void{
        if(!this.hidden){
            context.beginPath();
            switch (this.shape){
                case "circle":
                        context.ellipse(Math.round(this._position.x) , Math.round(this._position.y), Math.round(this._size.x/2), Math.round(this._size.y/2), 0, 0, 360)
                    break;
                case "rectangle":
                        context.rect(Math.round(this._position.x), Math.round(this._position.y), Math.round(this._size.x), Math.round(this._size.y));
                    break;
            }
            context.fill();
        }
    }

    public moveAtCentre(position: Vector2):void{
        switch(this.shape){
            case "circle": 
                this.position = Vector2.copy(position)
            break;
            case "rectangle":
                this.position = Vector2.create(position.x - this._size.x/2, position.y - this._size.y/2)
            break;
        }
    }

    public destroy(): void{
        this.gameController.currentScene?.destroyEl(this);
    }


    // private checkCollisions(){
    //     if(this.collidable){
    //         const arCollidables = this.gameController.currentScene?.arCollidables??[];
            
    //         arCollidables.forEach((el, idx) => {
    //                 if (el != this && this.areColliding(el, this)){
    //                     el.onCollisionEnter(this);
    //                     this.onCollisionEnter(el);
    //                 }
    //         })
    //     }
    // }

    // private areColliding(el: GameObject, el2: GameObject):boolean {
    //     // const areCollidingX: boolean = el.position.x < el2.position.x? (el2.position.x - el.position.x) < el.size.x : (el.position.x - el2.position.x) < el2.size.x; 
    //     // const areCollidingX: boolean = 
    //     const collidingX =  el.position.x < el2.position.x? (el2.position.x - el.position.x) < el.size.x : (el.position.x - el2.position.x) < el2.size.x
    //     const collidingY =  el.position.y < el2.position.y? (el2.position.y - el.position.y) < el.size.y : (el.position.y - el2.position.y) < el2.size.y;
    //     return collidingX && collidingY;

    // }

    public abstract onCollisionEnter(other: GameObject): void

    public abstract load(): void;

    public abstract unload(): void;
    public abstract update(): void;

    public isOffScreen(): boolean{
        return this.center.x < 0 - this.size.x/2
        || this.center.x > this.gameController.mainCanvas.width + this.size.x/2
        || this.center.y < 0 - this.size.y/2
        || this.center.y > this.gameController.mainCanvas.height + this.size.y/2
        

    }
}

export type ShapeType = "circle" | "rectangle";
