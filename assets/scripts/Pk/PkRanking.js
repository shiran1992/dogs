const Http = require('Http');
const DataUtil = require('DataUtil');
const Helper = require('Helper');

const MAX_LIMIT_STRING = 21;

cc.Class({
    extends: cc.Component,

    properties: {
        title: cc.Label,
        head: cc.Sprite,

        nick: cc.Label,
        score: cc.Label,

        num: cc.Label,
        head0: cc.Sprite,
        name0: cc.Label,
        right0: cc.Label,
        score0: cc.Label,
        list: cc.Node,

        itemPrefab: cc.Prefab, //题目选项

        chakan: cc.Node//查看奖励
    },

    ctor() {
        this._rank = [];
        this._self = null;
        this._first = null;

        this._pkRoom = null;
    },

    onLoad() {
        this.loadData();
    },

    loadData() {
        let stageId = DataUtil.getPkStageId();
        Http.getInstance().httpGet("pk/stage/" + stageId + "/rank", (json) => {
            cc.log("排行数据:", json);
            if (json && json.code == 0) {
                let data = json.data || {};
                this._self = data.currentUser || {};
                this._rank = data.pkRanks || [];

                this.managerData();
            }
        });
    },

    //处理数据
    managerData() {
        this._pkRoom = DataUtil.getPkRoom();

        this._rank.sort((a, b) => {
            return (+b.getScore) - (+a.getScore);
        });
        this._first = this._rank[0];//冠军
        this.initView();
    },

    initView() {
        this.node.runAction(cc.sequence(cc.delayTime(0.08), cc.scaleTo(0.1, 1.05)));

        let name = this._pkRoom.name || "";
        this.title.string = name.length > MAX_LIMIT_STRING ? (name.substr(0, MAX_LIMIT_STRING) + "...") : name;
        cc.log("排行榜数据：", this._rank);
        cc.log("冠军数据：", this._first);
        cc.log("当前用户数据：", this._self);
        if (this._first) {
            Helper.loadHttpImg(this.head, this._first.avatar);
            this.nick.string = this._first.cName;
            this.score.string = "答对" + this._first.totalRightNum + "题";
        }
        if (this._self) {
            Helper.loadHttpImg(this.head0, this._self.avatar);
            this.num.string = this._self.orderIndex ? this._self.orderIndex : "淘汰";
            this.name0.string = this._self.cName.length > 6 ? (this._self.cName.substr(0, 6) + "...") : this._self.cName;
            this.right0.string = this._self.totalRightNum + "题";
            this.score0.string = this._self.getScore;
        }
        for (let i = 0; i < this._rank.length; i++) {
            let item = cc.instantiate(this.itemPrefab);
            item.parent = this.list;
            let itemScript = item.getComponent('PkRankItem');
            itemScript.initView(this._rank[i]);
        }
    }
});
