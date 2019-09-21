const DataUtil = require('DataUtil');

const MAX_LIMIT_STRING = 21;

cc.Class({
    extends: cc.Component,

    properties: {
        title: cc.Label,
        joinNum: cc.Label,//参赛人数
        passNum: cc.Label,//过关人数
        rightNum: cc.Label,//答对题数
        rankDesc: cc.Label,//获得名次
        pkRanking: cc.Prefab,//排行榜
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

        this.joinNum.string = this._pkRoom.userCount || 0;
        this.passNum.string = this._pkRoom.passedUserCount || 0;
        this.rightNum.string = this._pkRoom.rightAnswer || 0;
        if (this._pkRoom.currentUserRank) {
            this.rankDesc.string = "您获得第 " + this._pkRoom.currentUserRank + " 名";
        }
    },

    onClickRanking() {
        let rankNode = cc.instantiate(this.pkRanking);
        this.node.addChild(rankNode);
    }
});
