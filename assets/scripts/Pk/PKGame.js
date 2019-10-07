const Helper = require('Helper');
const DataUtil = require('DataUtil');
const WebIMManager = require("WebIMManager");

cc.Class({
    extends: cc.Component,

    properties: {
        qNum: cc.Label,//第几题
        banner: cc.Node,//上面的旗子
        model: cc.Node,//模式
        numQuestion: cc.Prefab,//题目之前提示的第几题
        barPrefab: cc.Prefab,//进度条
        greyBarPrefab: cc.Prefab,//观众模式下的进度条
        barContain: cc.Node, //盛放进度条的容器
        managerData: cc.Node,//正在统计的字样
        centerView: cc.Node, //盛放题目的容器
        questionPrefab: cc.Prefab, //问题组件
        iBPrefab: cc.Prefab, //图片预览
        backBtn: cc.Node, //返回键
        closeBtn: cc.Node,//关闭键
        musicBtn: cc.Node,//音乐声音
        rightView: cc.Node, //右上角显示容器
        curLabel: cc.Label, //右上角当前第几题
        allLabel: cc.Label, //右上角一共多少题
        scrollView: cc.ScrollView,
        content: cc.Node,
        rankCon: cc.Node,//排行榜容器

        pkReady: cc.Prefab,//准备页
        waitQuestion: cc.Prefab,//等待管理员下发题目
        resultPopPrefab: cc.Prefab, //选择答案之后的结果框（对/错）
        outPrefab: cc.Prefab,//淘汰
        allDeadPrefab: cc.Prefab,//全军覆没
        outAudiencePrefab: cc.Prefab,//退出观众模式
        successPrefab: cc.Prefab,//闯关成功
        rankPrefab: cc.Prefab,//排行榜
    },

    ctor() {
        this.message = null;
        this.question = null;//题目内容
        this.result = null;//数据统计结果
        this.rank = null;//排行榜数据
        this._pkRoom = null;
        this.questionScript = null;//题目的脚本

        this.questionOrder = 1;//进来的第一题的编号
    },

    onLoad() {
        //隐藏返回键
        this.backBtn.active = false;
        this.musicBtn.active = false;

        this._pkRoom = DataUtil.getPkRoom();
        DataUtil.clearErrQuestions();
        DataUtil.setLastQuestion(false);

        let joinStatus = DataUtil.getJoinStatus();//进入答题页的方式
        if (joinStatus == 1 || joinStatus == 2) {//已经被淘汰了
            DataUtil.setModel(1);
            //因为这个时候进来，肯定是要等待下一题的
            this.qNum.node.active = false;
            this.banner.active = true;
            this.rightView.active = false;
            this.waitQuestionNode = cc.instantiate(this.waitQuestion);
            this.node.addChild(this.waitQuestionNode);
            //显示淘汰界面
            let outPop = cc.instantiate(this.outPrefab);
            this.node.addChild(outPop);
            let outScript = outPop.getComponent("PkOutPop");
            outScript.initView(joinStatus);
            outPop.setLocalZOrder(100);
        } else if (joinStatus == 3) {//退出去又重新进来的
            this.qNum.node.active = false;
            this.banner.active = true;
            this.rightView.active = false;
            this.waitQuestionNode = cc.instantiate(this.waitQuestion);
            this.node.addChild(this.waitQuestionNode);
        } else {//正常进入答题页
            this.qNum.node.active = false;
            this.rightView.active = false;
            this.backBtn.active = true;
            this.musicBtn.active = true;
            this.banner.active = true;

            this.renderReadyView();
        }

        //初始化
        WebIMManager.initWebIM((message) => { this.onReceive(message); });
        this.startWebIM();
    },

    //比赛已经开始，到等待界面(这个时候有可能PK已经开始了，但是管理员没有发题)
    renderReadyView() {
        let readyNode = cc.instantiate(this.pkReady);
        this.node.addChild(readyNode);
        this.scriptReady = readyNode.getComponent("PKReady");
        this.scriptReady.setData(this._pkRoom);
    },

    //IM开始接受消息
    startWebIM(callback) {
        let pkRoom = DataUtil.getPkRoom();
        //环信用户名
        let hxUserName = pkRoom.hxUserName || "";
        //环信密码
        let hxPassword = pkRoom.hxPassword || "";
        let options = {
            apiUrl: WebIM.config.apiURL,
            user: hxUserName,
            pwd: hxPassword,
            appKey: WebIM.config.appkey,
            success: (token) => {
                cc.log("---------------success:", token);
                callback && callback();
            },
            error: () => {
                cc.log("##########################error:");
                //如果没连上环信，则继续连接，直到连上为止
                this.startWebIM();
            }
        };

        WebIM.conn.open(options);
    },

    //消息接受
    onReceive(message) {
        if (message && message.ext) {
            this.message = message || {};
            let ext = message.ext;
            //0-试题信息   1-答题统计信息   2-排行榜信息   3-全军覆没   4-比赛开始   5-加入聊天室
            if (ext.msgType == 0) {
                cc.log("试题：", message);
                this.question = JSON.parse(message.data);
                this.initView();
            } else if (ext.msgType == 1) {
                cc.log("统计试题：", message);
                this.result = message;
                this.showCountPerAction();
                this.renderPKResult();
            } else if (ext.msgType == 2) {
                cc.log("排行榜信息", message);
                this.rank = JSON.parse(message.data);
                this.renderRankView();
            } else if (ext.msgType == 3) {
                cc.log("全军覆没：", message);
                this.removeLastQuestion();
                this.backBtn.active = true;
                this.banner.active = true;
                this.qNum.node.active = false;
                this.allDeadNode = cc.instantiate(this.allDeadPrefab);
                this.node.addChild(this.allDeadNode);
                this.allDeadScript = this.allDeadNode.getComponent('AllDead');
                this.allDeadScript.setData(message.data);
                //判断是否是观众模式
                let model = DataUtil.getModel();
                if (model == 1) {
                    this.model.active = false;
                    //PK结束，还原成正常模式
                    this.revertData();
                }
            } else if (ext.msgType == 4) {
                cc.log("开始答题：", message);
                this.musicBtn.active = false;
                this.backBtn.active = false;
                if (this.scriptReady) {
                    this.scriptReady.startAnimation(() => {
                        this.scriptReady.doDestroy();
                        this.renderDisplayQuestion(1);
                    });
                }
            } else if (ext.msgType == 5) {
                //有新人加入聊天室
                if (this.scriptReady) {
                    this.scriptReady.addChatRoom({
                        avatar: ext.avatar,
                        cName: "",
                        userId: ext.userId
                    });
                }
            }
        }
    },

    //显示pk开始，发题中
    renderDisplayQuestion(num, callback, time = 0) {
        this.numQuestionNode = cc.instantiate(this.numQuestion);
        this.node.addChild(this.numQuestionNode);
        let text = "第" + num + "题";
        if (num == -1) {
            text = "最后一题";
        }
        let script = this.numQuestionNode.getComponent("NumQuestion");
        script.initView(text);
        time && callback && script.setCallback(callback, time);
    },

    //清除上一题的节点
    removeLastQuestion() {
        // this.node.removeChildByTag("RESULT_POP");
        this.managerData.active = false;
        this.qNum.node.active = false;
        this.rightView.active = false;
        //中途进入显示的等待发题存在
        if (this.waitQuestionNode) {
            this.waitQuestionNode.getComponent("WaitQuestion").doDestroy();
            this.waitQuestionNode = null;
        }
        //如果发提前的提示存在
        if (this.numQuestionNode) {
            this.numQuestionNode.getComponent("NumQuestion").doDestroy();
            this.numQuestionNode = null;
        }
        //如果题目存在
        if (this.questionNode) {
            this.questionNode.getComponent("pkQuestion").doDestroy();
            this.questionNode = null;
        }
        //如果进度条存在
        if (this.bar) {
            this.bar.getComponent("PkProgressBar").doDestroy();
            this.bar = null;
        }
        //灰色进度条
        if (this.greyBar) {
            this.greyBar.getComponent("GreyProgressBar").doDestroy();
            this.greyBar = null;
        }
        //即将进入观众模式的黑色边框
        if (this.audienceNode) {
            this.node.removeChild(this.audienceNode);
            this.audienceNode = null;
        }
    },

    //初始化界面
    initView() {
        if (this.question) {
            //清除之前的题目
            this.removeLastQuestion();
            //头部数据
            let index = this.question.orderIndex || 1;//当前第几题
            let allNum = this._pkRoom.pondQuestionCount || 10;//总题目数量
            //设置最后一题
            DataUtil.setLastQuestion(index == allNum);
            index = (index == allNum) ? -1 : index;

            //第一题提示已经提前展示出来了，所以不需要再去展示了，就等着第一题发题通知了
            if (index == 1) {
                this.renderQuestion();
            } else {
                this.curLabel.string = this.question.orderIndex || 1;
                this.renderDisplayQuestion(index, () => {
                    this.renderQuestion();
                }, 1000);
            }
        }
    },

    //渲染题目
    renderQuestion() {
        //如果发题前的提示存在
        if (this.numQuestionNode) {
            this.numQuestionNode.getComponent("NumQuestion").doDestroy();
            this.numQuestionNode = null;
        }
        let index = this.question.orderIndex || 1;//当前第几题
        let allNum = this._pkRoom.pondQuestionCount || 10;//总题目数量
        this.rightView.active = true;
        this.banner.active = false;
        this.qNum.node.active = true;
        this.qNum.string = "第 " + index + " 题"
        this.allLabel.string = "/" + allNum;

        //创建问题
        this.questionNode = cc.instantiate(this.questionPrefab);
        this.content.addChild(this.questionNode);
        this.questionScript = this.questionNode.getComponent('pkQuestion');
        this.questionScript.initView(this.question);

        let model = DataUtil.getModel();
        if (model == 0) {//正常答题模式
            //创建进度条
            this.bar = cc.instantiate(this.barPrefab);
            this.barContain.addChild(this.bar);
            this.bar.setLocalZOrder(2);
            let barScript = this.bar.getComponent("PkProgressBar");
            barScript.setEndCallback(() => { this.barTimeoutCallback(); });
        } else if (model == 1) {//观众模式
            this.backBtn.active = true;
            this.model.active = true;
            this.qNum.node.active = false;
            this.questionScript.setSelectable(false);

            //创建进度条
            this.greyBar = cc.instantiate(this.greyBarPrefab);
            this.barContain.addChild(this.greyBar);
            this.greyBar.setLocalZOrder(2);
            let barScript = this.greyBar.getComponent("GreyProgressBar");
            barScript.setEndCallback(() => {
                //隐藏进度条，显示统计数据字样
                this.greyBar.active = false;
                this.managerData.active = true;
                if (this.managerData) {
                    let script = this.managerData.getComponent("ManageDataAnimation");
                    script && script.startAnimation();
                }
            });
        }
    },

    //点击返回
    onClickBack() {
        Helper.playButtonMusic();
        let model = DataUtil.getModel();
        if (model == 1) {//观众模式下
            this.outAudienceModel();
        } else {
            this.onClickClose();
        }
    },

    //点击关闭
    onClickClose() {
        console.log("排行榜关闭按钮");
        cc.director.loadScene("Home", () => {
            let pkRoom = DataUtil.getPkRoom();
            WebIM.conn && WebIM.conn.quitChatRoom({
                roomId: pkRoom.chatRoomId, // 聊天室id
                success: function (m) {
                    WebIM.conn.close();
                    cc.log("##########################joinChatRoom m:" + m);
                },
                error: function () {
                    cc.log("##########################joinChatRoom error:");
                }
            });
        });
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

    //退出观众模式
    outAudienceModel() {
        this.outAudienceNode = cc.instantiate(this.outAudiencePrefab);
        this.node.addChild(this.outAudienceNode);
    },

    //数据统计的结果
    renderPKResult() {
        //判断是否是最后一题
        let isLast = DataUtil.getLastQuestion();
        let model = DataUtil.getModel();
        if (model == 0) {
            //关闭正确/错误弹窗之后，需要显示淘汰或者全军覆没，或者正常答下一题
            if (this.result) {
                let ext = this.result.ext || {};
                let outList = ext.weedOutList || [];
                //做延迟的目的是为了等进度条显示完之后，显示淘汰或者成功
                this.timer = setTimeout(() => {
                    //判断淘汰
                    let userId = this._pkRoom.userId;
                    for (let i = 0; i < outList.length; i++) {
                        //淘汰名单中有当前用户
                        if (outList[i] == userId) {
                            DataUtil.setModel(1);
                            let outPop = cc.instantiate(this.outPrefab);
                            this.node.addChild(outPop);
                            outPop.setLocalZOrder(100);
                            return;
                        }
                    }
                    if (isLast) {
                        this.removeLastQuestion();
                        this.model.active = false;
                        this.backBtn.active = false;
                        this.banner.active = true;
                        this.qNum.node.active = false;
                        this.rightView.active = false;
                        this.closeBtn.active = true;
                        if (!this.successNode) {
                            this.successNode = cc.instantiate(this.successPrefab);
                            this.node.addChild(this.successNode);
                            //比赛结束，还原数据
                            this.revertData();
                        }
                    }
                }, 1500);
            }
        } else if (model == 1) {
            if (isLast) {
                this.removeLastQuestion();
                this.model.active = false;
                this.backBtn.active = false;
                this.banner.active = true;
                this.qNum.node.active = false;
                this.rightView.active = false;
                this.closeBtn.active = true;
                if (!this.successNode) {
                    this.successNode = cc.instantiate(this.successPrefab);
                    this.node.addChild(this.successNode);
                    //比赛结束，还原数据
                    this.revertData();
                }
            }
        }
    },

    //显示排行榜
    renderRankView() {
        this.banner.active = false;
        //如果闯关成功界面存在
        if (this.successNode) {
            this.successNode.opacity = 0;
            this.successNode.getComponent("PKSuccess").doDestroy();
            this.successNode = null;
        }
        if (this.rank) {
            cc.log("排行：", this.rank);
            if (!this.rankNode) {
                this.rankNode = cc.instantiate(this.rankPrefab);
                this.rankCon.addChild(this.rankNode);
                this.centerView.active = false;
            }
        }
    },

    //进度条时间用完的回调
    barTimeoutCallback() {
        cc.log("时间用完了哦");
        let curQuestionResult = DataUtil.getQuestionResult();
        this.questionScript && this.questionScript.setSelectable(false);
        //说明之前答过题
        if (!curQuestionResult) {
            curQuestionResult = { type: 0, text: '哎呦~答错了' };
        }

        //答题正确/错误
        let resultPop = cc.instantiate(this.resultPopPrefab);
        this.node.addChild(resultPop);
        //gameNode.setTag("RESULT_POP");
        let resultPopScript = resultPop.getComponent('ResultPop');
        resultPopScript.initView(curQuestionResult);
        //播放声音
        if (curQuestionResult.type) {
            Helper.playRightMusic();
        } else {
            Helper.playErrorMusic();
        }
        resultPopScript.setCallback(() => {
            this.showDataManager();
        });

        //还原当前的数据
        DataUtil.setQuestionResult(null);
    },

    //显示数据统计状态
    showDataManager() {
        //隐藏进度条，显示统计数据字样
        this.bar.active = false;
        this.managerData.active = true;
        if (this.managerData) {
            let script = this.managerData.getComponent("ManageDataAnimation");
            script && script.startAnimation();
        }
        this.qNum.node.active = false;
    },

    //显示回答每个答案的进度条数量统计
    showCountPerAction() {
        let data = JSON.parse(this.result.data);
        this.questionScript && this.questionScript.showBarResult(data);
        if (this.managerData) {
            let script = this.managerData.getComponent("ManageDataAnimation");
            script && script.stopAnimation();
        }
    },

    //本局PK答题已经结束，需要将内存中数据进行还原
    revertData() {
        DataUtil.setModel(0);
        DataUtil.setJoinStatus(0);
        DataUtil.setLastQuestion(false);
        DataUtil.clearErrQuestions();
    },

    onDestroy() {
        this.timer && clearTimeout(this.timer);
    }
});
