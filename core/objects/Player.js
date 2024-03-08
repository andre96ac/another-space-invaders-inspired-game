import { GameObject } from "./GameObject.js";
export class Player extends GameObject {
    playerSpeed = 5;
    constructor(gameController) {
        const playerSize = 20;
        super(gameController, "rectangle", { x: gameController.mainCanvas.clientWidth / 2, y: gameController.mainCanvas.clientHeight - playerSize }, { x: playerSize, y: playerSize });
    }
    moveRight() {
        if (this._position.x + this._size.x >= this.gameController.mainCanvas.width) {
            this._position.x = this.gameController.mainCanvas.width - this._size.x;
        }
        else {
            this._position.x += this.playerSpeed;
        }
    }
    moveLeft() {
        if (this._position.x - this.playerSpeed < 0) {
            this._position.x = 0;
        }
        else {
            this._position.x -= this.playerSpeed;
        }
    }
}
//# sourceMappingURL=Player.js.map