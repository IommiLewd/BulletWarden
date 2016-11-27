/**
 * base class for the player.
 * @constructor
 *  game : the phaser game.
 *  posx : his location in x.
 *  posy : his location in y.
 * @method toggleCombatMode
 *  change the player mode on Combat Mode.
 * @method reload
 *  TODO: reload the current weapon magazine
 * @property onLadder
 *  the player colliding with a ladder boolean.
 *  @getter : isOnLadder;
 *  @setTrue : setOnLadder;
 *  @reset : resetOnLadder
 * @method update :
 *
 */
class Player extends Phaser.Sprite {
    constructor(game, posx, posy) {

        super(game, posx, posy, 'player', 3);
        this.anchor.setTo(0.5);
        this.animations.add('walking', [0, 1, 2, 1], 6, true);

        game.add.existing(this);
        game.physics.arcade.enable(this);

        this.body.collideWorldBounds = true;
        //follow player with the camera
        this._combat_mode_engaged = false;
        this._ladder_mode = false;
        this._jump_timer = 0;
        //NOTE: this is bulletArc :
        this._recoil = 0;
        this._nextFire = 0;
        this._magazine_size = 40;
        this._total_ammo = 160;
        this._ammo = 40;
        this._initControl();
        this._initHealth(100);
        this._initCombat();

    }

    _initControl() {
        this._left = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this._right = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        this._up = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        this._down = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
        this._combat_button = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this._combat_button.onDown.add(this.toggleCombatMode, this);

    }
    _initHealth(health) {
        //Add Healthbar
        this._health = health;
        this._health_bar = this.game.add.sprite(4, 3, 'healthBar');
        this._health_pixel = this.game.add.tileSprite(7, 6, 262, 10, 'redPixel')
        this._health_bar.bringToTop();
        this._health_pixel.bringToTop();
        this._health_bar.fixedToCamera = true;
        this._health_pixel.fixedToCamera = true;
    }
    _initCombat() {
            //CombatMode Indicator
            this._combat_marker = this.game.add.sprite(6, 22, 'combatEngaged');
            this._reloadImg = this.game.add.sprite(144, 22, 'reload');
            this._ammo_Box = this.game.add.sprite(774, 6, 'ammoBox');
            this._ammo_Counter = this.game.add.text(800, 10, this._ammo, {
                fill: "#e07723"
            });
            this._ammo_Counter.font = 'Press Start 2P';
            this._ammo_Counter.fontSize = 16;
            this._ammo_Counter.fixedToCamera = true;
            this._ammo_Box.fixedToCamera = true;
            this._reloadImg.fixedToCamera = true;
            this._combat_marker.fixedToCamera = true;
            this._combat_marker.alpha = 0.0;
            //Create Laserpointer
            this._laser_pointer = this.game.add.tileSprite(0, 0, 800, 2, 'pointer');
            this._laser_pointer.anchor.setTo(0.0, 0.0);
            this.addChild(this._laser_pointer);
            this._laser_pointer.alpha = 0.0;
        }
        /*
        _initPhysic(){

        }*/
        // COMBAT MODE :
    toggleCombatMode() {

        if (this._combat_mode_engaged === false) {
            this._combat_mode_engaged = true;
            this._combat_marker.alpha = 1.0;
            this._laser_pointer.alpha = 0.2;
        } else {
            this._combat_mode_engaged = false;
            this._combat_marker.alpha = 0.0;
            this._laser_pointer.alpha = 0.0;
            this._reload();
        }
    }

    _reload() {
        console.log('Reload Fired');
            // no recoil after reload
            this._recoil = 0;
            this._ammo = this.magazine_size;
            this.ammo_counter.setText(this.ammo);
        }
        // LADDER MODE :
    isOnLadder() {
        return this._ladder_mode;
    }
    resetLadderMode() {
        this._ladder_mode = false;
    }
    setOnLadder() {
        this._ladder_mode = true;
        this.game.time.events.add(Phaser.Timer.SECOND * 0.15, this.resetLadderMode, this);
    }


    //@override

    update() {
        //on player actions :
        // moving cursor
        this._health_pixel.width = this._health / 100 * 262;
        this._laser_pointer.rotation = this.game.physics.arcade.angleToPointer(this);
        this._laser_pointer.angle = this._laser_pointer.angle + this._recoil;
        if (this._recoil != 0) {
            this._recoil = 0.90 * this._recoil; //reduce recoil by 10%
        }



        //on the floor :
        if (this._left.isDown) {
            this.body.velocity.x = -260;
        } else if (this._right.isDown) {
            this.body.velocity.x = 260;
        } else {
            this.body.velocity.x = 0;
        }

        //on jumping
        if (this._ladder_mode === false && this._up.isDown && this.body.onFloor() && this.game.time.now > this._jump_timer) {
            this.body.velocity.y = -240;
            this._jump_timer = this.game.time.now + 1150;
        }

        //on Ladder :
        if (this._ladder_mode === false || this._combat_mode_engaged === true) {
            this.game.physics.arcade.gravity.y = 360;
        } else {
            this.game.physics.arcade.gravity.y = 0;
            this.body.velocity.y = 0;
        }

        if (this._ladder_mode && this._up.isDown && this._combat_mode_engaged === false) {
            this.body.velocity.y = -170;
        }
        if (this._ladder_mode && this._down.isDown && this._combat_mode_engaged === false) {
            this.body.velocity.y = 170;
        }
        this.number = this._laser_pointer;
    }

}