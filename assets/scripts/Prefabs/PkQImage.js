const Helper = require('Helper');
cc.Class({
    extends: cc.Component,

    properties: {
        imgSprite: cc.Sprite,
    },

    ctor() {
        this.url = '';
    },

    //显示中间的图
    initView(url) {
        if (url) {
            this.url = url;
            Helper.loadHttpImg(this.imgSprite, url, { type: 'zoom' });
        }
    },

    //点击查看大图
    onClickImg() {
        let gameNode = cc.find('Canvas');
        let gameScript = gameNode.getComponent('PKGame');
        gameScript.showBigImage(this.url);
    }
});
