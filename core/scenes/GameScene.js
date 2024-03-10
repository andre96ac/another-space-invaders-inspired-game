import { Vector2 } from "../Utils/Vector2.js";
import { Bullet } from "../objects/Bullet.js";
import { Enemy } from "../objects/Enemy.js";
import { Player } from "../objects/Player.js";
import { Wall } from "../objects/Wall.js";
import { Scene } from "./Scene.js";
export class GameScene extends Scene {
    //#region RATIO AUMENTO DIFFICOLTA'
    //tempo per ogni livello
    secondsPerLevel = 30;
    //Nemici massimi iniziali per riga 
    starMaxEnemiesPerRow = 1;
    //Aumento di nemici massimi per riga per livello
    increaseEnemyRatio = 0.5;
    //Velocità di tick iniziale
    startTickInterval = 5000;
    //Diminuzione velocità di tick per livello
    tickDecreaseRatio = 400;
    //#endregion
    //giocatore
    player;
    //nemici
    enemies = [];
    //stato tasti premuti
    pressD = false;
    pressA = false;
    //nemici massimi per riga
    maxEnemyRowCount = 20;
    //nemici massimi per riga in questo momento
    currentEnemyRowCount = this.starMaxEnemiesPerRow;
    //posizioni di pawn dei nemici
    arPositions = [];
    //istanza nemico generata random quando necessario
    enemySample;
    //intervallo di tick 
    tickInterval;
    //puntatore al timer
    intervalPtr;
    //livello attuale
    currentLevel = 1;
    bulletRatio = 300;
    update() {
        // console.log(this.arCollidables)
        if (this.pressA) {
            this.player?.moveLeft();
        }
        else if (this.pressD) {
            this.player?.moveRight();
        }
        return super.update();
    }
    load() {
        //creo l'array con le posizioni dei nemici
        this.initArPositions();
        //registro i listeners sulla tastiera
        this.registerKeyEvents();
        //creo il giocatore
        this.player = this.istantiateEl(Player);
        this.player.moveAtCentre(Vector2.create(this.gameController.mainCanvas.clientWidth / 2, this.gameController.mainCanvas.clientHeight - this.player.size.y / 2 - 5));
        //creo i muri
        this.initWalls();
        // faccio partire il timer dei nemici
        this.setTick(this.startTickInterval);
        //faccio partire il timer degli spari
        setInterval(() => {
            if (!!this.player) {
                const bullet = this.istantiateEl(Bullet);
                bullet.moveAtCentre(Vector2.create(this.player.center.x, this.player.center.y - this.player.size.y / 2 - bullet.size.y / 2 - 2));
            }
        }, this.bulletRatio);
        //faccio partire il timer per l'aumento livello
        setInterval(() => this.increaseLevel(), this.secondsPerLevel * 1000);
    }
    initWalls() {
        const wallUp = this.istantiateEl(Wall);
        wallUp.setProperties("horizontal", this.gameController.mainCanvas.width, Vector2.create(this.gameController.mainCanvas.width / 2, 5));
        const wallDown = this.istantiateEl(Wall);
        wallDown.setProperties("horizontal", this.gameController.mainCanvas.width, Vector2.create(this.gameController.mainCanvas.width / 2, this.gameController.mainCanvas.height - 5));
    }
    unload() {
    }
    /**
     * Registrazione Listeners sulla tastiera
     */
    registerKeyEvents() {
        document.addEventListener("keypress", e => {
            if (e.key == 'a') {
                this.pressA = true;
            }
            else if (e.key == 'd') {
                this.pressD = true;
            }
        });
        document.addEventListener("keyup", e => {
            if (e.key == 'a') {
                this.pressA = false;
            }
            else if (e.key == 'd') {
                this.pressD = false;
            }
        });
    }
    /**
     * Creazione array con le posizioni di spawn dei nemici
     */
    initArPositions() {
        this.enemySample = new Enemy(this.gameController);
        delete this.enemySample;
        const step = this.gameController.mainCanvas.width / this.maxEnemyRowCount;
        const start = step / 2;
        for (let index = 0; index < this.maxEnemyRowCount; index++) {
            this.arPositions.push(step * index + start);
        }
    }
    /**
     * Spawna una riga di nemici
     */
    spawnEnemyRow() {
        const enemyCount = Math.random() * this.currentEnemyRowCount;
        const arPositionsCopy = [...this.arPositions];
        for (let counter = 0; counter < enemyCount; counter++) {
            const idx = Math.random() * arPositionsCopy.length;
            const positionX = arPositionsCopy.splice(idx, 1);
            const enemyInstance = this.istantiateEl(Enemy);
            enemyInstance.moveAtCentre(Vector2.create(positionX[0], enemyInstance.size.y / 2 + 10));
            this.enemies.push(enemyInstance);
        }
    }
    /**
     * Scatta ad ogni tick per far avanzare e spawnare i nemici
     * @param _this
     */
    tick(_this) {
        _this.enemies.forEach(enemy => enemy.moveDown(enemy));
        _this.spawnEnemyRow();
    }
    /**
     * Cambia l'intervallo di tick
     * @param tickInterval
     */
    setTick(tickInterval) {
        if (tickInterval > 0) {
            if (!!this.intervalPtr) {
                console.log("pulisco intervallo precedente");
                clearInterval(this.intervalPtr);
            }
            this.tickInterval = tickInterval;
            console.log("Setto intervallo a, ", tickInterval);
            this.intervalPtr = setInterval(() => this.tick(this), this.tickInterval);
        }
    }
    /**
     * Aumenta il livello (aumenta la difficaoltà)
     */
    increaseLevel() {
        this.currentLevel++;
        if (!!this.tickInterval) {
            this.setTick(this.tickInterval - this.tickDecreaseRatio);
        }
        if (this.currentEnemyRowCount + this.increaseEnemyRatio <= this.maxEnemyRowCount) {
            this.currentEnemyRowCount += this.increaseEnemyRatio;
        }
        else {
            this.currentEnemyRowCount = this.maxEnemyRowCount;
        }
    }
    destroyEl(gameObj) {
        if (gameObj instanceof Enemy) {
            this.enemies.splice(this.enemies.findIndex(el => gameObj == el), 0);
        }
        super.destroyEl(gameObj);
    }
}
//# sourceMappingURL=GameScene.js.map