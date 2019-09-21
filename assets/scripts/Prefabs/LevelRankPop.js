let DataUtil = require("DataUtil");
let Helper = require("Helper");
let Http = require("Http");
cc.Class({
    extends: cc.Component,

    properties: {
        background: cc.Node,
        content: cc.Node,
        title: cc.Label,
        item: cc.Prefab,
        blankView: cc.Node,
        errorPop: cc.Prefab
    },

    onLoad() {
        this.initView();
        this.getData();
    },

    getData() {
        let curStage = DataUtil.getCurStage() || {};
        let stageId = curStage.stageId;
        this.title.string = this.titleStr;
        //海岛排行榜
        Http.getInstance().httpGet("gameStageRank/" + stageId, (json) => {
            DataUtil.switchLog && console.log('************gameStageRank', json);
            if (json.code == 0) {
                let arr = json.data || [];
                if (!arr.length) {
                    this.blankView.active = true;
                } else {
                    this.initView(arr);
                }
            } else {
                //错误处理
                let errorPop = cc.instantiate(this.errorPop);
                let errorPopScript = errorPop.getComponent('ErrorPop');
                errorPopScript.initView(json);
                errorPopScript.setCallBack(() => {
                    errorPop.destroy();
                    if (json.code != -1) {//本地断网只需要关闭弹窗
                        cc.director.loadScene('Home');
                    }
                });
                this.node.parent.addChild(errorPop);
            }
        });
    },

    initView(arr = []) {
        this.background.height = cc.winSize.height - 300;
        for (let i = 0; i < arr.length; i++) {
            let item = cc.instantiate(this.item);
            this.content.addChild(item);
            let itemScript = item.getComponent('IRankItem');
            itemScript.initView(arr[i]);
        }
    },

    setTitle(title) {
        this.titleStr = title;
    },

    onClose() {
        Helper.playButtonMusic();
        this.node.destroy();
        cc.director.loadScene('Stage');

    }
});
