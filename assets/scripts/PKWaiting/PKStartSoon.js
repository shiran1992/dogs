const DataUtil = require("DataUtil");

const MAX_LIMIT_STRING = 21;

cc.Class({
    extends: cc.Component,

    properties: {
        title: cc.Label,
        count: cc.Label,
        time: cc.Label,
        wait: cc.Label,
        rule: cc.Prefab,
    },

    ctor() {
        this._pkRoom = null;
        this._callback = null;
    },

    setData(pkRoom = {}) {
        this._pkRoom = pkRoom;
        this.initView();
    },

    setCallback(callback) {
        this._callback = callback;
    },

    initView() {
        let name = this._pkRoom.name || "";
        this.title.string = name.length > MAX_LIMIT_STRING ? (name.substr(0, MAX_LIMIT_STRING) + "...") : name;

        this.wait.string = this._pkRoom.waitUserCount + "人等你来战";
        this.count.string = this._pkRoom.pondQuestionCount || 0;
        this.time.string = this._pkRoom.singleSeconds || 0;
    },

    //查看奖励规则
    onClickRule() {
        let ruleNode = cc.instantiate(this.rule);
        this.node.addChild(ruleNode);
        let script = ruleNode.getComponent("PKRule");
        script.setData(this._pkRoom);
    },

    //点击马上开始
    onClickStart() {
        DataUtil.setRecords({eName: "点击马上开始", time: new Date(), data: null});
        this._callback && this._callback();
    },
});
