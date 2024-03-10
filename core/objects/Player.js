import { Vector2 } from "../Utils/Vector2.js";
import { GameObject } from "./GameObject.js";
export class Player extends GameObject {
    onCollisionEnter(other) {
    }
    update() {
    }
    load() {
    }
    unload() {
    }
    playerSpeed = 3;
    constructor(gameController) {
        const playerSize = 30;
        super(gameController, "rectangle", Vector2.zero, Vector2.create(playerSize, playerSize));
    }
    moveRight() {
        if (this.position.x + this._size.x >= this.gameController.mainCanvas.width) {
            this.position = Vector2.create(this.gameController.mainCanvas.width - this._size.x, this.position.y);
        }
        else {
            this.position = Vector2.create(this.position.x + this.playerSpeed * this.gameController.deltaTime, this.position.y);
        }
    }
    moveLeft() {
        if (this.position.x - this.playerSpeed < 0) {
            this.position = Vector2.create(0, this.position.y);
        }
        else {
            this.position = Vector2.create(this.position.x - this.playerSpeed * this.gameController.deltaTime, this.position.y);
        }
    }
}
//# sourceMappingURL=Player.js.map