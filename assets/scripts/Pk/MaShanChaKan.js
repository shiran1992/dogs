const Helper = require('Helper');
const PkDataUtil = require('PkDataUtil');
const DataUtil = require('DataUtil');

cc.Class({
    extends: cc.Component,

    properties: {

    },

    //点击提交
    onClickSubmit() {
        //马上进入2
        PkDataUtil.setWhoInPkGameDesc(2);
        Helper.playButtonMusic();
        let mashan =  this.node.parent;
        let prepare =  mashan.parent;
        let base =  prepare.parent;
        let gameDesc = base.getChildByName("GameDesc");
        gameDesc.active = true;
        let gameDescScript = gameDesc.getComponent('GameDesc');
        gameDescScript.initView(true);
    }

});
