class Enemy extends Phaser.Sprite {
    constructor(game, x, y, key, velocity, tilemap, health) {
        super(game, x, y, key, velocity, tilemap);
        if (velocity === undefined) {
            velocity = (60 + Math.random() * 20) * (Math.random() < 0.5 ? 1 : -1);
        }
        game.add.existing(this);
        game.physics.arcade.enable(this);
        this.anchor.setTo(0.5);
        this.game.physics.arcade.enableBody(this);
        this.body.collideWorldBounds = true;
        this.body.bounce.set(1, 0);
        this.body.velocity.x = velocity;
        this._health = health;
        this._player_spotted = false;
        this._map = game.add.tilemap('level-1');
        
    }
    update() {
        this.heightCheck;
        if(this._playerPositionY === undefined) { 
        } else {
             this.heightCheck = this._playerPositionY;
        }
        var direction;
        if (this.body.velocity.x > 0) {
            this.scale.setTo(-1, 1);
            direction = 1;
        } else {
            this.scale.setTo(1, 1);
            direction = -1;
        }
        var nextX = this.x + direction * (Math.abs(this.width) / 2 + 1);
        var nextY = this.bottom + 1;
        var nextTile = this._map.getTileWorldXY(nextX, nextY, 64, 64, 'CollisionLayer');

        if (!nextTile && this.body.blocked.down && this.y > this.heightCheck - 6 ) {
            this.body.velocity.x *= -1;
        }
    }
}