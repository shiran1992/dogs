const DataUtil = require("DataUtil");

const MAX_LIMIT_STRING = 21;

cc.Class({
    extends: cc.Component,

    properties: {
        title: cc.Label,
        count: cc.Label,
        time: cc.Label,
        rule: cc.Prefab,
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

        this.count.string = this._pkRoom.pondQuestionCount || 0;
        this.time.string = this._pkRoom.singleSeconds || 0;
    },

    //查看奖励规则
    onClickRule() {
        let ruleNode = cc.instantiate(this.rule);
        this.node.addChild(ruleNode);
        let script = ruleNode.getComponent("PKRule");
        script.setData(this._pkRoom);
    }
});

