import { SpaceInvaders } from "./SpaceInvaders.js";

const startGame = document.getElementById("start");
startGame?.addEventListener("click", () => {
    startGame.hidden = true;
    const mainContainer = document.getElementById("mainContainer");
    if(!!mainContainer){
        const game = new SpaceInvaders(mainContainer);
        game.start();
    }

})

