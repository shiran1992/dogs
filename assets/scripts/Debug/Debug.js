const Http = require('Http');
const Helper = require('Helper');
const DataUtil = require('DataUtil');

cc.Class({
    extends: cc.Component,

    properties: {
        submitBtn: cc.Button,
        textLabel: cc.Label,
        content: cc.Node,
    },

    onLoad() {
        let records = DataUtil.getRecords() || [];
        for (let i = 0; i < records.length; i++) {
            let node = new cc.Node();
            let label = node.addComponent(cc.Label);
            node.color = new cc.Color(0, 0, 0);
            label.string = "-----" + JSON.stringify(records[i]);
            label.fontSize = 20;
            node.parent = this.content;
            label.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
            node.width = 720;
        }
    },

    onClickBtn() {
        let obj = {
            stageId: DataUtil.getPkStageId(),
            records: DataUtil.getRecords() || []
        };
        Http.getInstance().httpPost("log", obj, { encryt: false }, (json) => {
            DataUtil.clearRecords();
            alert("感谢您的提交");
        });
    },

    onclickBack() {
        cc.director.loadScene("Home");
    }
});
