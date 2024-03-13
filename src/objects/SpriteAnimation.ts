import { SpaceInvaders } from "../SpaceInvaders";
import { Game } from "../core/Game";
import { GameObject } from "../core/GameObject";
import { Vector2 } from "../core/Helpers/Vector2";

export class SpriteAnimation extends GameObject<SpaceInvaders>{


    constructor(gameObject: SpaceInvaders){
        super(gameObject, "custom", Vector2.zero, Vector2.zero)
    }

    public onCollisionEnter(other: GameObject<SpaceInvaders>): void {
    }
    public onLoad(): void {
    }
    public onUpdate(): void {
    }
    public onUnload(): void {
    }

}