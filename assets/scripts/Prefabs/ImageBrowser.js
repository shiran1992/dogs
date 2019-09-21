const Helper = require('Helper');
cc.Class({
    extends: cc.Component,

    properties: {
        bigImage: cc.Sprite
    },

    ctor() {
        this.touch_ids = null;
    },

    onLoad() {
        this.bigImage.node.on(cc.Node.EventType.TOUCH_MOVE, (touches, event) => {
            this.calcMove(touches);
        }, this);
    },

    initView(url) {
        if (url) {
            this.url = url;
            Helper.loadHttpImg(this.bigImage, url, { type: 'zoom' });
        }
    },

    onClose() {
        Helper.playButtonMusic();
        this.node.destroy();
    },
});
