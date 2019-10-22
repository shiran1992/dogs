const DataUtil = require('DataUtil');

const MAX_LIMIT_STRING = 21;

cc.Class({
    extends: cc.Component,

    properties: {
        title: cc.Label,
    },

    ctor() {
        this._pkRoom = null;
    },

    setData(pkRoom = {}) {
        this._pkRoom = pkRoom;
        this.initView();
    },

    initView() {
        let name = this._pkRoom.name || "";
        this.title.string = name.length > MAX_LIMIT_STRING ? (name.substr(0, MAX_LIMIT_STRING) + "...") : name;
    },

    doDestroy() {
        this.node && this.node.destroy();
    },
});
