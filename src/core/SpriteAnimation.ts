import { SpaceInvaders } from "../SpaceInvaders";
import { Game } from "./Game";
import { GameObject } from "./GameObject";
import { Vector2 } from "./Helpers/Vector2";

export class SpriteAnimation<T extends Game> extends GameObject<T>{


    constructor(gameObject: T){
        super(gameObject, "custom", Vector2.zero, Vector2.zero)
    }

    public onCollisionEnter(other: GameObject<T>): void {
    }
    public onLoad(): void {
    }
    public onUpdate(): void {
    }
    public onUnload(): void {
    }

}