class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        // Load characters spritesheet
        //this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");

        this.load.image("character1", "character_squarePurple.png");
        this.load.image("character2", "character_squareYellow.png");
        this.load.image("character3", "character_squareRed.png");
        this.load.image("characterS", "character_squareGreen.png");
        // Load tilemap information
        //this.load.image("tilemap_tiles", "tilemap_packed.png");                         // Packed tilemap
        this.load.image("tiles", "spritesheet_retina.png");
        //this.load.tilemapTiledJSON("platformer-level-1", "platformer-level-1.tmj");   // Tilemap in JSON
        this.load.tilemapTiledJSON("tutorial", "tutorial.tmj");
        this.load.tilemapTiledJSON("level-1E-platform", "level-1E-platform.tmj");
        this.load.tilemapTiledJSON("level-2E-platform", "level-2E-platform.tmj");
        this.load.tilemapTiledJSON("level-3E-platform", "level-3E-platform.tmj");
        this.load.tilemapTiledJSON("level-1-platform", "level-1-platform.tmj");
        this.load.tilemapTiledJSON("level-2-platform", "level-2-platform.tmj");
        this.load.tilemapTiledJSON("level-3-platform", "level-3-platform.tmj");
        this.load.tilemapTiledJSON("level-S-platform", "level-S-platform.tmj");

        this.load.tilemapTiledJSON("endScreen", "endScreen.tmj");

        this.load.spritesheet("Saws", "spritesheet_retina.png", {
            frameWidth: 128,
            frameHeight: 128
        });
        this.load.spritesheet("Gems", "spritesheet_retina.png", {
            frameWidth: 128,
            frameHeight: 128
        });
        this.load.spritesheet("Doors", "spritesheet_retina.png", {
            frameWidth: 128,
            frameHeight: 128
        });

        this.load.image("background", "bluesky.png");

        this.load.image("runParticle", "smoke_04.png");

        this.load.audio("jump", "impactMetal_medium_004.ogg");
        this.load.audio("dash", "glass_001.ogg");
        this.load.audio("dead", "laserSmall_003.ogg");
        this.load.audio("collect", "powerUp2.ogg");
        this.load.audio("doorOpen", "powerUp9.ogg");
        this.load.audio("complete", "powerUp5.ogg");
        this.load.audio("doorEnter", "confirmation_002.ogg");
        // this.load.multiatlas("particles", "kenny-particles.json");
    }

    create() {
        // this.anims.create({
        //     key: 'sawAnim',
        //     defaultTextureKey: "saw",
        //     frames: [{
        //         frame: ""
        //     }],
        //     frameRate: 15,
        //     repeat: -1
        // });

        // this.anims.create({
        //     key: 'saw2',
        //     defaultTextureKey: "platformer_characters",
        //     frames: [
        //         { frame: "tile_0000.png" }
        //     ],
        //     repeat: -1
        // });

        // this.anims.create({
        //     key: 'jump',
        //     defaultTextureKey: "platformer_characters",
        //     frames: [
        //         { frame: "tile_0001.png" }
        //     ],
        // });

         // ...and pass to the next Scene
        this.scene.start("tutorialScene");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}