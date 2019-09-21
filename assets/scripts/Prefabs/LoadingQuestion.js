const Http = require('Http');
const DataUtil = require('DataUtil');
cc.Class({
    extends: cc.Component,

    properties: {
        barBg: cc.Sprite,
        progress: cc.ProgressBar,
        errorPop: cc.Prefab
    },

    ctor() {
        //未加载题库
        this.hasLoaded = false;
        this.callback = () => { };
    },

    onLoad() {
        let data = DataUtil.getUserData() || {};

        let head = this.node.getChildByName("head")
        let headIcon = head.getChildByName("headIcon").getComponent(cc.Sprite);
        require("Helper").loadHttpImg(headIcon, data.avatar);

        this.isPreLoadScene = false;
        this.progress.progress = 0;
        if (this.preSceneName) {
            cc.director.preloadScene(this.preSceneName, () => {
                this.isPreLoadScene = true;
            })
        }

        this.barBg.node.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(1, 0.9), cc.scaleTo(1, 1.01))));
        this.getQuestions();
    },

    setPreLoadScene(sceneName) {
        this.preSceneName = sceneName;
    },

    setCallback(callback) {
        this.callback = callback;
    },

    update(dt) {
        if (this.preSceneName) {
            if (this.isPreLoadScene && this.progress.progress > 0.85 && this.hasLoaded) {
                this.progress.progress += 0.02;
            } else {
                if (this.progress.progress < 0.3) {
                    this.progress.progress += 0.005;
                } else if (this.progress.progress < 0.85) {
                    this.progress.progress += 0.01;
                }
            }
        } else {
            if (this.progress.progress < 0.3) {
                this.progress.progress += 0.005;
            } else if (this.progress.progress < 0.85) {
                this.progress.progress += 0.01;
            } else {
                this.progress.progress += 0.02;
            }
        }

        if (this.isLoaded) { return; }

        if (this.progress.progress >= 1) {
            if (this.preSceneName) {
                this.isLoaded = true;
                cc.director.loadScene(this.preSceneName, () => { });
            } else {
                if(this.isGetData){
                    this.callback();
                    this.node.destroy();
                }
            }
        }
    },

    //获取题目
    getQuestions() {
        this.isGetData = false;
        let curStage = DataUtil.getCurStage() || {};
        let curSubStage = DataUtil.getCurSubStage() || {};
        DataUtil.switchLog && console.log('111111111curStage', curStage);
        DataUtil.switchLog && console.log('222222222curSubStage', curSubStage);
        let stageId = curStage.stageId;
        let subStageId = curSubStage.subStageId;
        if (stageId && subStageId) {
            Http.getInstance().httpGet("gameQuestionInfo/" + stageId + "/" + subStageId, (json = {}) => {
                if (json.code == 0) {
                    let data = json.data || {};
                    let list = data.gameQuestion4Lists || [];
                    DataUtil.setQuestions(list);
                    //答对几题过关
                    curSubStage.num = data.num;
                    curSubStage.passed = data.isPass;
                    DataUtil.setCurSubStage(curSubStage);
                    this.hasLoaded = true;
                    DataUtil.switchLog && console.log('************gameQuestionInfo', json);
                    this.isGetData = true;
                } else {
                    this.isGetData = false;
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
        } else {
            this.isGetData = true;
            this.hasLoaded = true;
            DataUtil.setQuestions([]);
        }
    }
});
