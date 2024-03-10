import { Vector2 } from "../Utils/Vector2.js";
import { Bullet } from "./Bullet.js";
import { Enemy } from "./Enemy.js";
import { GameObject } from "./GameObject.js";
export class Wall extends GameObject {
    onCollisionEnter(other) {
        if (other instanceof Bullet || other instanceof Enemy) {
            this.gameController.currentScene?.destroyEl(other);
        }
    }
    load() {
    }
    unload() {
    }
    update() {
    }
    constructor(gameController) {
        super(gameController, "rectangle", Vector2.zero, Vector2.create(6, 6));
        this.collidable = true;
        this.hidden = false;
    }
    setProperties(orientation, length, position) {
        const thickness = 5;
        switch (orientation) {
            case "horizontal":
                this._size = Vector2.create(length, thickness);
                this.moveAtCentre(position);
                break;
            case "vertical":
                this._size = Vector2.create(thickness, length);
                this.moveAtCentre(position);
                break;
        }
    }
}
//# sourceMappingURL=Wall.js.map