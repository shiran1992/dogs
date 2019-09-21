const DataUtil = require('DataUtil');

const MAX_LIMIT_STRING = 21;

cc.Class({
    extends: cc.Component,

    properties: {
        title: cc.Label,//标题
        joinNum: cc.Label,//参加人数
        passNum: cc.Label,//通过人数
        outNum: cc.Label,//淘汰人数
    },

    ctor() {
        this._pkRoom = null;
    },

    setData(obj = "") {
        this._pkRoom = DataUtil.getPkRoom();;
        this.initView(obj);
    },

    initView(obj) {
        let name = this._pkRoom.name || "";
        this.title.string = name.length > MAX_LIMIT_STRING ? (name.substr(0, MAX_LIMIT_STRING) + "...") : name;

        obj = JSON.parse(obj);
        this.joinNum.string = obj.onlineNum || 0;
        this.passNum.string = obj.participantsNum || 0;
        this.outNum.string = obj.weedOutNum || 0;
    },

    doDestroy() {
        this.node.destroy();
    }
});
