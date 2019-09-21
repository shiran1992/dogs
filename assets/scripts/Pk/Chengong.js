const DataUtil = require('DataUtil');

cc.Class({
    extends: cc.Component,

    properties: {
        title: cc.Node,//标题
        chengongzi: cc.Node
    },

    onLoad: function () {
        let prepare = DataUtil.getPrepareDate();
        let titleLable = this.title.getComponent(cc.Label);
        if (prepare.data.name.length >= 22) {
            titleLable.string = prepare.data.name.substr(0, 21)+"...";
        }else{
            titleLable.string = prepare.data.name;
        }

        let chengongziLable = this.chengongzi.getComponent(cc.Label);

        if (DataUtil.getIsSpectator()) {
            chengongziLable.string = '闯关结束!';
        }else{
            chengongziLable.string = '您已闯关成功!';
        }
    },

    initView(){



    },

});
