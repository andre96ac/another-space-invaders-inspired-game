export class GameObject {
    shape;
    _position;
    _size;
    gameController;
    get position() {
        return this._position;
    }
    get size() {
        return this._size;
    }
    constructor(gameController, shape = "rectangle", position = { x: 0, y: 0 }, size = { x: 0, y: 0 }) {
        this.shape = shape;
        this._position = position;
        this._size = size;
        this.gameController = gameController;
    }
    render(context) {
        context.beginPath();
        switch (this.shape) {
            case "circle":
                context.ellipse(this._position.x, this._position.y, this._size.x, this._size.y, 0, 0, 0);
                break;
            case "rectangle":
                context.rect(this._position.x, this._position.y, this._size.x, this._size.y);
                break;
        }
        context.fill();
    }
}
//# sourceMappingURL=GameObject.js.map