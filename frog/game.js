window.onload = function() {

    var game = new Phaser.Game(848, 480, Phaser.AUTO, '', { preload: preload, create: create });

    function preload () {
        game.load.image('character', 'assets/character.png');
        game.load.image('platform', 'assets/platform.png');
    }

    function create () {
        var character = game.add.sprite(game.world.centerX, game.world.centerY, 'character');
        character.anchor.setTo(0.5, 0.5);
        character.scale.setTo(0.5, 0.5);


    }

    function randomPlatformSpawnTime() {
        return game.rnd.between(100, 2000);
    }

    function createPlatforms() {
        game.time.events.add(randomPlatformSpawnTime(), function() {
            var platform = new Platform(game);
            game.add.existing(platform);
        });

    }

};

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
};

// Barrier.prototype.update = function() {
//     this.body.velocity.y = barrierSpeed;
//     if(this.y > game.height){
//         this.destroy();
//     }
// };