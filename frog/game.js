window.onload = function() {

    var game = new Phaser.Game(848, 480, Phaser.AUTO, '', { preload: preload, create: create, update: update });
    var jumpButton;
    var platforms;
    var character;

    function preload () {
        game.load.image('character', 'assets/character.png');
        game.load.image('platform', 'assets/platform.png');
    }

    function create () {
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
        game.time.events.add(game.rnd.between(1500, 2500), function() {
            var platform = new Platform(game);
            game.add.existing(platform);
            platforms.add(platform);
            createPlatform();
        });
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
};

Character.prototype = Object.create(Phaser.Sprite.prototype);
Character.prototype.constructor = Character;

Character.prototype.update = function() {
    this.body.velocity.x = 0;
    if (jumpButton.isDown) {
        this.body.velocity.y = -700;
        this.body.velocity.x = 200;
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
    this.body.velocity.x = -100;
    if (this.x < -50) {
        this.destroy();
    }
};