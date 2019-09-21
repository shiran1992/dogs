const DataUtil = require('DataUtil');
const Helper = require('Helper');

cc.Class({
    extends: cc.Component,

    properties: {
        PkGameDescNode: cc.Node,
        PkGameDescSprite: cc.Sprite,
        tu: cc.Node,
    },

    onLoad: function () {
        //this.initView("");
    },

    initView(obj = {}) {
        let json = DataUtil.getPrepareDate();
        cc.log(json);
        if (json.data.reward) {
            this.PkGameDescNode.active = true;
            Helper.loadHttpImg(this.PkGameDescSprite, json.data.reward);
        }else{
            this.tu.active = true;
        }

    }

});
