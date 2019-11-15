const Http = require('Http');
const Helper = require('Helper');
const DataUtil = require('DataUtil');
cc.Class({
    extends: cc.Component,

    properties: {
        barPrefab: cc.Prefab,//进度条
        barContain: cc.Node, //盛放进度条的容器
        centerView: cc.Node, //盛放题目的容器
        questionPrefab: cc.Prefab, //问题组建
        iBPrefab: cc.Prefab, //图片预览
        gameResultPrefab: cc.Prefab, //闯关结果
        previewPrefab: cc.Prefab, //开题预览
        loadingPrefab: cc.Prefab, //加载题库loading
        rightView: cc.Node, //右上角显示容器
        curLabel: cc.Label, //右上角当前第几题
        allLabel: cc.Label, //右上角一共多少题
        scrollView: cc.ScrollView,
        content: cc.Node,
        errorPop: cc.Prefab
    },

    ctor() {
        this.questions = []; //所有题目
        this.curIndex = 0; //当前第几题
        this.curQuestion = ''; //当前答题的实例
    },

    onLoad() {
        cc.director.setDisplayStats(false);
        this.getQuestions();
    },

    //获取闯关题目
    getQuestions() {
        //设置开始游戏时间
        DataUtil.setStartGameTime(new Date().getTime());
        DataUtil.switchLog && console.log('当前题目：', DataUtil.getQuestions());
        this.questions = DataUtil.getQuestions() || [];
        if (this.questions.length) {
            //题库里面有题目
            this.allLabel.string = '/' + this.questions.length;
            this.initPreview();
        }
    },

    //题目预览
    initPreview() {
        this.rightView.active = false;
        //如果进度条存在
        if (this.bar) {
            this.bar.getComponent("ProgressBar").doDestroy();
            this.bar = null;
        }
        let preview = cc.instantiate(this.previewPrefab);
        this.node.addChild(preview);
        let previewScript = preview.getComponent('PreviewQuestion');
        let obj = {
            index: this.curIndex
        };
        previewScript.initView(obj);
        previewScript.setCallBack(() => {
            let question = this.questions[this.curIndex] || {};
            question.index = this.curIndex;
            this.initView(question);
        });
    },

    //初始化界面
    initView(questionObj) {
        this.rightView.active = true;
        this.curLabel.string = this.curIndex + 1;
        //创建进度条
        this.bar = cc.instantiate(this.barPrefab);
        this.node.addChild(this.bar);
        this.bar.setLocalZOrder(2);
        this.bar.y += (cc.winSize.height / 2 - 200);
        //创建问题
        let question = cc.instantiate(this.questionPrefab);
        this.content.addChild(question);
        let questionScript = question.getComponent('Question');
        questionScript.initView(questionObj);
        this.curQuestion = question;
    },

    //下一题
    refreshQuestion() {
        if (this.bar) {
            this.bar.getComponent("ProgressBar").doDestroy();
            this.bar = null;
        }
        //已经到最后一题了
        if (this.curIndex >= (this.questions.length - 1)) {
            //设置游戏结束时间
            DataUtil.setEndGameTime(new Date().getTime());
            this.submitData(this.manageData());
            this.curQuestion.destroy();
            return;
        }
        this.curQuestion.destroy();
        this.curIndex++;
        this.scrollToTop();

        let question = this.questions[this.curIndex] || {};
        question.index = this.curIndex;
        this.initView(question);
    },

    //提交数据
    submitData(obj = {}) {
        DataUtil.switchLog && console.log('答题结束', obj);
        let curStage = DataUtil.getCurStage() || {};
        let curSubStage = DataUtil.getCurSubStage() || {};
        let stageId = curStage.stageId;
        let subStageId = curSubStage.subStageId;
        //保存答题结果
        let questionResult = {};
        questionResult.stageId = stageId;
        questionResult.subStageId = subStageId;
        questionResult.obj = obj;
        cc.sys.localStorage.setItem("questionResult", JSON.stringify(questionResult));
        Http.getInstance().httpPost("stage/" + stageId + "/submit/" + subStageId, obj, { encryt: true }, (json) => {
            if (json.code == 0) {
                cc.sys.localStorage.setItem("questionResult", '');
                let gameResult = cc.instantiate(this.gameResultPrefab);
                this.node.addChild(gameResult);
                this.gameResult = gameResult;
                let resultScript = gameResult.getComponent('stageResult');
                resultScript.setCallback(() => {
                    this.nextLevel();
                });
                let data = json.data || {};
                data.localData = obj;
                resultScript.setOverData(data);
                this.overData = data;
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
                this.node.addChild(errorPop);
            }
        });
    },

    //答题结束，进行结算
    manageData() {
        let curSubStage = DataUtil.getCurSubStage();
        let questions = DataUtil.getQuestions() || [];
        //本轮答题用时
        let singleSeconds = curSubStage.singleSeconds || 60;
        //第几次闯关
        let num = curSubStage.num;
        //之前是否通过
        let passed = curSubStage.passed;
        //答对多少题
        let correctCount = 0;
        //答错多少题
        let wrongCount = 0;
        //是否通关
        let isPass = 0;
        //总获得脑力值
        let allBrain = 0;
        //总获得金币
        let allGold = 0;
        //总获得得分
        let allScore = 0;
        //获得得分
        let allPoint = 0;
        //总二连击次数
        let allDouble = 0;
        //总三连击次数
        let allTriple = 0;
        //答题总用时
        let allTime = 0;
        for (let i = 0; i < questions.length; i++) {
            let question = questions[i] || {};
            let tag = question.tag || {};
            //答对了
            if (tag.state) {
                correctCount += 1;
                if (tag.brainValue == 15) {
                    allDouble += 1;
                } else if (tag.brainValue == 35) {
                    allTriple += 1;
                }
            } else {
                wrongCount += 1;
            }
            allBrain += tag.brainValue;
            let offTime = tag.offTime || 60;
            allTime += offTime;
        }
        if (correctCount >= parseInt(curSubStage.passStageNum, 10)) {
            isPass = 1;
            allGold = 5;
            //之前没有通过过
            if (passed == 0) {
                //第一次闯关及成功
                if (num == 1) {
                    allBrain += 100;
                    allGold = 20;
                }
                allScore = (2 * questions.length * singleSeconds - (allTime / 1000)) / num;
                allPoint = curSubStage.point || 0;
            }

            DataUtil.switchLog && console.log('questions.length:' + questions.length + '------------' + 'singleSeconds:' + singleSeconds + '------------' +
                'allTime:' + allTime + '----------' + 'num:' + num + '--------------' + 'allScore:' + allScore)
        } else {
            allBrain = 0;
            allScore = 0;
            allPoint = 0;
            allBrain = 0;
            allGold = 0;
        }

        return {
            isPass: isPass,
            num: num,
            startDate: DataUtil.getStartGameTime(),
            submitDate: DataUtil.getEndGameTime(),
            usedTime: allTime / 1000,
            correctQty: correctCount,
            errorQty: wrongCount,
            getScore: allScore,
            getBrainValue: allBrain,
            getPoint: allPoint,
            getGoldCoin: allGold,
            doubleHitCount: allDouble,
            tribleHitCount: allTriple,
            proType: 1,
            usedProNum: 0
        }
    },

    //下一关
    nextLevel() {
        if (this.overData) {
            let localData = this.overData.localData || {};
            let isPass = localData.isPass || 0;
            let curSubStage = DataUtil.getCurSubStage();
            //如果通过，那就进行下一关
            if (isPass) {
                let orderIndex = curSubStage.orderIndex;
                let allSubStage = DataUtil.getAllSubStage() || [];
                if (orderIndex + 1 < allSubStage.length) {
                    curSubStage = allSubStage[orderIndex + 1] || {};
                    DataUtil.setCurSubStage(curSubStage);
                } else {//大关卡已经闯到最后一关了
                    DataUtil.setCurSubStage({});
                    cc.director.loadScene('Stage');
                }
            }
        }
        let loading = cc.instantiate(this.loadingPrefab);
        this.node.addChild(loading);
        let scp = loading.getComponent("LoadingQuestion");
        scp.setCallback(() => {
            this.refreshQuestions();
            this.node.removeChild(this.gameResult);
            this.curIndex = 0;
            this.initPreview();
        });
    },

    //刷新题库
    refreshQuestions() {
        DataUtil.setStartGameTime(new Date().getTime());
        DataUtil.switchLog && console.log('当前题目：', DataUtil.getQuestions());
        this.questions = DataUtil.getQuestions() || [];
        if (this.questions.length) {
            //题库里面有题目
            this.allLabel.string = '/' + this.questions.length;
        }
    },

    //点击返回
    onClickBack() {
        Helper.playButtonMusic();
        cc.director.loadScene('Stage', () => { });
    },

    //显示图片预览
    showBigImage(url) {
        Helper.playButtonMusic();
        let iBrowser = cc.instantiate(this.iBPrefab);
        this.node.addChild(iBrowser);
        iBrowser.setLocalZOrder(1);
        let iBrowserScript = iBrowser.getComponent('ImageBrowser');
        iBrowserScript.initView(url);
    },

    //关闭图片预览
    hideBigImage() {
        //判断图片预览是否开启
        let iBrowser = this.node.getChildByName('ImageBrowser');
        if (iBrowser) {
            let iBrowserScript = iBrowser.getComponent('ImageBrowser');
            iBrowserScript.onClose();
        }
    },

    //停止进度条动画
    stopProgressBar() {
        this.bar.getComponent("ProgressBar").stopAllActions();
    },

    //将视图滑到最顶部
    scrollToTop() {
        this.scrollView.scrollToTop(0.001);
    },

    //将视图滑到最底部
    scrollToBottom() {
        if (this.content.height > this.centerView.height) {
            this.scrollView.scrollToBottom(0.001);
        }
    },
});
