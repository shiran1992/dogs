const DataUtil = require("DataUtil");
const Helper = require("Helper");

cc.Class({
    extends: cc.Component,

    properties: {
        defNode: cc.Node,
        awardIcon: cc.Sprite,

        _pkRoom: null,
    },

    setData(pkRoom = {}) {
        this._pkRoom = pkRoom;
        this.initView();
    },

    initView() {
        let reward = this._pkRoom.reward || "";
        this.defNode.active = !reward;
        this.awardIcon.node.active = !!reward;
        //***************如果不按照尺寸上传奖励图片，则需要对图片进行裁剪***************/
        reward && Helper.loadHttpImg(this.awardIcon, reward, {type: 'limit', width: 650});
    },

    //点击关闭
    onCloseUI() {
        this.node.destroy();
    }
});
