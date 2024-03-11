import { Game } from "./core/Game.js";

const mainCanvas: HTMLCanvasElement|null  = <HTMLCanvasElement>document.getElementById("mainCanvas");
if(!!mainCanvas){
    const game = new Game(mainCanvas);
    game.start();
}
