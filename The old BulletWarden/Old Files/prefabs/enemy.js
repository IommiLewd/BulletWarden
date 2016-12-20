var game = game || {};

game.Enemy = function (game, x, y, key, velocity, tilemap, health) {
    Phaser.Sprite.call(this, game, x, y, key);

    this.game = game;
    this.tilemap = tilemap;
    this.anchor.setTo(0.5);
    this.health = health;
    if (velocity === undefined) {
        velocity = (90 + Math.random() * 10) * (Math.random() < 0.5 ? 1 : -1);
    } else {
        var randomNegative = Math.random() < 0.5 ? 1 : -1;
        velocity = velocity *= randomNegative;
    }

    this.game.physics.arcade.enableBody(this);
    this.body.collideWorldBounds = true;
    this.body.bounce.set(1, 0);
    this.body.velocity.x = velocity;

};

game.Enemy.prototype = Object.create(Phaser.Sprite.prototype);
game.Enemy.prototype.constructor = game.Enemy;


game.Enemy.prototype.update = function () {
    var direction
    if (this.body.velocity.x > 0) {
        this.scale.setTo(-1, 1);
        direction = 1;
    } else {
        this.scale.setTo(1, 1);
        direction = -1;
    }
//    
//    if(this.randomNumber === 0) {
//        this.body.velocity.x = 50;
//    } else if(this.randomNumber === 1) {
//        this.body.velocity.x = 00;
//    } else if(this.randomNumber === 2) {
//        this.body.velocity.x = -50;
//    }
//    
    
    
    var nextX = this.x + direction * (Math.abs(this.width) / 2 + 1);
    var nextY = this.bottom + 1;
    var yModifier = this.y - 64;

    var nextTile = this.tilemap.getTileWorldXY(nextX, nextY, 64, 64, 'CollisionLayer');
    if (!nextTile && this.body.blocked.down && this.y > playerYPosition) {
        this.body.velocity.x *= -1;
    }
};