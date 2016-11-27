class Preload extends Phaser.State {
    preload() {

        //this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

        // Images :
        this.load.image('player', 'img/PlayerTemplate.png');
        this.load.image('background', 'img/backgroundImage.png');
        this.load.image('monster', 'img/MonsterTemplate.png');
        this.load.image('ammoBox', 'img/ammoBox.png');
        this.load.image('pointer', 'img/laserpointer.png');
        this.load.image('pixel', 'img/invisiblePixel.png');
        this.load.image('healthBar', 'img/healthBar.png');
        this.load.image('redPixel', 'img/redPixel.png');
        this.load.image('combatEngaged', 'img/combatEngaged.png');
        this.load.image('tiles-1', 'img/guntiles.png');
        this.load.image('bullet', 'img/bullet.png');
        this.load.image('reload', 'img/reload.png');
        // js scripts :
        this.load.script('player', 'js/entity/player.js');
        this.load.script('enemy', 'js/entity/enemy.js');
        this.load.script('simpleLevel', 'js/map/simplelevel.js');

        // json files :
        this.load.tilemap('level-1', 'json/mapOne.json', null, Phaser.Tilemap.TILED_JSON); //
    }
    create() {
        console.log("Preload.js:  Preload.create-> load_Level");
        this.game.state.add('SimpleLevel', SimpleLevel);
        this.game.state.start('SimpleLevel');
    }

}