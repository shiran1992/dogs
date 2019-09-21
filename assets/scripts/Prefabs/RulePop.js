const Helper = require("Helper");
cc.Class({
    extends: cc.Component,

    properties: {

    },

    //关闭规则界面
    onClose() {
        Helper.playButtonMusic();
        this.node.destroy();
    }
});
