window.onload = function() {

    var game = new Phaser.Game(848, 480, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render});
    var jumpButton;
    var platforms;
    var character;
    var sky;
    var frog;

    var downFrog;

    // game settings
    const PLATFORM_MIN_DELAY = 2000;
    const PLATFORM_MAX_DELAY = 4000;
    const PLATFORM_VELOCITY = -120;

    function preload () {
        // game.load.image('platform', 'assets/platform.png');
        game.load.image('platform', 'assets/river_sheet.png');
        game.load.image('sky', 'assets/background_sky.jpg');

        game.load.spritesheet('frog', 'assets/frog.png', 512, 432, 5);
    }

    function create () {
        sky = game.add.tileSprite(0, 0, 848, 480, 'sky');

        platforms = game.add.group();
        platforms = game.add.physicsGroup();

        character = new Character(game);
        createPlatform();
    }

    function update () {
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

    function render() {
//        game.debug.body(character);
//        platforms.forEachAlive(renderGroup, this);
    }

    function renderGroup(member) {
        game.debug.body(member);
    }
};

Character = function (game) {
    Phaser.Sprite.call(this, game, game.world.centerX, game.world.centerY, 'frog');
    this.animations.add('down', [1], 15, true);
    this.animations.add('up', [1, 2, 3, 4], 15, true);
    this.animations.add('ground', [0], 15, true);

    game.add.existing(this);
    game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    this.body.gravity.y = 2000;
    this.anchor.setTo(-0.5, -0.5);
    this.scale.setTo(0.2, 0.2);
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    this.jumpStartTime = 0;
    this.speed = 0;
};

Character.prototype = Object.create(Phaser.Sprite.prototype);
Character.prototype.constructor = Character;

Character.prototype.update = function(game) {
    if (jumpButton.isDown && (this.body.onFloor() || this.body.touching.down)) {
        if (this.jumpStartTime == 0) {
            this.jumpStartTime = this.game.time.now;
            this.animations.play('down', 15, true);
        }
    }
    if (jumpButton.isUp 
        && (this.body.onFloor() || this.body.touching.down) 
        && this.jumpStartTime > 0) {
        this.speed = this.game.time.now - this.jumpStartTime;
        this.speed = this.speed > 700 ? 700 : this.speed;
     
        this.body.velocity.y = -this.speed * 1.6;
        this.body.velocity.x = this.speed * 0.7;
        this.jumpStartTime = 0;

        this.animations.play('up', 30, false);
    }
    else if (this.body.onFloor() || this.body.touching.down) {
        this.body.velocity.x = 0;
        this.speed = 0;
    }
    if (this.speed === 0 && !jumpButton.isDown) {
        this.animations.play('ground', 10, true);
    }

};

// ====================================================
Platform = function (game) {
    Phaser.Sprite.call(this, game, game.width + 50, game.height - 50, 'platform');
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.anchor.set(0.5);
    this.scale.setTo(0.25, 0.25);
    this.body.setSize(200, 50, 0, 20);
};

Platform.prototype = Object.create(Phaser.Sprite.prototype);
Platform.prototype.constructor = Platform;

Platform.prototype.update = function() {
    this.body.velocity.x = -120;//PLATFORM_VELOCITY;
    if (this.x < -50) {
        this.destroy();
    }
};