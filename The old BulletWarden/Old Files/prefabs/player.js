var game = game || {};

game.Player = function (state, x, y, data) {
    Phaser.sprite.call(this, state.game, x, y, 'player');
    var playerArr = this.findObjectsByType("player", this.map, 'ObjectLayer');

    this.player = this.add.sprite(playerArr[0].x, playerArr[0].y, 'player', 3);
    this.player.anchor.setTo(0.5);
    this.player.animations.add('walking', [0, 1, 2, 1], 6, true);
    this.game.physics.arcade.enable(this.player);
    this.player.body.collideWorldBounds = true;

    this.game.camera.follow(this.player);
};

game.Player.prototype = Object.create(Phaser.Sprite.prototype);
game.Player.prototype.constructor = game.Player;