import { Vector2 } from "../Utils/Vector2.js";
export class GameObject {
    shape;
    _position;
    _size;
    gameController;
    _collidable = false;
    hidden = false;
    destroyOffScreen = true;
    arTags = [];
    hasTag(tag) {
        return this.arTags.includes(tag);
    }
    addTag(tag) {
        if (!this.hasTag(tag)) {
            this.arTags.push(tag);
        }
    }
    removeTag(tag) {
        this.arTags.splice(this.arTags.findIndex(el => el == tag), 1);
    }
    get collidable() {
        return this._collidable;
    }
    set collidable(value) {
        this._collidable = value;
    }
    get position() {
        return this._position;
    }
    set position(value) {
        // this.checkCollisions();
        this._position = value;
        if (this.destroyOffScreen && this.isOffScreen()) {
            this.destroy();
        }
    }
    get size() {
        return this._size;
    }
    get center() {
        return Vector2.create(this._position.x + this._size.x / 2, this._position.y + this._size.y / 2);
    }
    constructor(gameController, shape = "rectangle", position = Vector2.zero, size = Vector2.zero) {
        this.shape = shape;
        this._position = position;
        this._size = size;
        this.gameController = gameController;
    }
    render(context) {
        if (!this.hidden) {
            context.beginPath();
            switch (this.shape) {
                case "circle":
                    context.ellipse(Math.round(this._position.x), Math.round(this._position.y), Math.round(this._size.x / 2), Math.round(this._size.y / 2), 0, 0, 360);
                    break;
                case "rectangle":
                    context.rect(Math.round(this._position.x), Math.round(this._position.y), Math.round(this._size.x), Math.round(this._size.y));
                    break;
            }
            context.fill();
        }
    }
    moveAtCentre(position) {
        switch (this.shape) {
            case "circle":
                this.position = Vector2.copy(position);
                break;
            case "rectangle":
                this.position = Vector2.create(position.x - this._size.x / 2, position.y - this._size.y / 2);
                break;
        }
    }
    destroy() {
        this.gameController.currentScene?.destroyEl(this);
    }
    isOffScreen() {
        return this.center.x < 0 - this.size.x / 2
            || this.center.x > this.gameController.mainCanvas.width + this.size.x / 2
            || this.center.y < 0 - this.size.y / 2
            || this.center.y > this.gameController.mainCanvas.height + this.size.y / 2;
    }
}
//# sourceMappingURL=GameObject.js.map