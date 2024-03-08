import { Enemy } from "../objects/Enemy.js";
import { Player } from "../objects/Player.js";
import { Scene } from "./Scene.js";
export class GameScene extends Scene {
    //giocatore
    player;
    //nemici
    enemies = [];
    //stato tasti premuti
    pressD = false;
    pressA = false;
    //nemici massimi per riga
    maxEnemyRowCount = 30;
    //nemici massimi per riga in questo momento
    currentEnemyRowCount = 0;
    //posizioni di pawn dei nemici
    arPositions = [];
    //istanza nemico generata random quando necessario
    enemySample;
    //intervallo di tick 
    tickInterval;
    //puntatore al timer
    intervalPtr;
    //contatore di tick
    tickCounter = 0;
    //livello attuale
    currentLevel = 1;
    //#region RATIO AUMENTO DIFFICOLTA'
    //Numero di tick per aumento livello
    tickPerLevel = 20;
    //Nemici massimi iniziali per riga 
    starMaxEnemiesPerRow = 5;
    //Aumento di nemici massimi per riga per livello
    increaseEnemyRatio = 1;
    //Velocità di tick iniziale
    startTickInterval = 4000;
    //Diminuzione velocità di tick per livello
    tickDecreaseRatio = 200;
    //#endregion
    update() {
        if (this.pressA) {
            this.player?.moveLeft();
        }
        else if (this.pressD) {
            this.player?.moveRight();
        }
    }
    load() {
        this.currentEnemyRowCount = this.starMaxEnemiesPerRow;
        //creo l'array con le posizioni dei nemici
        this.initArPositions();
        //registro i listeners sulla tastiera
        this.registerKeyEvents();
        //creo il giocatore
        this.player = this.istantiateEl(Player);
        // faccio partire il timer dei nemici
        this.setTick(this.startTickInterval);
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
        const enemySizeX = this.enemySample.size.x;
        delete this.enemySample;
        const step = this.gameController.mainCanvas.width / this.maxEnemyRowCount;
        const start = step / 2 - enemySizeX / 2;
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
            enemyInstance.moveAt({ x: positionX[0], y: enemyInstance.size.y });
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
        this.tickCounter++;
        if (this.tickCounter / this.tickPerLevel > this.currentLevel) {
            this.increaseLevel();
        }
    }
    /**
     * Cambia l'intervallo di tick
     * @param tickInterval
     */
    setTick(tickInterval) {
        if (tickInterval > 0) {
            if (!!this.intervalPtr) {
                clearInterval(this.intervalPtr);
            }
            this.tickInterval = tickInterval;
            setInterval(() => this.tick(this), this.tickInterval);
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
}
//# sourceMappingURL=GameScene.js.map