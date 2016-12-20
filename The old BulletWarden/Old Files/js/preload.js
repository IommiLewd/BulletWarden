preload = function (game) {



    WebFontConfig = {
        google: {
            families: ['Press Start 2P']

        }
    }
}





preload.prototype = {

    preload: function () {
        console.log('preloading yo');
        //this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
        this.load.image('player', 'img/PlayerTemplate.png');
        this.load.image('ass', 'img/reload.jpg');
        this.load.image('background', 'img/backgroundImage.png');
        this.load.image('monster', 'img/MonsterTemplate.png');
        this.load.image('smallMonster', 'img/MonsterTemplateSmall.png');
        this.load.image('ammoBox', 'img/ammoBox.png');
        this.load.image('pointer', 'img/laserpointer.png');
        this.load.image('pixel', 'img/invisiblePixel.png');
        this.load.image('healthBar', 'img/healthBar.png');
        this.load.image('redPixel', 'img/redPixel.png');
        this.load.image('combatEngaged', 'img/combatEngaged2.png');
        
        this.load.image('tiles-1', 'img/guntiles.png');
        this.load.image('bullet', 'img/bullet.png');
        this.load.tilemap('level1', 'json/mapOne.json', null, Phaser.Tilemap.TILED_JSON); //
    },
    create: function () {
        this.game.state.start('firstMap');
    }
}
