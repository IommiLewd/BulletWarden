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
        this.game.canvas.oncontextmenu = function (e) {
            e.preventDefault();
        }
        this.background = this.game.add.sprite(0, 0, 'background');
        this.background.fixedToCamera = true;
        this._map = this.add.tilemap('level-1');
        this._map.addTilesetImage('guntiles', 'tiles-1');
        //create layers
        this._back_tiles = this._map.createLayer('BackTiles');
        this._background_layer = this._map.createLayer('BackgroundLayer');
        this._collision_layer = this._map.createLayer('CollisionLayer');
        this._ladder_layer = this._map.createLayer('LadderLayer');
        this._front_layer = this._map.createLayer('ForegroundLayer');
        this._front_layer.bringToTop();
        this.game.world.sendToBack(this._background_layer);
        this.game.world.sendToBack(this._back_tiles);
        this.game.world.sendToBack(this.background);
        this._collision_layer.resizeWorld();
        this._initBullets();
        //Nextfire var is for the gun
        this._nextFire = 0;


    }
    _addPlayer(x, y) {
        var playerArr = this._findObjectsByType("player", this._map, 'ObjectLayer');
        this.player = new Player(this.game, playerArr[0].x, playerArr[0].y);
    }


    _player_position_update() {
            if (this.player.world.x < this._positionEvaluator) {
                this.player._playerFacingRight = true;
            } else {
                this.player._playerFacingRight = false;
            }
        }
        //We use this to find and create objects from the json.
    _findObjectsByType(targetType, tilemap, layer) {
        var result = [];
        tilemap.objects[layer].forEach(function (element) {
            if (element.type == targetType) {
                //element.y -= tilemap.tileHeight;
                result.push(element);
            }
        }, this);
        return result;
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
        if (this.player._energyShieldActive === false) {
            this.bullet;
            this.fireRate = fireRate;
            if (this.game.time.now > this._nextFire && this.bullets.countDead() > 3) {
                this._nextFire = this.game.time.now + this.fireRate;
                this.bullet = this.bullets.getFirstDead();
                this.bullet.reset(this.player.body.x + 10, this.player.body.y + 28);
                this.game.camera.shake(0.016, 30);
                if (this.player._playerFacingRight) {
                    this.game.physics.arcade.velocityFromAngle(this.player._laser_pointer.angle, 1900, this.bullet.body.velocity);
                } else {
                    this.game.physics.arcade.velocityFromAngle(this.player._laser_pointer.angle *= -1, 1400, this.bullet.body.velocity);
                }
                this.bullet.angle = this.player._laser_pointer.angle;
                this.bullet.bringToTop();
                this.bullets.add(this.bullet);
                this.player._fireAnimation();
            }
        }
    }
    _kill_bullet(bullets, _collision_layer) {
        this.bullet.kill();
    }
    _checkCollision() {
            this.game.physics.arcade.collide(this.player, this._collision_layer);
            this.game.physics.arcade.collide(this.player, this._ladder_layer);
            this.game.physics.arcade.collide(this.bullet, this._collision_layer, this._kill_bullet, null, this);

        }
        //public methods :
        //@override:
    preload() {}
    create() {
        //set the physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this._loadLevel();
        this._front_layer.bringToTop();
        this._addPlayer(0, 0);

        this.game.camera.follow(this.player);
        //Everything on _collision_layer will collide
        this._map.setCollisionBetween(0, 160, true, this._collision_layer);
        this._map.setTileIndexCallback([33, 43, 51, 61], this.player.setOnLadder, this.player, this._ladder_layer);
    }
    update() {
        this._positionEvaluator = this.game.input.activePointer.x + this.game.camera.x;
        this._checkCollision();

        //Fire Weapon RateofFire, Damage, Recoil. We eventually need to add , key here. for the bulletsprite.
        if (this.game.input.activePointer.leftButton.isDown && this.player._ladderMode === false) {
            this._fireWeapon(90, 12, 3); //Smg Settings (90, 6, 3)
            //this._fireWeapon(150, 30, 34); //Revolver settings. Kinda shit
        }


        if (this.game.input.activePointer.rightButton.isDown && this.player._ladderMode === false) {
            console.log('energyShieldFired');
            this.player._energyShield.visible = true;
            this.player._energyShieldActive = true;

        } else {
            this.player._energyShield.visible = false;
            this.player._energyShieldActive = false;
        }





        this._player_position_update();

    }
}








/*
  _addEnemies() {
        //Create Group enemies to handle collisions
        this.enemies = this.add.group();
        //Create Array to store all objects with the type 'enemy'
        var enemyArr = this._findObjectsByType('enemy', this._map, 'ObjectLayer');
        //For Each element in array create Enemy Instance
        enemyArr.forEach(function (element) {
            this.enemy = new Enemy(this.game, element.x, element.y, 'monster', undefined, this.map, 80);
            //add enemy to enemies array
            this.amountOfEnemies++;
            this.enemies.add(this.enemy);

        }, this);

    }

    _enemy_hit(bullet, enemy) {
        enemy.animations.play('FastMovement');
        bullet.kill();
        enemy._health -= this._damage;

        enemy._enemy_MovementReset();
        enemy.body.velocity.y = 0;
        enemy._player_spotted = true;
        enemy._damage_animation();
        if (enemy._health < 1) {
            enemy.kill();
            this.player._activeEnemies--;
            this.player._enemyProgressUpdate();
            if (this.player._activeEnemies === 0) {
                console.log('arghblargh');
                this.amountOfEnemies = 0;

                this._monster_Spawner();
                this.player._activeEnemies = this.amountOfEnemies;
                this.player._enemiesInRound = this.amountOfEnemies;
                this.player._enemyProgressUpdate();
                console.log()

            }
        }


    }
    
    
    
    
    
    
        _player_damage(player, enemy) {
        if (this.player._health < 1) {
            this.player._health = 0;
        } else if (this.time.now > this.biteTimer && this.player._health > 1) {
            this.game.camera.shake(0.06, 40);
            this.player._health -= 30;
            this.biteTimer = this.time.now + 450;
            enemy._enemy_MovementReset();
        }

        this.game.time.events.add(Phaser.Timer.SECOND * 1, enemy._enemy_MovementReset, enemy);
    }
*/




/*

    //  this.game.physics.arcade.overlap(this.bullet, this._collision_layer, this._kill_bullet, null, this);
           // this.game.physics.arcade.collide(this.player, this.enemies, this._player_damage, null, this);

            //this.game.physics.arcade.collide(this.enemies, this._collision_layer);
           // this.game.physics.arcade.collide(this.bullet, this.enemies, this._enemy_hit, null, this);











  _monster_Spawner() {
            this._current_wave++;
            this._waveModifier += 2;
            this.player._currentWave.setText(this._current_wave);
            console.log('MonsterSpawner Fired! Current Wave Count ' + this._current_wave);
            var spawnArr = this._findObjectsByType('MonsterSpawner', this._map, 'ObjectLayer');
            //For Each element in array create Enemy Instance
            for (this.r = 0; this.r < 4 + this._waveModifier; this.r++) {
                spawnArr.forEach(function (element) {
                    for (this.i = 0; this.i < 1; this.i++) {
                        this.enemy = new Enemy(this.game, element.x, element.y, 'monster', undefined, this.map, 80);
                        console.log('Enemy Added');
                    }
                       this.amountOfEnemies++;
                    //add enemy to enemies array
                    this.enemies.add(this.enemy);
                }, this);
            }
        }*/