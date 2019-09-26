const Http = require('Http');
const DataUtil = require("DataUtil");
const Helper = require("Helper");
const WebIMManager = require("WebIMManager");

const MAX_LIMIT_NUM = 500;//限制最多五百人

cc.Class({
    extends: cc.Component,

    properties: {
        maxLimit: cc.Prefab,//最多500人
        startSoon: cc.Prefab,//马上开始
        startAfter: cc.Prefab,//以后开始
        pkReady: cc.Prefab,//准备页
        pkOver: cc.Prefab,//比赛已经结束

        outPrefab: cc.Prefab,//淘汰
        inAudiencePrefab: cc.Prefab,//即将进入观众模式
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
            this.loadPKStatus();
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
            cc.log("JSON:", json);
            if (json && json.code == 0) {
                let data = json.data || {};
                DataUtil.setPkRoom(data);
                this._pkRoom = data;

                let userCount = data.userCount || 0; //当前进来多少人
                if (userCount > MAX_LIMIT_NUM) { //超出500人
                    this.renderMaxLimitView();
                    return;
                }

                //初始化
                WebIMManager.initWebIM((message) => { this.onReceive(message); });
                this.startWebIM();

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
                        this.renderReadyView();
                    }
                } else if (gameStatus == 1) {//比赛已经开始
                    this.renderDoingView();
                } else if (gameStatus == 2) {//比赛已经结束
                    this.renderOverView();
                }
            }
        });
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
        this.node.removeChildByTag("SOON_NODE");
        this.renderReadyView();
    },

    //比赛已经开始，到等待界面(这个时候有可能PK已经开始了，但是管理员没有发题)
    renderReadyView() {
        let readyNode = cc.instantiate(this.pkReady);
        this.node.addChild(readyNode);
        this.scriptReady = readyNode.getComponent("PKReady");
        this.scriptReady.setData(this._pkRoom);
    },

    //比赛正在进行
    renderDoingView() {
        cc.director.preloadScene("PKGame", function () {
            cc.log('预加载答题场景已完成');
        });
        Http.getInstance().httpGet("pk/stage/" + this.stageId + "/join", (json) => {
            cc.log("比赛正在进行：", json);
            if (json && json.code == 0) {
                let data = json.data || {};
                DataUtil.setPkJoin(data);
                this._pkJoin = data;

                let userStatusType = data.userStatusType;//用户参与状态（0正常参加;1之前未参加过.目前正在进行中.直接进观战;2之前参加过,目前正在进行中,且超过了错误次数）
                if (userStatusType == 0) {//正常参加Pk,------------------------------------------------------------------------------不知道当前正在答得是第几题
                    //初始化
                    WebIMManager.initWebIM();
                    this.startWebIM(() => {
                        cc.director.loadScene("PKGame");
                    });
                } else if (userStatusType == 1 || userStatusType == 2) {//1之前未参加过.目前正在进行中.直接进观战;2之前参加过,目前正在进行中,且超过了错误次数
                    DataUtil.setModel(1);
                    let outPop = cc.instantiate(this.outPrefab);
                    this.node.addChild(outPop);
                    let outScript = outPop.getComponent("PkOutPop");
                    outScript.setCallback(() => {
                        cc.director.loadScene("PKGame");
                    });
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
    },

    /************************************点击事件**************************************/
    //点击返回
    onClickBack() {
        Helper.playButtonMusic();
        cc.director.loadScene("Home", () => {
            let pkRoom = DataUtil.getPkRoom();
            WebIM.conn && WebIM.conn.quitChatRoom({
                roomId: pkRoom.chatRoomId, // 聊天室id
                success: function (m) {
                    cc.log("##########################joinChatRoom m:" + m);
                },
                error: function () {
                    cc.log("##########################joinChatRoom error:");
                }
            });

            WebIM.conn.close();
        });
    },

    /************************************回调事件**************************************/
    //消息接受
    onReceive(message) {
        if (message && message.ext) {
            let ext = message.ext;
            if (ext.msgType == 4) {//0-试题信息   1-答题统计信息   2-排行榜信息   3-全进覆没   4-比赛开始   5-加入聊天室
                cc.log("开始答题：", message);
                //此时收到开始答题的通知，提前预加载下面答题页的场景数据
                cc.director.preloadScene("PKGame", function () {
                    cc.log('预加载答题场景已完成');
                });
                if (this.scriptReady) {
                    this.scriptReady.startAnimation(() => {
                        cc.director.loadScene("PKGame");
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

    //显示即将进入观众模式
    inAudienceModel() {
        this.audienceNode = cc.instantiate(this.inAudiencePrefab);
        this.node.addChild(this.audienceNode);
    },

    onDestroy() {
        this.timer && clearTimeout(this.timer);
    }
});
