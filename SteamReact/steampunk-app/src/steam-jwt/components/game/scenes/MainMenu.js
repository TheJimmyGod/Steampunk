import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import space from "./assets/background.png"

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    preload()
    {
        this.load.image('space', space);
    }
    
    create ()
    {
        this.add.image(512, 384, 'space');
        const userInfo = window.gameGlobalState.userInfo;
        this.add.text(512, 384, `안녕하세요 ${userInfo.username}님!\n 플레이 하시려면 Space를 눌러주세요!`, {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8, align: 'center'
        }).setOrigin(0.5).setDepth(100);
        EventBus.emit('current-scene-ready', this);
    }

    update()
    {
        const cursors = this.input.keyboard.createCursorKeys();
        if(cursors.space.isDown)
        {
            this.changeScene();
        }
    }

    changeScene ()
    {
        this.scene.start('Game');
    }
}