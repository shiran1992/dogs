const Helper = require('Helper');
const PkDataUtil = require('PkDataUtil');

cc.Class({
    extends: cc.Component,

    properties: {

    },


    //点击提交
    onClickSubmit() {
        Helper.playButtonMusic();
        let desc =  this.node.parent;
        let base =  desc.parent;
        let whoInPkGameDesc = PkDataUtil.getWhoInPkGameDesc();
        //1为排行榜
        if (whoInPkGameDesc == 1) {
            let pkRanking = base.getChildByName("PkRanking");
            pkRanking.active = true;
        }
        //2为马上进入
        if (whoInPkGameDesc == 2) {
            let prepare = base.getChildByName("Prepare");
            let mashan = prepare.getChildByName("mashan");
            mashan.active = true;
        }

        desc.active = false;

    }

});
