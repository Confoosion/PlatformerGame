class Platformer3Easy extends Phaser.Scene {
    constructor() {
        super("platformerScene3E");

        this.shiftKey = null;
        this.lookingLeft = false;
        this.dashCD = 20;
        this.dashTimer = 0;
        this.dashes = 1;
        this.deathTimer = 0;
        this.deaths = 0;
        this.gemsCollected = 0;
    }

    preload()
    {
        this.load.image("movingSaw", "assets/tile_bush.png"); 
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
        // POINTS TO KEEP
        // {[0, 200], [0, 0]} at 1535, 1100;
        // {[0, 350], [0, 0]} at 1795, 1100;
        // {[0 ,650], [0, 0]} at 2045, 1100;
        this.moveCoords = [
            0, 490, 0, 0,
            0, 1200, 0, 0,
        ];
        this.moveSawCoords = [
            1535, 1300,
            1925, 1300,
        ];

        let movingSawGroup = [];
        for(let i = 0; i < this.moveCoords.length; i += 4)
        {
            this.pointss = [
                this.moveCoords[i], this.moveCoords[i+1],
                this.moveCoords[i+2], this.moveCoords[i+3]
            ];
            this.curve = new Phaser.Curves.Spline(this.pointss);
            my.sprite.movingSaw = this.add.follower(this.curve, this.moveSawCoords[i*0.5], this.moveSawCoords[i*0.5+1], "movingSaw");
            my.sprite.movingSaw.startFollow ({
                from: 0,
                to: 1,
                delay: 0,
                duration: 3000,
                ease: 'Sine.easeInOut',
                repeat: -1,
                yoyo: true,
                //rotateToPath: true,
                //rotationOffset: -90
            });
            let moveSaw = this.physics.add.existing(my.sprite.movingSaw);
            moveSaw.body.setAllowGravity(false);
            movingSawGroup[i*0.25] = moveSaw;
        }
        // this.pointss = [
        //     0, 200,
        //     0, 0,
        // ];
        // this.curve = new Phaser.Curves.Spline(this.pointss);
        // my.sprite.movingSaw = this.add.follower(this.curve, 2045, 1100, "movingSaw");
        // my.sprite.movingSaw.startFollow ({
        //     from: 0,
        //     to: 1,
        //     delay: 0,
        //     duration: 3000,
        //     ease: 'Sine.easeInOut',
        //     repeat: -1,
        //     yoyo: true,
        //     //rotateToPath: true,
        //     //rotationOffset: -90
        // });
        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        //this.map = this.add.tilemap("platformer-level-1", 18, 18, 45, 25);
        this.map = this.add.tilemap("level-3E-platform", 64, 64, 40, 20);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        //this.tileset = this.map.addTilesetImage("kenny_tilemap_packed", "tilemap_tiles");
        this.tileset = this.map.addTilesetImage("level-3E", "tiles");
        this.objectTileset = this.map.addTilesetImage("level-3E-Obby", "tiles");

        // Create a layer
        this.saws = this.map.createFromObjects("Saws", {
            name: "saw",
            key: "Saws",
            frame: 76
        });
        //this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);
        this.groundLayer = this.map.createLayer("floor-and-tiles", this.tileset, 0, 0);
        //this.groundLayer.setScale(0.75);
        //this.sawsLayer = this.map.createLayer("Saws", this.objectTileset, 0, 0);
        //this.gemsLayer = this.map.createLayer("Gems", this.objectTileset, 0, 0);
        //this.sawsLayer.setScale(0.75);
        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        this.gems = this.map.createFromObjects("Gems", {
            name: "gem",
            key: "Gems",
            frame: 91
        });
        this.door = this.map.createFromObjects("Doors", {
            name: "door",
            key: "Doors",
            frame: 93
        })
        
        this.physics.world.enable(this.saws, Phaser.Physics.Arcade.STATIC_BODY);
        this.sawGroup = this.add.group(this.saws);

        this.physics.world.enable(this.gems, Phaser.Physics.Arcade.STATIC_BODY);
        this.gemGroup = this.add.group(this.gems);

        this.physics.world.enable(this.door, Phaser.Physics.Arcade.STATIC_BODY);
        this.doorGroup = this.add.group(this.door);

        // let moveSaw = this.physics.add.existing(my.sprite.movingSaw);
        // moveSaw.body.setAllowGravity(false);
        
        this.movingEmitter = this.add.particles(0, 0, 'runParticle', {
            speed: 1,
            scale: { start: 0.1, end: 0.25 },
            alpha: { start: 1, end: 0 },
            // higher steps value = more time to go btwn min/max
            lifespan: { min: 10, max: 200, steps: 1000 }
        });
        this.movingEmitter.stop();

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(1275, 1100, "character3").setScale(0.5);
        my.sprite.player.setCollideWorldBounds(true);
        my.sprite.player.setSize(90, 128, true);

        this.movingEmitter.startFollow(my.sprite.player, 0, 23, false);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);

        this.physics.add.overlap(my.sprite.player, this.doorGroup, (obj1, obj2) => {
            if(this.gemsCollected >= 5)
            {
                this.sound.play("doorEnter");
                this.scene.start("endOfGame");
            }
        });
        this.physics.add.overlap(my.sprite.player, this.sawGroup, (obj1, obj2) => {
            if(this.deathTimer < 0)
            {
                this.deathTimer = 3;
                this.dead();
            }
        });
        this.physics.add.overlap(my.sprite.player, movingSawGroup, (obj1, obj2) => {
            if(this.deathTimer < 0)
            {
                this.deathTimer = 3;
                this.dead();
            }
        });
        this.physics.add.overlap(my.sprite.player, this.gemGroup, (obj1, obj2) => {
            this.gemsCollected++;
            this.gemsText.setText("Gems:" + this.gemsCollected + "/10");

            if(this.gemsCollected == 10)
            {
                this.gemsText.setColor("#0F0");
                this.sound.play("complete");
            }
            else if(this.gemsCollected == 5)
            {
                this.gemsText.setColor("#ffff00");
                this.sound.play("doorOpen");
            }
            else
            {
                this.sound.play("collect");
            }
            obj2.destroy();
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

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels+1000, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25);
        this.cameras.main.setZoom(1.25);

        this.physics.world.TILE_BIAS = 48;

        this.deathText = this.add.text(300, 200, "Deaths: 0", { fontSize: '52px', fill: '#EE0' });
        this.deathText.setScrollFactor(0);

        this.gemsText = this.add.text(1980, 200, "Gems:0/10", { fontSize: "52px", fill: "#F00" });
        this.gemsText.setScrollFactor(0);

        //this.animatedTiles.init(this.map);
        this.gemsCollected = 0;
        this.deaths = 0;
    }

    update() {
        this.deathTimer--;
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

    dead()
    {
        if(this.deathTimer > 0)
        {
            my.sprite.player.x = 1275;
            my.sprite.player.y = 1100;
            my.sprite.player.body.setVelocityY(0);
            my.sprite.player.body.setVelocityX(0);
            this.deaths++;
            this.deathText.setText("Deaths: " + this.deaths);
            this.sound.play("dead");
        }
    }

    getDeaths()
    {
        return this.deaths;
    }

    getGems()
    {
        return this.gemsCollected;
    }
    resetGD()
    {
        this.gemsCollected = 0;
        this.deaths = 0;
    }
}