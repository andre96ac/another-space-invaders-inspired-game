import { Game } from "./core/Game.js";

const mainCanvas: HTMLCanvasElement|null  = <HTMLCanvasElement>document.getElementById("mainCanvas");
const mainContext = mainCanvas?.getContext("2d");
if(!!mainCanvas && !!mainContext){
    const game = new Game(mainCanvas, mainContext);
    game.start();
}
