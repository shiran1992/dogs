const Http = require('Http');
const Helper = require('Helper');
const DataUtil = require('DataUtil');

cc.Class({
    extends: cc.Component,

    properties: {
        submitBtn: cc.Button,
        textLabel: cc.Label
    },

    onLoad() {
        this.textLabel.string = "dfhdfbsdjfsbndjfnsdjfnsdjfnsdjdjdjnfffj当局东方酒店房间内的附加功能的附加功能的附加功能"
    },

    onClickBtn() {
        alert("点击提交");
    },

    onclickBack() {
        cc.director.loadScene("Home");
    }
});
