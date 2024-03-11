import { Game } from "../core/Game.js";
import { Vector2 } from "../core/Helpers/Vector2.js";
import { Bullet } from "../objects/Bullet.js";
import { Enemy } from "../objects/Enemy.js";
import { GameObject } from "../core/GameObject.js";
import { Player } from "../objects/Player.js";
import { Wall } from "../objects/Wall.js";
import { Scene } from "../core/Scene.js";

export class GameScene extends Scene{

    //#region RATIO AUMENTO DIFFICOLTA'
    
    
    //tempo per ogni livello
    private secondsPerLevel: number = 30;

    //Nemici massimi iniziali per riga 
    private starMaxEnemiesPerRow = 1;

    //Aumento di nemici massimi per riga per livello
    private increaseEnemyRatio = 0.5;

    //Velocità di tick iniziale
    private startTickInterval = 5000;
    
    //Diminuzione velocità di tick per livello
    private tickDecreaseRatio = 400;
    
    //#endregion


    //giocatore
    private player: Player | undefined;
    //nemici
    private enemies: Enemy[] = [];

    //stato tasti premuti
    private pressD: boolean = false;
    private pressA: boolean = false;

    //nemici massimi per riga
    private maxEnemyRowCount = 20;
    //nemici massimi per riga in questo momento
    private currentEnemyRowCount = this.starMaxEnemiesPerRow;
    //posizioni di pawn dei nemici
    private arPositions: number[] = [];

    //istanza nemico generata random quando necessario
    private enemySample: Enemy | undefined;

    //intervallo di tick 
    private tickInterval: number | undefined;
    //puntatore al timer
    private intervalPtr: number | undefined;
    //livello attuale
    private currentLevel: number = 1;


    private bulletRatio: number = 300;



    public onUpdate() {
        // console.log(this.arCollidables)
        if(this.pressA){
            this.player?.moveLeft()
        }
        else if(this.pressD){
            this.player?.moveRight();
        }
        return super.onUpdate();
    }
    public onLoad() {


        //creo l'array con le posizioni dei nemici
        this.initArPositions();

        //registro i listeners sulla tastiera
        this.registerKeyEvents();

        //creo il giocatore
        this.player = this.istantiateEl(Player);
        this.player.moveAtCentre(Vector2.create(this.gameController.mainCanvas.clientWidth/2, this.gameController.mainCanvas.clientHeight - this.player.size.y/2 - 10))

        //creo i muri
        this.initWalls()

        // faccio partire il timer dei nemici
        this.setTick(this.startTickInterval);

        //faccio partire il timer degli spari
        setInterval(() => {
            if(!!this.player){
                const bullet = this.istantiateEl(Bullet);
                bullet.moveAtCentre(Vector2.create(this.player.center.x,  this.player.center.y - this.player.size.y - bullet.size.y/2 - 10));
            }
        }, this.bulletRatio)

        //faccio partire il timer per l'aumento livello
        setInterval(() => this.increaseLevel(), this.secondsPerLevel*1000)

        //disegno lo sfondo
        this.gameController.drawBackground("background.png");
    }

   
    private initWalls(){
        const wallUp = this.istantiateEl(Wall);
        wallUp.setProperties("horizontal",this.gameController.mainCanvas.width, Vector2.create(this.gameController.mainCanvas.width/2, 5));
        const wallDown = this.istantiateEl(Wall);
        wallDown.setProperties("horizontal",this.gameController.mainCanvas.width, Vector2.create(this.gameController.mainCanvas.width/2, this.gameController.mainCanvas.height - 5));
    }
    


    public onUnload(){

    }
    
    /**
     * Registrazione Listeners sulla tastiera
     */
    private registerKeyEvents(): void{
        document.addEventListener("keypress", e => {
            switch (e.key){
                case 'a':
                    this.pressA = true;
                break;
                case 'd':
                    this.pressD = true;
                break;

                case 'p':
                    if(this.gameController.paused){
                        this.gameController.resume();
                    }
                    else{
                        this.gameController.pause();
                    }
                break;
            }
            
        })
        document.addEventListener("keyup", e => {
            if(e.key == 'a'){
                this.pressA = false;
            }
            else if(e.key == 'd'){
                this.pressD = false;
            }
    
        })
        
    }

    /**
     * Creazione array con le posizioni di spawn dei nemici
     */
    private initArPositions(): void{

        this.enemySample = new Enemy(this.gameController);
        delete this.enemySample

        const step = this.gameController.mainCanvas.width / this.maxEnemyRowCount;
        const start = step/2;
        for (let index = 0; index < this.maxEnemyRowCount; index++) {
            this.arPositions.push(step * index + start);
            
        }
    }


    /**
     * Spawna una riga di nemici
     */
    private spawnEnemyRow(){
        const enemyCount = Math.random() * this.currentEnemyRowCount
        const arPositionsCopy = [...this.arPositions];
        for (let counter = 0; counter < enemyCount; counter++) {
            const idx = Math.random() * arPositionsCopy.length;

            const positionX = arPositionsCopy.splice(idx, 1);
            const enemyInstance = this.istantiateEl(Enemy);
            enemyInstance.moveAtCentre(Vector2.create(positionX[0], enemyInstance.size.y /2 + 10));
            this.enemies.push(enemyInstance)

        }
    }

    /**
     * Scatta ad ogni tick per far avanzare e spawnare i nemici
     * @param _this 
     */
    private tick(_this: typeof this){
        _this.enemies.forEach(enemy => enemy.moveDown(enemy));
        _this.spawnEnemyRow();
    }

    /**
     * Cambia l'intervallo di tick
     * @param tickInterval 
     */
    private setTick(tickInterval: number){
        if(tickInterval > 0){
            if(!!this.intervalPtr){
                console.log("pulisco intervallo precedente")
                clearInterval(this.intervalPtr);
            }
    
            this.tickInterval = tickInterval;
            console.log("Setto intervallo a, ", tickInterval)
            this.intervalPtr = setInterval(() => this.tick(this), this.tickInterval);
        }

    }

    /**
     * Aumenta il livello (aumenta la difficaoltà)
     */
    private increaseLevel(){
        this.currentLevel ++;
        if(!!this.tickInterval){
            this.setTick(this.tickInterval - this.tickDecreaseRatio);
        }

        if(this.currentEnemyRowCount + this.increaseEnemyRatio <= this.maxEnemyRowCount){
            this.currentEnemyRowCount += this.increaseEnemyRatio;
        }
        else{
            this.currentEnemyRowCount = this.maxEnemyRowCount;
        }
    }
    public destroyEl(gameObj: GameObject) {
        if(gameObj instanceof Enemy){
            this.enemies.splice(this.enemies.findIndex(el => gameObj == el), 0)
        }
        return super.destroyEl(gameObj);
    }

}