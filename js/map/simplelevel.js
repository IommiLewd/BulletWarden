/**
 * base class for a simple game level.
 *
 * @constructor  {}
 * @method   :
 * @property :
 * startPosition {} (x,y)
 */

class SimpleLevel extends Phaser.State {
    constructor() {
            super();
            // can be use later to identify tiles and tile_map
            // this.name = level_name;
        }
        // private methods :
    _loadLevel() {
            //TODO: load the background : should depend on the level name
            this.background = this.game.add.sprite(0, 0, 'background');
            this.background.fixedToCamera = true;
            this._map = this.add.tilemap('level-1');
            this._map.addTilesetImage('guntiles', 'tiles-1');
            //create layers
            this._back_tiles = this._map.createLayer('BackTiles');
            this._background_layer = this._map.createLayer('BackgroundLayer');
            this._collision_layer = this._map.createLayer('CollisionLayer');
            this._ladder_layer = this._map.createLayer('LadderLayer');
            this.game.world.sendToBack(this._background_layer);
            this.game.world.sendToBack(this._back_tiles);
            this.game.world.sendToBack(this.background);
            this._collision_layer.resizeWorld();
            this._initBullets();
            //Nextfire var is for the gun
            this._nextFire = 0;
            //Bitetimer is the damagetimer
            this.biteTimer = 0;
        }
        // load player/ add player
    _addPlayer(x, y) {
        var playerArr = this._findObjectsByType("player", this._map, 'ObjectLayer');
        this.player = new Player(this.game, playerArr[0].x, playerArr[0].y);
    }
    
    _player_position_update (enemy, enemies, player) {
        var capturedPosition = this.player.body.y; 
        this.enemies.forEach(function(enemy, enemies, player) {
        enemy._playerPositionY = capturedPosition;
        })
    }
    //Adding Enemies
    _addEnemies() {
        //Create Group enemies to handle collisions
        this.enemies = this.add.group();
        //Create Array to store all objects with the type 'enemy'
        var enemyArr = this._findObjectsByType('enemy', this._map, 'ObjectLayer');
        //For Each element in array create Enemy Instance
        enemyArr.forEach(function (element) {
            this.enemy = new Enemy(this.game, element.x, element.y, 'monster', undefined, this.map, 60);
            //add enemy to enemies array
            this.enemies.add(this.enemy);
        }, this);
    }
    //We use this to find and create objects from the json.
    _findObjectsByType(targetType, tilemap, layer) {
        var result = [];
        tilemap.objects[layer].forEach(function (element) {
            if (element.type == targetType) {
                element.y -= tilemap.tileHeight;
                result.push(element);
            }
        }, this);
        return result;
    }
    _player_damage(player, enemy) {
            if (this.player._health < 1) {
                this.player._health = 0;
            } else if (this.time.now > this.biteTimer && this.player._health > 1) {
                this.game.camera.shake(0.06, 40);
                this.player._health -= 30;
                this.biteTimer = this.time.now + 450;
                if (enemy.body.x < this.player.body.x) {
                    enemy.body.velocity.x = +180;
                } else {
                    enemy.body.velocity.x = -180;
                }
            }
        }
        //Initializing Bullets
    _initBullets() {
            this.bullets = this.game.add.group();
            this.bullets.enableBody = true;
            this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
            this.bullets.createMultiple(50, 'bullet');
            this.bullets.setAll('checkWorldBounds', true);
            this.bullets.setAll('outOfBoundsKill', true);
            this.bullets.setAll('anchor.x', 0.5);
            this.bullets.setAll('anchor.y', 0.5);
            //  --- Disable Gravity for Each Bullet
            this.bullets.forEach(function (L) {
                L.body.allowGravity = false;
            })
        }
        //Fire Weapon
    _fireWeapon(fireRate, damage, recoil) {
        this.bullet;
        this.fireRate = fireRate;
        if (this.game.time.now > this._nextFire && this.bullets.countDead() > 3) {
            this._nextFire = this.game.time.now + this.fireRate;
            this.bullet = this.bullets.getFirstDead();
            this.bullet.reset(this.player.body.x - 0, this.player.body.y + 32);
            this.game.camera.shake(0.02, 30);
            this.game.physics.arcade.velocityFromAngle(this.player._laser_pointer.angle, 2000, this.bullet.body.velocity);
            this.bullet.angle = this.player._laser_pointer.angle;
            this.bullet.bringToTop();
            this._damage = damage;
            this.bullets.add(this.bullet);
            if (this.player._laser_pointer.angle < 90 && this.player._laser_pointer.angle > -90) {
                this.player._recoil -= recoil;
            } else {
                this.player._recoil += recoil;
            }
        }
    }
    _enemy_hit(bullet, enemy) {
        bullet.kill();
        enemy._health -= this._damage;
        if (enemy._health < 1) {
            enemy.kill();
        } else if (enemy.body.x < this.player.body.x) {
            enemy.body.velocity.x = +180;
        } else {
            enemy.body.velocity.x = -180;
        }
        enemy.body.velocity.y = 0;
        enemy._player_spotted = true;
    }
    _kill_bullet(bullet, _collision_layer) {
        this.bullet.kill();
    }
    _checkCollision() {
            this.game.physics.arcade.collide(this.player, this._collision_layer);
            this.game.physics.arcade.collide(this.player, this._ladder_layer);
            this.game.physics.arcade.collide(this.enemies, this._collision_layer);
            this.game.physics.arcade.collide(this.bullet, this.enemies, this._enemy_hit, null, this);
            this.game.physics.arcade.collide(this.bullet, this._collision_layer, this._kill_bullet, null, this);
            this.game.physics.arcade.collide(this.player, this.enemies, this._player_damage, null, this);
        }
        //public methods :
        //@override:
    preload() {}
    create() {
        //set the physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this._loadLevel();
        this._addPlayer(0, 0);
        this._addEnemies();
        this.game.camera.follow(this.player);
        //Everything on _collision_layer will collide
        this._map.setCollisionBetween(0, 160, true, this._collision_layer);
        this._map.setTileIndexCallback([33, 43, 51, 61], this.player.setOnLadder, this.player, this._ladder_layer);
    }
    update() {
        this._checkCollision();
        //Fire Weapon RateofFire, Damage, Recoil. We eventually need to add , key here. for the bulletsprite.
        if (this.game.input.activePointer.isDown && this.player._combat_mode_engaged) {
            this._fireWeapon(90, 16, 12);
        }
        this._player_position_update ();
    }
}