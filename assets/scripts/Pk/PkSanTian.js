cc.Class({
    extends: cc.Component,

    properties: {
        pondCount: cc.Node,//题数
        miaoCount: cc.Node,//秒数
        title: cc.Label,//标题
    },

    // use this for initialization
    onLoad: function () {

    },

    initView(prepare = {}) {
        let pkScript = cc.find('Canvas').getComponent('Pk');
        pkScript.closeYouTi();
        pkScript.startMusic();
        cc.log("###########################prepare:"+prepare);
        let titleLable = this.title.getComponent(cc.Label);
        if (prepare.data.name.length >= 22) {
            titleLable.string = prepare.data.name.substr(0, 21)+"...";
        }else{
            titleLable.string = prepare.data.name;
        }
        
        let pondCountLable = this.pondCount.getComponent(cc.Label);
        pondCountLable.string = prepare.data.pondQuestionCount;

        let miaoCountLable = this.miaoCount.getComponent(cc.Label);
        miaoCountLable.string = prepare.data.singleSeconds;

    },

});
