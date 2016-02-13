window.onload = function() {

    var game = new Phaser.Game(848, 480, Phaser.AUTO, '', { preload: preload, create: create, update: update});
    var jumpButton;
    var platforms;
    var character;
    var sky;
    
    var jumpStartTime = 0;

    // game settings
    const PLATFORM_MIN_DELAY = 2000;
    const PLATFORM_MAX_DELAY = 4000;
    const PLATFORM_VELOCITY = -150;

    function preload () {
        game.load.image('character', 'assets/character.png');
        game.load.image('platform', 'assets/platform.png');
        game.load.image('sky', 'assets/background_sky.jpg');
    }

    function create () {
        showFps();
        
        sky = game.add.tileSprite(0, 0, 848, 480, 'sky');

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
    this.powerBar = new PowerBar(game, {
            width: 100, 
            height: 15, 
            bgColor: '#fff',
            color: '#FF0000'
        });


};

Character.prototype = Object.create(Phaser.Sprite.prototype);
Character.prototype.constructor = Character;

Character.prototype.update = function(game) {
    this.game.debug.text(this.jumpStartTime, 2, 38, "#00ff00");

    if (jumpButton.isDown && (this.body.onFloor() || this.body.touching.down)) {
        if (this.jumpStartTime == 0) {
            this.jumpStartTime = this.game.time.now;
        }
        this.powerBar.setPercent((this.game.time.now - this.jumpStartTime) / 10);
    }
    if (jumpButton.isUp 
        && (this.body.onFloor() || this.body.touching.down) 
        && this.jumpStartTime > 0) {
        var speed = this.game.time.now - this.jumpStartTime;
        speed = speed > 700 ? 700 : speed;
        this.game.debug.text(speed, 2, 58, "#00ff00");

        this.body.velocity.y = -speed * 1.6;
        this.body.velocity.x = speed * 0.7;
        this.jumpStartTime = 0;

        this.powerBar.setPercent(0);
    }
    else if (this.body.onFloor() || this.body.touching.down) {
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

// ====================================================
PowerBar = function (game, config) {
    this.game = game;
    this.config = config;
    this.drawBackground();
    this.drawLoadBaar();
};

PowerBar.prototype.constructor = PowerBar;

PowerBar.prototype.drawBackground = function() {
    var background = this.game.add.bitmapData(this.config.width, this.config.height);
    background.ctx.fillStyle = this.config.bgColor;
    background.ctx.beginPath();
    background.ctx.rect(0, 0, this.config.width, this.config.height);
    background.ctx.fill();

    this.bgSprite = this.game.add.sprite(100, 100, background);
};

PowerBar.prototype.drawLoadBaar = function() {
    var background = this.game.add.bitmapData(this.config.width, this.config.height);
    background.ctx.fillStyle = this.config.color;
    background.ctx.beginPath();
    background.ctx.rect(0, 0, this.config.width, this.config.height);
    background.ctx.fill();

    this.barSprite = this.game.add.sprite(100, 90, background);
};

PowerBar.prototype.setPercent = function(percent) {
    percent = percent > 100 ? 100 : percent;
    var newWidth = (percent * this.config.width) / 100;
    this.game.add.tween(this.barSprite).to({width: newWidth}, 10, Phaser.Easing.Linear.None, true);
}