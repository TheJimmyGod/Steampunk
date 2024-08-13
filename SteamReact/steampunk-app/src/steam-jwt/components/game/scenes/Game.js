import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import Phaser from "phaser";
import playerSprite from "./assets/player.png"
import ground from "./assets/ground.png"
import space from "./assets/background.png"

export class Game extends Scene
{
    constructor()
    {
        super('Game');
        this.velX = 0;
    }


    preload()
    {
        this.textStyle = {
            fontFamily: 'sans-serif',
            fontSize: '30px',
            fill: '#ffffff',
        };
        this.load.spritesheet("sheet", playerSprite,{
            frameWidth:46,
            frameHeight:62,
        });

        this.load.image("ground",ground);
        this.load.image("space",space);
    }

    create(){
        this.cameras.main.setBackgroundColor(0x00ff00);
        this.add.image(512, 384, 'space');
        this.data.set("score", 0);
        this.add.text(16, 16, 'score: 0', { fontSize: '32px' }).setName("scoreText");
        this.block = this.physics.add.image(512, 670, "ground").setImmovable(true).setScale(0.5);
        this.block.body.setAllowGravity(false);

        this.direction = 1;
        this.moveSpeed = 50;
        this.minY = 300;
        this.maxY = 670;

        this.maxFrameRate = 30;
        this.minFrameRate = 10;

        this.leftWall = this.add.rectangle(0, 389, 5, 1200, 0x000000);
        this.rightWall = this.add.rectangle(1024, 389, 5, 1200, 0x000000);

        if(this.anims.exists('right') === false)
        {
            this.anims.create({
                key: 'right',
                frames: this.anims.generateFrameNumbers("sheet",{frames: [4,5,6,7]}),
                frameRate: 10,
                repeat:  -1
            });
        }

        if(this.anims.exists('left') === false)
        {
            this.anims.create({
                key: 'left',
                frames: this.anims.generateFrameNumbers("sheet",{frames: [8,9,10,11]}),
                frameRate: 10,
                repeat:  -1
            });
        }

        this.player = this.physics.add.sprite(512, 384, 'sheet').setName("player");

        this.player.setBounce(0.2);
        
        this.player.setCollideWorldBounds(true);

        this.physics.add.collider(this.block, this.player);

        this.physics.add.existing(this.leftWall, true); // true는 immovable
        this.physics.add.existing(this.rightWall, true); // true는 immovable

        this.physics.add.collider(this.player, this.leftWall, this.onHitLeftWall, null, this);
        this.physics.add.collider(this.player, this.rightWall, this.onHitRightWall, null, this);

        this.player.setVelocityX(0);
        this.velX = 0;

        this.textMissiles = this.add.group();

        this.time.addEvent({
            delay: 1000,
            callback: () => {
                const randomSide = Math.random() < 0.5 ? 'left' : 'right';
                if (randomSide === 'left') {
                    this.createTextMissile(50, this.sys.game.config.height / 2 + ((Math.random() * this.sys.game.config.height * 0.5) * (Math.random() > 0.5 ? -1 : 1)));
                } else {
                    this.createTextMissile(this.sys.game.config.width - 50, this.sys.game.config.height / 2 + ((Math.random() * this.sys.game.config.height * 0.5) * (Math.random() > 0.5 ? -1 : 1)));
                }
            },
            loop: true // 반복 호출
        });
        EventBus.emit('current-scene-ready', this);
    }

    onHitLeftWall(player, wall) {
        this.velX = 300;
        player.setVelocityX(300);
        player.setVelocityY(-150);
        player.play('right',true);
    }

    onHitRightWall(player, wall) {
        this.velX = -300;
        player.setVelocityX(-300);
        player.setVelocityY(-150);
        player.play('left',true);
    }

    createTextMissile(x, y) {
        const textMissile = this.add.text(x, y, (Math.random() > 0.5) ? "이기훈" : (Math.random() > 0.5) ? "문준호" : "진민장", this.textStyle);
        textMissile.velocityX = (x < this.sys.game.config.width / 2 ? 200 : -200) * (Math.max(Math.random() * 3, 1.0));
        this.textMissiles.add(textMissile);
    }

    update(){
        const cursors = this.input.keyboard.createCursorKeys();

        const player = this.children.getByName("player");

        if(cursors.right.isDown)
        {
            if(this.velX < 300)
                this.velX = this.velX + 5;
            player.setVelocityX(this.velX);
            let frameRate = Phaser.Math.Clamp(this.velX / 300 * this.maxFrameRate, this.minFrameRate, this.maxFrameRate);
            player.anims.timeScale = frameRate / 5;
            this.player.play('right',true);
        }
        else if(cursors.left.isDown)
        {
            if(this.velX >= -300)
            this.velX = this.velX - 5;
            player.setVelocityX(this.velX);
            let frameRate = Phaser.Math.Clamp(-this.velX / 300 * this.maxFrameRate, this.minFrameRate, this.maxFrameRate);
            player.anims.timeScale = frameRate / 5;

            this.player.play('left',true);
        }
        if(cursors.space.isDown && player.body.touching.down)
        {
            player.setVelocityY(-200);
        }
        if(player.y > this.sys.game.config.height - 50)
        {
            this.changeScene();
        }
        
        this.textMissiles.getChildren().forEach(textMissile => {
            textMissile.x += textMissile.velocityX * (this.game.loop.delta / 1000 || 1);
            if (textMissile.x < 0 || textMissile.x > this.sys.game.config.width) {
                if(textMissile.active)
                {
                    this.data.set("score", this.data.get("score") + 10);
                    this.children.getByName("scoreText").setText("Score: " + this.data.get("score"));
                }
                textMissile.setActive(false).setVisible(false);
            }
            if(Phaser.Math.Distance.Between(player.x,player.y, textMissile.x, textMissile.y) < 50)
            {
                if(textMissile.active)
                {
                    if(textMissile.velocityX > 0)
                        {
                            this.velX = 500;
                            player.setGravityY(200);
                            player.setVelocityY(-300);
                            player.setVelocityX(500);
                            this.player.play('right',true);
                        }
                        else
                        {
                            this.velX = -500;
                            player.setGravityY(200);
                            player.setVelocityY(-300);
                            player.setVelocityX(-500);
                            this.player.play('left',true);
                        }
                        player.anims.timeScale = 10;
                        textMissile.setActive(false).setVisible(false);
                }

            }
        });

        if (this.block) {
            const y = this.block.y;
    
            if (y <= this.minY || y >= this.maxY) {
                this.direction *= -1;
            }
    
            this.block.y += this.moveSpeed * this.direction * (this.game.loop.delta / 1000 || 1);
            this.block.setPosition(this.block.x, this.block.y);

            const time = this.time.now;
            const newWidth = 300 + 100 * Math.sin(time / 1000);
            const aspectRatio = this.block.displayWidth / this.block.displayHeight;
            this.block.displayWidth = newWidth;
            this.block.displayHeight = newWidth / aspectRatio;
        }
        if (this.block.body.moves && this.block.body.touching.up && player.body.touching.down) {
            player.setGravityY(10000);
            if(cursors.space.isDown && player.body.touching.down)
                {
                    player.setGravityY(200);
                    player.setVelocityY(-300);
                }
        }
    }

    changeScene()
    {
        this.scene.start('GameOver',this.data);
    }
}