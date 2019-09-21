const Helper = require('Helper');
const PkDataUtil = require('PkDataUtil');
const DataUtil = require('DataUtil');

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    //点击提交
    onClickSubmit() {
        //排行榜是1
        PkDataUtil.setWhoInPkGameDesc(1);
        Helper.playButtonMusic();
        let content =  this.node.parent;
        let view =  content.parent;
        let ScrollView =  view.parent;
        let PkRanking =  ScrollView.parent;
        PkRanking.active = false;
        let base =  PkRanking.parent;
        let gameDesc = base.getChildByName("GameDesc");
        gameDesc.active = true;
        let gameDescScript = gameDesc.getComponent('GameDesc');
        gameDescScript.initView(true);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
