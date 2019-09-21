const DataUtil = require('DataUtil');

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        DataUtil.setModel(1);
        this.timer = setTimeout(() => {
            this.node.destroy();
            //增加一个即将进入观众模式的prefab
            let gameNode = cc.find('Canvas');
            let gameScript = gameNode.getComponent("PKGame");
            gameScript && gameScript.inAudienceModel();
        }, 2000);
    },

    //销毁掉
    doDestroy() {
        clearTimeout(this.timer);
        this.timer = null;
        this.node.destroy();
    },

    onDestroy() {
        this.doDestroy();
    }
});
