var playerYPosition;
firstMap = function (game) {
    this.player;
    this.left;
    this.right;
    this.up;
    this.down;
    this.playerPos;
    this.healthBar;
    this.health;
    this.combatMarker;
    this.combatButton;
    this.combatModeEngaged = false;
    this.laserPointer;
    this.jumpTimer = 0;
    this.playerHealth = 100;
    this.biteTimer = 0;
    //Tilemap vars
    this.map;
    this.collisionLayer;
    this.ladderLayer;
    this.ladderMode = false;
    this.backTiles;
    this.background;
    //Bullet vars
    this.bullets;
    this.ammoCounter;
    this.nextFire = 0;
    this.angle = 0;
    this.bulletArc = 0;
    this.facingRight = true;
    this.ammo = 0;
    this.ammoBox;
    //Monstervars
    this.enemy;
    this.enemies;
    this.monsterHealth = 25;
    this.reload;



    //Gun Properties  -- SMG  
    this.fireRate = 90; //Default is 190
    this.magazineSize = 30; //Default is 6
    this.recoil = 14; //Default is 50
    this.gunDamage = 8;


    //Gun Properties -- Revolver
//        this.fireRate = 190; //Default is 190
//        this.magazineSize = 7; //Default is 6
//        this.recoil = 60; //Default is 50
//        this.gunDamage = 20;

}

firstMap.prototype = {

    create: function () {
        //Add Controls
        this.left = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.right = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.up = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.down = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
        //this.reload = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
        this.combatButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.combatButton.onDown.add(this.combatMode, this);
        this.loadLevel();
        //Create Enemies
        this.enemies = this.add.group();
        this.createEnemies();
    },
    loadLevel: function () {

        //  --- Create Bullets
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

        }, this);
        //Fill weapon magazine
        this.ammo = this.magazineSize;
        // AmmoCounter Box
        this.ammoBox = this.game.add.image(770, 10, 'ammoBox');
        this.ammoBox.fixedToCamera = true;
        // Create Ammo Counter
        this.ammoCounter = this.game.add.text(796, 12, this.ammo, {
            fill: "#e07723"
        });
        this.ammoCounter.font = 'Press Start 2P';
        this.ammoCounter.fontSize = 18;
        this.ammoCounter.fixedToCamera = true;
        //Background
        this.background = this.game.add.sprite(0, 0, 'background');
        this.background.fixedToCamera = true;

        //Add Tilemap
        this.map = this.add.tilemap('level1');
        this.map.addTilesetImage('guntiles', 'tiles-1');

        //create layers
        this.backTiles = this.map.createLayer('BackTiles');
        this.backgroundLayer = this.map.createLayer('BackgroundLayer');
        this.collisionLayer = this.map.createLayer('CollisionLayer');
        this.ladderLayer = this.map.createLayer('LadderLayer');
        this.game.world.sendToBack(this.backgroundLayer);
        this.game.world.sendToBack(this.backTiles);
        this.game.world.sendToBack(this.background);
        this.collisionLayer.resizeWorld();
        //Everything on collisionLayer will collide
        this.map.setCollisionBetween(0, 160, true, this.collisionLayer);
        this.map.setTileIndexCallback([33, 43, 51, 61], this.onLadder, this, this.ladderLayer);

        //create player

        var playerArr = this.findObjectsByType("player", this.map, 'ObjectLayer');

        this.player = this.add.sprite(playerArr[0].x, playerArr[0].y, 'player', 3);
        this.player.anchor.setTo(0.5);
        this.player.animations.add('walking', [0, 1, 2, 1], 6, true);
        this.game.physics.arcade.enable(this.player);
        this.player.customParams = {};
        this.player.body.collideWorldBounds = true;

        //follow player with the camera
        this.game.camera.follow(this.player);

        //Add Healthbar
        this.healthBar = this.game.add.sprite(12, 12, 'healthBar');
        this.health = this.game.add.tileSprite(20, 15, 418, 12, 'redPixel')
        this.healthBar.bringToTop();
        this.health.bringToTop();
        this.health.fixedToCamera = true;
        this.healthBar.fixedToCamera = true;

        //CombatMode Indicator
        this.combatMarker = this.game.add.sprite(12, 38, 'combatEngaged');
        this.combatMarker.fixedToCamera = true;
        this.combatMarker.alpha = 0.0;

        //Create Laserpointer
        this.laserPointer = this.game.add.tileSprite(0, 0, 800, 2, 'pointer');
        this.laserPointer.anchor.setTo(0.0, 0.0);
        this.player.addChild(this.laserPointer);
        this.laserPointer.alpha = 0.0;
        this.ammoBox.bringToTop();
        this.ammoCounter.bringToTop();
        //MonsterSpawner Timer
        this.game.time.events.repeat(Phaser.Timer.SECOND * 4, 100, this.monsterSpawner, this);
    },
    //Spawn Monster at interval
    monsterSpawner: function () {
        var spawnArr = this.findObjectsByType('MonsterSpawner', this.map, 'ObjectLayer')
        spawnArr.forEach(function (element) {
            var RandNmbr = Math.floor(Math.random() * 4);
            if(RandNmbr === 0){
                console.log(RandNmbr);
            enemy = new game.Enemy(this.game, element.x, element.y, 'monster', 60, this.map, 45);
            this.enemies.add(enemy);
            }else if(RandNmbr === 1){
                enemy = new game.Enemy(this.game, element.x, element.y, 'smallMonster', 110, this.map, 25);
            this.enemies.add(enemy);
            }else if(RandNmbr === 2){
                enemy = new game.Enemy(this.game, element.x, element.y, 'smallMonster', 110, this.map, 20);
                enemy = new game.Enemy(this.game, element.x, element.y, 'monster', 60, this.map, 35);
            this.enemies.add(enemy);
            }
        }, this);
        
        //Destroy Bullet W/ collision layer
    },

    
    //Grab the objects by the type of enemies from the json and spawn enemies here.
    createEnemies: function () {
        var enemyArr = this.findObjectsByType('enemy', this.map, 'ObjectLayer');
        enemyArr.forEach(function (element) {
            enemy = new game.Enemy(this.game, element.x, element.y, 'monster', undefined, this.map, this.monsterHealth);
            this.enemies.add(enemy);
        }, this);
    },


    enemyHit: function (bullet, enemy) {
        enemy.health = enemy.health - this.gunDamage;
        this.bullet.kill();
        enemy.body.velocity.y = 0;
        if (enemy.body.x < this.player.body.x) {
            enemy.body.velocity.x = 180;
        } else {
            enemy.body.velocity.x = -180;
        }
        if (enemy.health < 1) {
            enemy.kill();

        }
    },
    
    
    playerHit: function (player, enemy) {
        if (enemy.body.x < this.player.body.x) {
            enemy.body.velocity.x = 180;
            this.player.body.velocity.x = 600;
        } else {
            enemy.body.velocity.x = -180;
        }
        if (this.time.now > this.biteTimer) {
            this.game.camera.shake(0.06, 40);
            this.playerHealth -= 12;
            this.biteTimer = this.time.now + 750;
        }



    },


    findObjectsByType: function (targetType, tilemap, layer) {
        var result = [];

        tilemap.objects[layer].forEach(function (element) {

            if (element.type == targetType) {
                //element.y -= tilemap.tileHeight;
                result.push(element);
            }
        }, this);

        return result;
    },
    disableLadderMode: function () {
        this.ladderMode = false;
    },
    onLadder: function () {
        this.ladderMode = true;
        if (this.combatModeEngaged === false) {
            this.player.body.velocity.y = 0;
        }
        this.game.time.events.add(Phaser.Timer.SECOND * 0.15, this.disableLadderMode, this);
    },
    combatMode: function () {
        if (this.combatModeEngaged === false) {
            this.combatMarker.alpha = 1.0;
            this.combatModeEngaged = true;
            this.laserPointer.alpha = 0.3;
        } else {
            this.combatMarker.alpha = 0.0;
            this.combatModeEngaged = false;
            this.laserPointer.alpha = 0.0;
            this.reload();
        }
    },
    reload: function () {
        this.ammo = this.magazineSize;
        this.ammoCounter.setText(this.ammo);
    },
    // --- FireFunction
    fire: function () {
        if (this.ammo > 0) {
            if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0) {
                this.nextFire = this.game.time.now + this.fireRate;
                this.ammo--;
                this.bullet = this.bullets.getFirstDead();
                this.ammoCounter.setText(this.ammo);
                this.game.camera.shake(0.01, 20);
                this.bullet.reset(this.player.x - 8, this.player.y - 8);
                this.game.physics.arcade.velocityFromAngle(this.angle, 2000, this.bullet.body.velocity);
                this.bullet.angle = this.angle;
                this.bullet.bringToTop();
                this.collisionLayer.bringToTop();
                this.healthBar.bringToTop();
                this.health.bringToTop();
                this.combatMarker.bringToTop();
                this.ammoBox.bringToTop();
                this.ammoCounter.bringToTop();
                if (this.facingRight) {
                    this.bulletArc = this.bulletArc - this.recoil;
                } else {
                    this.bulletArc = this.bulletArc + this.recoil;
                }

            }
        }
    },
    
        bulletDestroy: function (player, bullet) {
        this.bullet.kill();
    },

    update: function () {
        this.health.width = this.playerHealth / 100 * 418;
        this.laserPointer.rotation = this.game.physics.arcade.angleToPointer(this.player);
        this.laserPointer.angle = this.laserPointer.angle + this.bulletArc;
        if (this.bulletArc > 0) {
            this.bulletArc = this.bulletArc - 1.7;
        }

        if (this.bulletArc < 0) {
            this.bulletArc = this.bulletArc + 1.7;
        }

        if (this.laserPointer.angle < 90 && this.laserPointer.angle > -90) {
            this.facingRight = true;

        } else {
            this.facingRight = false;
        }
        if (this.ladderMode === false) {
            this.game.physics.arcade.gravity.y = 360;
        } else if (this.ladderMode === true && this.combatModeEngaged === false) {

            this.game.physics.arcade.gravity.y = 0;
        }
        this.game.physics.arcade.collide(this.bullet, this.collisionLayer, this.bulletDestroy, null, this);
        this.game.physics.arcade.collide(this.player, this.collisionLayer);
        this.game.physics.arcade.collide(this.enemies, this.collisionLayer);
        this.game.physics.arcade.collide(this.player, this.ladderLayer);
        this.game.physics.arcade.collide(this.bullet, this.enemies, this.enemyHit, null, this);
        this.game.physics.arcade.collide(this.player, this.enemies, this.playerHit, null, this);
        this.player.body.velocity.x = 0;
        if (this.left.isDown) {
            this.player.body.velocity.x = -260;
        }
        if (this.right.isDown) {
            this.player.body.velocity.x = 260;
        }


        if (this.up.isDown && this.player.body.onFloor() && this.time.now > this.jumpTimer) {
            this.player.body.velocity.y = -240;
            this.jumpTimer = this.time.now + 750;
        }


        if (this.ladderMode && this.up.isDown && this.combatModeEngaged === false) {
            this.player.body.velocity.y = -170;
        }
        if (this.ladderMode && this.down.isDown && this.combatModeEngaged === false) {
            this.player.body.velocity.y = 170;
        }

        // --- Fire Gun
        if (this.combatModeEngaged) {
            if (this.game.input.activePointer.isDown) {
                this.fire();
            }
        }

        this.angle = this.laserPointer.angle;
        playerYPosition = this.player.y - 64;
    }




}