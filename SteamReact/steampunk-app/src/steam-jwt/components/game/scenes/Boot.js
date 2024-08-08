import { Scene } from "phaser";

export class Boot extends Scene{
    constructor()
    {
        super('Boot');
    }

    preload()
    {
        // 배경화면 씌우기
        this.load.image('background', '../assets/bg.png');
    }
    create()
    {
        // 시작하기
        this.scene.start('Preloader');
    }
}