import { Vector2 } from "../Utils/Vector2.js";
import { Enemy } from "./Enemy.js";
import { GameObject } from "./GameObject.js";
export class Bullet extends GameObject {
    onCollisionEnter(other) {
        if (other instanceof Enemy) {
            other.hit();
            this.destroy();
        }
    }
    speed = 6;
    update() {
        this.moveUp();
    }
    load() {
    }
    unload() {
    }
    constructor(gameController) {
        super(gameController, "circle", Vector2.zero, Vector2.create(6, 6));
        this.collidable = true;
    }
    moveUp() {
        this.position = Vector2.create(this.position.x, this.position.y - this.speed * this.gameController.deltaTime);
    }
}
//# sourceMappingURL=Bullet.js.map