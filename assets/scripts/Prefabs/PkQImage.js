const Helper = require('Helper');
cc.Class({
    extends: cc.Component,

    properties: {
        container: cc.Sprite,
    },

    ctor() {
        this.url = '';
    },

    //显示中间的图
    initView(url) {
        if (url) {
            this.url = url;
            Helper.loadHttpImg(this.container, url, { type: 'zoom' });
        }
    },

    //点击查看大图(暂时去掉)
    onClickImg() {
        // let gameNode = cc.find('Canvas');
        // let gameScript = gameNode.getComponent('PKGame');
        // gameScript.showBigImage(this.url);
    }
});
