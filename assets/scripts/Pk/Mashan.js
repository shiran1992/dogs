const Http = require('Http');
const Helper = require('Helper');
const DataUtil = require('DataUtil');
const PkDataUtil = require('PkDataUtil');

cc.Class({
    extends: cc.Component,

    properties: {
        pondQuestionCount: cc.Node,
        meiTiCount: cc.Node,
        laizhang: cc.Node,
        title: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        let pkScript = cc.find('Canvas').getComponent('Pk');
        pkScript.closeYouTi();
        pkScript.startMusic();
    },


});
