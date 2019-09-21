const DataUtil = require('DataUtil');

cc.Class({
    extends: cc.Component,

    properties: {
        title: cc.Node,//标题
    },

    onLoad: function () {

    },

    initView(){
        let prepare = DataUtil.getPrepareDate();
        let titleLable = this.title.getComponent(cc.Label);
        if (prepare.data.name.length >= 17) {
            titleLable.string = prepare.data.name.substr(0, 17)+"...";
        }else{
            titleLable.string = prepare.data.name;
        }
    },

});
