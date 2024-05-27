class endGame extends Phaser.Scene {
    constructor() {
        super("endOfGame");

        this.shiftKey = null;
        this.lookingLeft = false;
        this.dashCD = 20;
        this.dashTimer = 0;
        this.dashes = 1;
        this.deaths = 0;
    }

    preload()
    {
        this.load.image("heart", "assets/tile_heart.png"); 
    }


    init() {
        // variables and settings
        this.ACCELERATION = 300;
        this.DRAG = 1200;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -800;
        this.DASH_VELOCITY = -600;
    }

    create() {
        this.bg = this.add.image(1025, 600, "background");
        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        //this.map = this.add.tilemap("platformer-level-1", 18, 18, 45, 25);

        this.map = this.add.tilemap("endScreen", 64, 64, 32, 20);

        // // Add a tileset to the map
        // // First parameter: name we gave the tileset in Tiled
        // // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        // //this.tileset = this.map.addTilesetImage("kenny_tilemap_packed", "tilemap_tiles");
        this.tileset = this.map.addTilesetImage("level-end", "tiles");
        this.objectTileset = this.map.addTilesetImage("level-end-Obby", "tiles");

        // Create a layer
        //this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);
        
        this.groundLayer = this.map.createLayer("floor-and-tiles", this.tileset, 0, 0);

        //this.animLayer = this.map.createLayer("Saws", this.objectTileset);
        //this.groundLayer.setScale(0.75);
        //this.sawsLayer = this.map.createLayer("Saws", this.objectTileset, 0, 0);
        //this.gemsLayer = this.map.createLayer("Gems", this.objectTileset, 0, 0);
        //this.sawsLayer.setScale(0.75);
        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        this.doorEasy = this.map.createFromObjects("Doors", {
            name: "doorEasy",
            key: "Doors",
            frame: 93
        });
        this.doorHard = this.map.createFromObjects("Doors", {
            name: "doorHard",
            key: "Doors",
            frame: 93
        });
        
        this.physics.world.enable(this.doorEasy, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.doorHard, Phaser.Physics.Arcade.STATIC_BODY);
        //this.doorGroup = this.add.group(this.door);

        this.movingEmitter = this.add.particles(0, 0, 'runParticle', {
            speed: 1,
            scale: { start: 0.1, end: 0.25 },
            alpha: { start: 1, end: 0 },
            // higher steps value = more time to go btwn min/max
            lifespan: { min: 10, max: 200, steps: 1000 }
        });
        this.movingEmitter.stop();

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(1025, 1100, "characterS").setScale(0.5);
        my.sprite.player.setCollideWorldBounds(true);
        my.sprite.player.setSize(90, 128, true);

        this.movingEmitter.startFollow(my.sprite.player, 0, 23, false);
        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);

        this.physics.add.overlap(my.sprite.player, this.doorEasy, (obj1, obj2) => {
            this.sound.play("doorEnter");
            this.scene.get("platformerScene").resetGD();
            this.scene.get("platformerScene2").resetGD();
            this.scene.get("platformerScene3").resetGD();
            this.scene.get("platformerSceneS").resetGD();
            this.scene.start("platformerSceneE");
        });
        this.physics.add.overlap(my.sprite.player, this.doorHard, (obj1, obj2) => {
            this.sound.play("doorEnter");
            this.scene.get("platformerSceneE").resetGD();
            this.scene.get("platformerScene2E").resetGD();
            this.scene.get("platformerScene3E").resetGD();
            this.scene.start("platformerScene");
        });

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        // debug key listener (assigned to D key)
        // this.input.keyboard.on('keydown-D', () => {
        //     this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
        //     this.physics.world.debugGraphic.clear()
        // }, this);
        this.physics.world.drawDebug = false;

        this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25);
        this.cameras.main.setZoom(1.25);

        this.physics.world.TILE_BIAS = 48;

        this.easyText = this.add.text(1025, 350, "Normal Levels", { fontSize: "52px", fill: "#EE0" });
        this.easyText.setOrigin(0.5);
        this.hardText = this.add.text(1025, 40, "IMPOSSIBLE LEVELS", { fontSize: "52px", fill: "#EE0" });
        this.hardText.setOrigin(0.5);

        this.winText = this.add.text(1025, 730, "!!!CONGRATULATIONS!!!", { fontSize: '52px', fill: '#6962d2' });
        this.winText.setOrigin(0.5);

        this.deathCounter = this.scene.get("platformerScene").getDeaths()
                            + this.scene.get("platformerScene2").getDeaths()
                            + this.scene.get("platformerScene3").getDeaths()
                            + this.scene.get("platformerSceneS").getDeaths()
                            + this.scene.get("platformerSceneE").getDeaths()
                            + this.scene.get("platformerScene2E").getDeaths()
                            + this.scene.get("platformerScene3E").getDeaths();
        this.deathText = this.add.text(1025, 820, "You died " + this.deathCounter + " times", { fontSize: '52px', fill: '#EE0' });
        this.deathText.setOrigin(0.5);

        this.heartsEarned = 0;
        if(this.scene.get("platformerSceneE").getGems() == 10)
        {
            this.heartsEarned++;
        }
        if(this.scene.get("platformerScene2E").getGems() == 10)
        {
            this.heartsEarned++;
        }
        if(this.scene.get("platformerScene3E").getGems() == 10)
        {
            this.heartsEarned++;
        }
        if(this.scene.get("platformerScene").getGems() == 10)
        {
            this.heartsEarned++;
        }
        if(this.scene.get("platformerScene2").getGems() == 10)
        {
            this.heartsEarned++;
        }
        if(this.scene.get("platformerScene3").getGems() == 10)
        {
            this.heartsEarned++;
        }
        if(this.scene.get("platformerSceneS").getGems() == 10)
        {
            this.heartsEarned++;
        }

        this.gemsText = this.add.text(1025, 930, "You earned...", { fontSize: '52px', fill: '#F00' });
        this.gemsText.setOrigin(0.5);
        if(this.heartsEarned == 0)
        {
            this.noGemsText = this.add.text(1025, 990, "no hearts :(", { fontSize: '52px', fill: '#F00' });
            this.noGemsText.setOrigin(0.5);
        }
        else if(this.heartsEarned == 1)
        {
            this.add.sprite(1025, 990, "heart");
        }
        else if(this.heartsEarned == 2)
        {
            this.add.sprite(985, 990, "heart");
            this.add.sprite(1065, 990, "heart");
        }
        else if(this.heartsEarned == 3)
        {
            this.add.sprite(945, 990, "heart");
            this.add.sprite(1025, 990, "heart");
            this.add.sprite(1105, 990, "heart");
        }
        else
        {
            this.add.sprite(905, 990, "heart");
            this.add.sprite(985, 990, "heart");
            this.add.sprite(1065, 990, "heart");
            this.add.sprite(1145, 990, "heart");
        }
    }

    update() {
        this.dashTimer--;
        if(cursors.left.isDown) {
            // TODO: have the player accelerate to the left
            this.lookingLeft = true;
            if(my.sprite.player.body.velocity.x > 0)
            {
                my.sprite.player.body.setAccelerationX(0);
                my.sprite.player.body.setDragX(this.DRAG);
            }
            else
            {
                my.sprite.player.body.setAccelerationX(-this.ACCELERATION);
            }
            my.sprite.player.setFlip(true, false);
            //my.sprite.player.anims.play('walk', true);

        } else if(cursors.right.isDown) {
            this.lookingLeft = false;
            // TODO: have the player accelerate to the right
            if(my.sprite.player.body.velocity.x < 0)
            {
                my.sprite.player.body.setAccelerationX(0);
                my.sprite.player.body.setDragX(this.DRAG);
            }
            else
            {
                my.sprite.player.body.setAccelerationX(this.ACCELERATION);
            }
            my.sprite.player.resetFlip();
            //my.sprite.player.anims.play('walk', true);

        } else {
            // TODO: set acceleration to 0 and have DRAG take over
            my.sprite.player.body.setAccelerationX(0);
            my.sprite.player.body.setDragX(this.DRAG);
            //my.sprite.player.anims.play('idle');
        }

        if(Math.abs(my.sprite.player.body.velocity.x) > 200 && my.sprite.player.body.blocked.down)
        {
            this.movingEmitter.start();
        }
        else
        {
            this.movingEmitter.stop();
        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            // TODO: set a Y velocity to have the player "jump" upwards (negative Y direction)    
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            this.sound.play("jump");
        }
        
        // reset dash
        if(my.sprite.player.body.blocked.down && this.dashTimer < 0)
        {
            this.dashes = 1;
        }
        // player dash
        if(Phaser.Input.Keyboard.JustDown(this.shiftKey) && this.dashes > 0)
        {
            if(this.lookingLeft)
                my.sprite.player.body.setVelocityX(this.DASH_VELOCITY);
            else
                my.sprite.player.body.setVelocityX(-this.DASH_VELOCITY);
            this.dashes -= 1;
            this.dashTimer = this.dashCD;
            this.sound.play("dash");
        }
    }
}