const Http = require('Http');
const DataUtil = require("DataUtil");
const Helper = require("Helper");

const MAX_LIMIT_NUM = 500;//限制最多五百人

cc.Class({
    extends: cc.Component,

    properties: {
        maxLimit: cc.Prefab,//最多500人
        startSoon: cc.Prefab,//马上开始
        startAfter: cc.Prefab,//以后开始
        pkOver: cc.Prefab,//比赛已经结束
        pkAllOver: cc.Prefab,//查看排行榜，但是是全军覆没的
        pkRanking: cc.Prefab,//排行榜
        homeLoading: cc.Prefab,//加载home页loading
        errorPop: cc.Prefab,

        rankCon: cc.Node,//排行榜容器
    },

    ctor() {
        this.stageId = "";//PK关卡的Id
        this._pkRoom = null;//pk房间数据
    },

    onLoad() {
        //获取Home页点击Item数据
        this.stageId = DataUtil.getPkStageId();

        //获取浏览器url参数
        let page = this.getQueryString('page');
        let id = this.getQueryString('stageId');
        if (!this.stageId && page == 'PKWaiting') {
            DataUtil.setRecords({ eName: "扫描二维码进入的", time: new Date(), data: { url: window.location.search.substr(1) } });
            if (id) {
                this.stageId = id;
                DataUtil.setPkStageId(id);
                //动态获取域名
                cc.loader.loadRes("DomainConfig.json", (err, data) => {
                    if (data && data.domain) {
                        Helper.setDomain(data.domain);
                        this.loadPKStatus();
                    }
                });
            } else {
                cc.director.loadScene('Home');
            }
        } else {
            DataUtil.setRecords({ eName: "正常进入的", time: new Date(), data: null });
            this.loadPKStatus();
        }

        Helper.loadErrorPop();

        //清理内存数据
        DataUtil.setModel(0);
        DataUtil.setJoinStatus(0);
        DataUtil.setLastQuestion(false);
        DataUtil.clearErrQuestions();
        //保证app中不息屏
        if (window.isApp) {
            window.yxt.ui.message.post({
                param: {
                    name: 'keepLight'
                },
                onSuccess: () => {
                },
                onFail: () => {
                }
            })
        }
    },

    getQueryString(name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        let r = window.location.search.substr(1).match(reg);
        if (r) {
            return unescape(r[2]);
        }
        return null;
    },

    //获取PK擂台的状态
    loadPKStatus() {
        Http.getInstance().httpGet("pk/stage/" + this.stageId + "/prepare", (json) => {
            cc.log("JSON11111:", json);
            DataUtil.setRecords({ eName: "拿到prepare接口数据", time: new Date(), data: json });
            if (json && json.code == 0) {
                let data = json.data || {};
                DataUtil.setPkRoom(data);
                this._pkRoom = data;

                let userCount = data.userCount || 0; //当前进来多少人
                if (userCount > MAX_LIMIT_NUM) { //超出500人
                    this.renderMaxLimitView();
                    return;
                }

                let gameStatus = data.gameStatus; //游戏状态0:未开始   1:进行中    2已结束
                let systemTime = data.systemTime; //服务器当前系统时间
                let startTime = data.startTime; //服务器指定的比赛开始时间
                if (gameStatus == 0) {//PK还没有开始
                    let offTime = startTime - systemTime;
                    if (offTime > 0) {
                        if (offTime > 1000 * 60 * 60 * 24 * 3) {//大于三天
                            this.renderAfterView();
                        } else {//小于三天
                            this.renderSoonView();
                        }
                    } else {//比赛时间已经到，到等待界面
                        DataUtil.setJoinStatus(0);
                        cc.director.loadScene("PKGame");
                    }
                } else if (gameStatus == 1) {//比赛已经开始
                    this.renderDoingView();
                } else if (gameStatus == 2) {//比赛已经结束
                    this.renderOverView();
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
                this.node.addChild(errorPop);
            }
        });
    },

    //加载人数超出500页面
    renderMaxLimitView() {
        let maxLimitNode = cc.instantiate(this.maxLimit);
        this.node.addChild(maxLimitNode);
    },

    //显示三天后的PK信息
    renderAfterView() {
        let afterNode = cc.instantiate(this.startAfter);
        this.node.addChild(afterNode);
        let script = afterNode.getComponent("PKStartAfter");
        script.setData(this._pkRoom);
    },

    //显示三天内的PK信息
    renderSoonView() {
        let soonNode = cc.instantiate(this.startSoon);
        soonNode.setTag("SOON_NODE");
        this.node.addChild(soonNode);
        let script = soonNode.getComponent("PKStartSoon");
        script.setData(this._pkRoom);
        script.setCallback(() => { this.onClickStarQuick(); });
    },

    //----------马上开始
    onClickStarQuick() {
        Http.getInstance().httpGet("pk/stage/" + this.stageId + "/join", (json) => {
            if (json && json.code == 0) {
                let data = json.data || {};
                DataUtil.setPkJoin(data);
                this._pkJoin = data;

                let userStatusType = data.userStatusType;//用户参与状态（0正常参加;1之前未参加过.目前正在进行中.直接进观战;2之前参加过,目前正在进行中,且超过了错误次数）
                if (userStatusType == 0) {//正常参加Pk
                    this.node.removeChildByTag("SOON_NODE");
                    DataUtil.setJoinStatus(0);
                    cc.director.loadScene("PKGame");
                } else if (userStatusType == 1 || userStatusType == 2) {
                    //1之前未参加过.目前正在进行中.直接进观战;2之前参加过,目前正在进行中,且超过了错误次数
                    DataUtil.setJoinStatus(userStatusType);
                    cc.director.loadScene("PKGame");
                }
            } else {
                cc.loader.loadRes("ErrorPop", function (err, prefab) {
                    let errorPop = cc.instantiate(prefab);
                    errorPop.setTag("ERROR");
                    let errorPopScript = errorPop.getComponent('ErrorPop');
                    errorPopScript.initView(json);
                    errorPopScript.setCallBack(() => {
                        errorPop.destroy();
                        if (json.code != -1) {//本地断网只需要关闭弹窗
                            cc.director.loadScene('Home');
                        }
                    });
                    let node = cc.find("Canvas");
                    node.addChild(errorPop);
                });
            }
        });
    },

    //比赛正在进行
    renderDoingView() {
        cc.director.preloadScene("PKGame", function () {
            cc.log('预加载答题场景已完成');
        });
        Http.getInstance().httpGet("pk/stage/" + this.stageId + "/join", (json) => {
            cc.log("比赛正在进行：", json);
            DataUtil.setRecords({ eName: "比赛正在进行，需要拿一下join接口数据", time: new Date(), data: json });
            if (json && json.code == 0) {
                let data = json.data || {};
                DataUtil.setPkJoin(data);
                this._pkJoin = data;

                let userStatusType = data.userStatusType;//用户参与状态（0正常参加;1之前未参加过.目前正在进行中.直接进观战;2之前参加过,目前正在进行中,且超过了错误次数）
                if (userStatusType == 0) {//正常参加Pk
                    DataUtil.setJoinStatus(3);
                    cc.director.loadScene("PKGame");
                } else if (userStatusType == 1 || userStatusType == 2) {
                    //1之前未参加过.目前正在进行中.直接进观战;2之前参加过,目前正在进行中,且超过了错误次数
                    DataUtil.setJoinStatus(userStatusType);
                    cc.director.loadScene("PKGame");
                }
            }
        });
    },

    //比赛已经结束
    renderOverView() {
        let overNode = cc.instantiate(this.pkOver);
        this.node.addChild(overNode);
        let script = overNode.getComponent("PkOver");
        script.setData(this._pkRoom);
        script.setCallBack(() => {
            this.showRankList();
            script.doDestroy();
        });
    },

    /************************************点击事件**************************************/
    //查看获奖人员
    showRankList() {
        Http.getInstance().httpGet("pk/stage/" + this.stageId + "/rank", (json) => {
            cc.log("排行数据:", json);
            if (json && json.code == 0) {
                let data = json.data || {};
                let list = data.pkRanks || [];
                if (list.length) {
                    let rankNode = cc.instantiate(this.pkRanking);
                    this.rankCon.addChild(rankNode);
                } else {
                    let allOverNode = cc.instantiate(this.pkAllOver);
                    this.node.addChild(allOverNode);
                    let script = allOverNode.getComponent("PkAllOver");
                    script.setData(this._pkRoom);
                }
            }
        });
    },

    //点击返回
    onClickBack() {
        Helper.playButtonMusic();
        let loadingPre = cc.instantiate(this.homeLoading);
        let scp = loadingPre.getComponent("HomeLoading");
        scp.setPreLoadScene("Home");
        loadingPre.parent = this.node;
    },

    onDestroy() {
        this.timer && clearTimeout(this.timer);
    }
});
