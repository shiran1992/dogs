const DataUtil = require("DataUtil");

const MAX_LIMIT_STRING = 21;

cc.Class({
    extends: cc.Component,

    properties: {
        title: cc.Label,
        desc: cc.Label,
    },

    ctor() {
        this._pkRoom = null;
    },

    onLoad() {
        this._pkRoom = DataUtil.getPkRoom();

        this.initView();
    },

    initView() {
        let model = DataUtil.getModel();
        //观众模式
        if (model == 1) {
            this.desc.string = "闯关结束";
        }
        let name = this._pkRoom.name || "";
        this.title.string = name.length > MAX_LIMIT_STRING ? (name.substr(0, MAX_LIMIT_STRING) + "...") : name;
    },
});
