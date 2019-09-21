const DataUtil = require("DataUtil");

const MAX_LIMIT_STRING = 17;

cc.Class({
    extends: cc.Component,

    properties: {
        title: cc.Label,//标题
    },

    ctor() {
        this._pkRoom = null;
    },

    onLoad() {
        this._pkRoom = DataUtil.getPkRoom();
        if (this._pkRoom) {
            this.initView();
        }
    },

    initView() {
        let name = this._pkRoom.name || "";
        this.title.string = name.length > MAX_LIMIT_STRING ? (name.substr(0, MAX_LIMIT_STRING) + "...") : name;
    }
});
