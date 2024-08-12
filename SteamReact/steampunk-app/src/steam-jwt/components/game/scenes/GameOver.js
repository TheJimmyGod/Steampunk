import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import space from "./assets/background.png"
import axios from "axios";
import { SERVER_HOST } from "../../../apis/api";
export class GameOver extends Scene
{
    constructor()
    {
        super('GameOver');
        this.score = 0;
    }
    init(data) {
        // 데이터는 data 매개변수를 통해 전달됩니다.
        this.score = data.list.score;
    }
    preload()
    {
        this.load.image("space",space);
    }

    create(){
        const userInfo = window.gameGlobalState.userInfo;
        this.cameras.main.setBackgroundColor(0x00ff00);
        // Boot로부터 받은 background의 투명도를 줄이는 모양
        this.add.image(512, 384, 'space');

        EventBus.emit('current-scene-ready', this);
        this.sendToServer(userInfo);
    }

    update()
    {
        const cursors = this.input.keyboard.createCursorKeys();
        if(cursors.space.isDown)
        {
            this.changeScene();
        }
    }

    changeScene()
    {
        this.scene.start('Game');
    }

    async sendToServer(userInfo)
    {
        if(userInfo === undefined || userInfo === null)
            return;
        let bestUser = {};
        axios({
            url: `${SERVER_HOST}/best_score`,
            method:'get'
        }).then(response=>{
            const{data, status} = response;
            if(status === 200)
                bestUser = data;
            axios({
                url: `${SERVER_HOST}/score/` + userInfo.id,
                method:'post',
                data: JSON.stringify(this.score),
                headers:{
                    "Content-Type": "application/json"
                }
            }).then(response => {
                const {data,status} = response;
                if(status === 200)
                {
                    if(data === true)
                    {
                        if(bestUser.miniGame_Score < this.score)
                        {
                            this.add.text(512, 384, `베스트 스코어 기록 갱신!\n Score: ${this.score}\n ${userInfo.username}님!\n계속하시려면 Space 눌러주세요`, {
                                fontFamily: 'Arial Black', fontSize: 25, color: '#ffffff',
                                stroke: '#000000', strokeThickness: 8, align: 'center'
                            }).setOrigin(0.5).setDepth(100);
                        }
                        else
                        {
                            this.add.text(512, 384, `내 점수 갱신!\nScore: ${this.score}\n최고 점수는 ${bestUser.username}님의 ${bestUser.miniGame_Score}\n${userInfo.username}님!\n계속하시려면 Space 눌러주세요`, {
                                fontFamily: 'Arial Black', fontSize: 25, color: '#ffffff',
                                stroke: '#000000', strokeThickness: 8, align: 'center'
                            }).setOrigin(0.5).setDepth(100);
                        }
                    }
                    else
                    {
                        let arr = ['어이없는', '처참한', '슬픈', '비참한', '안쓰러운', '경악할만한', '초토화된', '비장한', '당혹스러운', '쳐다보기 힘든'];
    
                        this.add.text(512, 384, `${arr[Math.floor(Math.random() * 10)]} 패배!\n최고 점수는 ${bestUser.username}님의 ${bestUser.miniGame_Score}\nScore: ${this.score}\n ${userInfo.username}님! 계속하시려면 Space 눌러주세요`, {
                            fontFamily: 'Arial Black', fontSize: 25, color: '#ffffff',
                            stroke: '#000000', strokeThickness: 8, align: 'center'
                        }).setOrigin(0.5).setDepth(100);
                    }
                }
            })
        })
    }
}