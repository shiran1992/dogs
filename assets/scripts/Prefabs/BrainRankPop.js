const Http = require('Http');
const Helper = require('Helper');
let DataUtil = require("DataUtil");
cc.Class({
    extends: cc.Component,

    properties: {
        background: cc.Node,
        scrollView: cc.ScrollView,
        content: cc.Node,
        item: cc.Prefab,
        btnLeft: cc.Sprite,
        btnLeftText: cc.Label,
        btnRight: cc.Sprite,
        btnRightText: cc.Label,
        btnLeftFrames: [cc.SpriteFrame],
        btnRightFrames: [cc.SpriteFrame],
        curNum: cc.Label,
        curHead: cc.Sprite,
        curName: cc.Label,
        curBrain: cc.Label,
        errorPop: cc.Prefab
    },

    ctor() {
        //当前选中项
        this.curTab = 0;
    },

    onLoad() {
        this.getData();
    },

    //获取数据
    getData() {
        Http.getInstance().httpGet("gameBrainRank/" + this.curTab, (json) => {
            DataUtil.switchLog && console.log('************gameBrainRank', json);
            if (json.code == 0) {
                this.initView(json.data);
            } else {
                //错误处理
                let errorPop = cc.instantiate(this.errorPop);
                let errorPopScript = errorPop.getComponent('ErrorPop');
                errorPopScript.initView(json);
                errorPopScript.setCallBack(() => {
                    errorPop.destroy();
                    if (json.code != -1) {//本地断网只需要关闭弹窗
                        this.node.destroy();
                    }
                });
                this.node.parent.addChild(errorPop);
            }
        });
    },

    //渲染界面
    initView(json = {}) {
        this.curHead.node.active = true;
        let orderIndex = json.orderIndex;
        let avatar = json.avatar;
        let cName = json.cName;
        let brainValue = json.brainValue;
        let arr = json.gameBrainRank4Lists || [];
        this.background.height = cc.winSize.height - 380;
        for (let i = 0; i < arr.length; i++) {
            let item = cc.instantiate(this.item);
            this.content.addChild(item);
            let itemScript = item.getComponent('BRankItem');
            itemScript.initView(arr[i]);
        }
        this.curNum.string = parseInt(orderIndex, 10);
        Helper.loadHttpImg(this.curHead, avatar);
        this.curName.string = cName.length > 6 ? (cName.substr(0, 6) + "...") : cName;
        this.curBrain.string = brainValue;
    },

    //点击左、右按钮
    onClickTab(e, index) {
        Helper.playButtonMusic();
        if (index != this.curTab) {
            this.content.removeAllChildren();
            this.scrollView.scrollToTop();
            this.curTab = index;
            if (this.curTab == 0) {
                this.btnLeft.spriteFrame = this.btnLeftFrames[1];
                this.btnLeftText.node.color = new cc.color(234, 242, 189, 255);
                this.btnRight.spriteFrame = this.btnRightFrames[0];
                this.btnRightText.node.color = new cc.color(72, 127, 76, 255);
            } else {
                this.btnLeft.spriteFrame = this.btnLeftFrames[0];
                this.btnLeftText.node.color = new cc.color(72, 127, 76, 255);
                this.btnRight.spriteFrame = this.btnRightFrames[1];
                this.btnRightText.node.color = new cc.color(234, 242, 189, 255);
            }

            this.getData();
        }
    },

    //关闭弹窗
    onClose() {
        Helper.playButtonMusic();
        this.node.destroy();
    }
});
