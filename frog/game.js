window.onload = function() {

    var game = new Phaser.Game(848, 480, Phaser.AUTO, '', { preload: preload, create: create, update: update});
    var jumpButton;
    var platforms;
    var character;

    var jumpStartTime = 0;

    // game settings
    const PLATFORM_MIN_DELAY = 2000;
    const PLATFORM_MAX_DELAY = 4000;
    const PLATFORM_VELOCITY = -150;

    function preload () {
        game.load.image('character', 'assets/character.png');
        game.load.image('platform', 'assets/platform.png');
    }

    function create () {
        showFps();

        platforms = game.add.group();
        platforms = game.add.physicsGroup();

        character = new Character(game);
        createPlatform();
    }

    function update () {
        game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
        // game.debug.text(jumpStartTime, 2, 38, "#00ff00");

        game.physics.arcade.collide(character, platforms);
        platforms.setAll('body.immovable', true);
    }

    function createPlatform() {
        game.time.events.add(game.rnd.between(PLATFORM_MIN_DELAY, PLATFORM_MAX_DELAY), function() {
            var platform = new Platform(game);
            game.add.existing(platform);
            platforms.add(platform);
            createPlatform();
        });
    }

    function showFps() {
        game.time.advancedTiming = true;
    }

};

Character = function (game) {
    Phaser.Sprite.call(this, game, game.world.centerX, game.world.centerY, 'character');
    game.add.existing(this);
    game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    this.body.gravity.y = 2000;
    this.anchor.setTo(0.5, 0.5);
    this.scale.setTo(0.5, 0.5);
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.jumpStartTime = 0; 
};

Character.prototype = Object.create(Phaser.Sprite.prototype);
Character.prototype.constructor = Character;

Character.prototype.update = function(game) {
    this.game.debug.text(this.jumpStartTime, 2, 38, "#00ff00");

    if (jumpButton.isDown) {
        this.jumpStartTime = this.game.time.now;
    }
    if (jumpButton.isDown && (this.body.onFloor() || this.body.touching.down)) {
        this.body.velocity.y = -800;
        this.body.velocity.x = 300;
    } else if (this.body.onFloor() || this.body.touching.down) {
        this.body.velocity.x = 0;
    }
};

// ====================================================
Platform = function (game) {
    Phaser.Sprite.call(this, game, game.width + 50, game.height - 50, 'platform');
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.anchor.set(0.5);
    this.scale.setTo(0.3, 0.3);
};

Platform.prototype = Object.create(Phaser.Sprite.prototype);
Platform.prototype.constructor = Platform;

Platform.prototype.update = function() {
    this.body.velocity.x = -120;//PLATFORM_VELOCITY;
    if (this.x < -50) {
        this.destroy();
    }
};