let Helper = require("Helper");
cc.Class({
    extends: cc.Component,

    properties: {
        open: cc.SpriteFrame,
        close: cc.SpriteFrame,
        musicIcon: cc.Sprite
    },

    onLoad() {
        this.musicSwitch = Helper.getMusicSwitch();
        if (this.musicSwitch) {
            Helper.palyBgMusic();
        }
        let spr = this.musicSwitch == true ? this.open : this.close;
        this.musicIcon.spriteFrame = spr;
    },

    onClickMusic() {
        Helper.playButtonMusic();
        this.musicSwitch = !this.musicSwitch;
        let tag = this.musicSwitch ? "1" : "0";
        Helper.setMusicSwitch(tag);

        this.musicIcon.node.runAction(cc.sequence(
            cc.rotateTo(0.1, 20), cc.rotateTo(0.06, -10),
            cc.rotateTo(0.05, 10), cc.rotateTo(0.04, 0),
            cc.callFunc(() => {
                let spr = this.musicSwitch == true ? this.open : this.close;
                this.musicIcon.spriteFrame = spr;
            })));

        if (this.musicSwitch) {
            Helper.palyBgMusic();
        } else {
            Helper.stopBgMusic();
        }

    },

});
