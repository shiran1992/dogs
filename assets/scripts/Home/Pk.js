const Http = require('Http');
const Helper = require('Helper');
const DataUtil = require('DataUtil');
const PkDataUtil = require('PkDataUtil');
const Debugger = require('Debugger');

cc.Class({
    extends: cc.Component,

    properties: {
        mashan: cc.Node, //马上
        join: cc.Node, //加入等待
        banner: cc.Node,//旗帜
        barPrefab: cc.Prefab,//进度条
        barContain: cc.Node, //盛放进度条的容器
        centerView: cc.Node, //盛放题目的容器
        questionPrefab: cc.Prefab, //问题组建
        iBPrefab: cc.Prefab, //图片预览
        gameResultPrefab: cc.Prefab, //闯关结果
        loadingPrefab: cc.Prefab, //加载题库loading
        rightView: cc.Node, //右上角显示容器
        curLabel: cc.Label, //右上角当前第几题
        allLabel: cc.Label, //右上角一共多少题
        musicNode: cc.Node, //右上角音乐
        scrollView: cc.ScrollView,
        content: cc.Node,
        dijitiPrefab: cc.Prefab,
        spectator: cc.Node,//观众模式节点
        title: cc.Node,//题目标题
        errorPop: cc.Prefab,
        pkRank: cc.Node, //排行榜
        AllDead: cc.Node, //全军覆灭
        GameDesc: cc.Node,//比赛说明
        PkGameScroll: cc.ScrollView,//排行榜
        btnBack: cc.Node, //头部返回按钮
        over: cc.Node,//比赛结束节点
        day: cc.Node,//三天节点
        tongji: cc.Node,//正在统计答题数据
        jijiang: cc.Node,//即将进入节点   ---- 指向dieout
        Chengong: cc.Node,//成功页面
        wubairen: cc.Node,//500人页面
        guanzhangBack: cc.Node, //观战返回按钮
        tuichuguanzhang: cc.Node, //是否退出观战模式
        joinSanMiao: cc.Node,// 三秒倒计时页面
        SocketErrorPop: cc.Node,//socket异常
        dijiti: cc.Node,//第几题
        lastQuestion: cc.Node,   // 最后一题
        dieOut: cc.Node,          // 淘汰了

        isExitWebim: false,     // 是否退出，主动关闭时环信断线不弹出错误提示
    },

    onLoad: function () {
        this.isExitWebim = false;
        var that = this;
        var msgLock = true;
        var array = [];

        Debugger.setMessageCB(function (message) {
            array.push(message);
        }, this);
        Debugger.setRequestCB(function (key, value) {
            if (key == "stagePrepare") {
                this.onStagePrepare(value);
            }
        }, this);

        // 重置缓存数据
        PkDataUtil.setIsDati(false);
        PkDataUtil.setFlag(false);
        PkDataUtil.setAllDie(false);
        DataUtil.setIsSpectator(false);

        //1.获取用户进入等待页面的信息
        this.getUserPrepareInfo();
        let message = {};
        //this.showRank(message);

        //this.schedule(this.updateData,10);  

        this.questions = []; //所有题目
        this.curIndex = 0; //当前第几题
        this.curQuestion = ''; //当前答题的实例
        this.curBar = ''; //当前进度条实例
        this.curDijiti = ''; //当前第几题
        this.curShowerrorOffline = '';//当前掉线提示

        cc.director.setDisplayStats(false);
        var conn = {};
        WebIM.config = WebImConfig;
        conn = WebIM.conn = new WebIM.connection({
            isHttpDNS: WebIM.config.isHttpDNS,
            isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
            https: WebIM.config.https,
            url: WebIM.config.xmppURL,
            isAutoLogin: true,
            heartBeatWait: WebIM.config.heartBeatWait,
            autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
            autoReconnectInterval: WebIM.config.autoReconnectInterval,
            isStropheLog: WebIM.config.isStropheLog,
            delivery: WebIM.config.delivery
        })

        conn.listen({
            onOpened: function (message) {          //连接成功回调
                cc.log("###############################onOpened:", message);
                // 如果isAutoLogin设置为false，那么必须手动设置上线，否则无法收消息
                // 手动上线指的是调用conn.setPresence(); 如果conn初始化时已将isAutoLogin设置为true
                // 则无需调用conn.setPresence();    
                let json = DataUtil.getPrepareDate();
                var chatRoomId = json.data.chatRoomId;

                // WebIM.conn.joinChatRoom({
                //     roomId: chatRoomId, // 聊天室id
                //     success: function (m) {
                //         cc.log("##########################joinChatRoom m:"+m);

                //     },
                //     error: function(){
                //         cc.log("##########################joinChatRoom error:");
                //     }
                // });

                // 不知道跟online有什么区别， 先加上判断
                if (that.SocketErrorPop) {
                    that.SocketErrorPop.active = false;
                }
            },
            onClosed: function (message) {
                cc.log("###############################onClosed:", message);
            },         //连接关闭回调
            onTextMessage: function (message) {
                let now = new Date();
                cc.log("##############接收TXT消息客户端时间：" + now + " msg:", message);

                Debugger.recordMessage(message);
                array.push(message);


            },    //收到文本消息
            onEmojiMessage: function (message) { },   //收到表情消息
            onPictureMessage: function (message) { }, //收到图片消息
            onCmdMessage: function (message) { },     //收到命令消息
            onAudioMessage: function (message) { },   //收到音频消息
            onLocationMessage: function (message) { },//收到位置消息
            onFileMessage: function (message) { },    //收到文件消息
            onVideoMessage: function (message) {
                var node = document.getElementById('privateVideo');
                var option = {
                    url: message.url,
                    headers: {
                        'Accept': 'audio/mp4'
                    },
                    onFileDownloadComplete: function (response) {
                        var objectURL = WebIM.utils.parseDownloadResponse.call(conn, response);
                        node.src = objectURL;
                    },
                    onFileDownloadError: function () {
                        cc.log('File down load error.')
                    }
                };
                WebIM.utils.download.call(conn, option);
            },   //收到视频消息
            onPresence: function (message) {
                cc.log("#########################onPresence:", message);
            },       //处理“广播”或“发布-订阅”消息，如联系人订阅请求、处理群组、聊天室被踢解散等消息
            onRoster: function (message) {
                cc.log("#########################onRoster:", message);

            },         //处理好友申请
            onInviteMessage: function (message) {
                cc.log("#########################onInviteMessage:", message);

            },  //处理群组邀请
            onOnline: function () {
                PkDataUtil.setErshicijishu(0);

                cc.log("#########################oLine curShowerrorOffline:" + that.curShowerrorOffline);
                if (that.SocketErrorPop) {
                    // 先清空消息队列
                    array = [];
                    that.SocketErrorPop.active = false;
                }
            },                  //本机网络连接成功
            onOffline: function () {
                if (!that.isExitWebim) {
                    // 先清空消息队列
                    array = [];
                    let obj = { 'code': -1, 'message': '本机网络掉线' }
                    that.showerrorToHome(obj);
                    cc.log("#########################本机网络掉线offline:");
                }
                else {
                    cc.log("#########################环信下线");
                }
            },                 //本机网络掉线
            onError: function (message) {
                let obj = { 'code': -1, 'message': '本机网络掉线' }
                cc.log("#########################onErr:", message);
                if (message.type == 31) {
                    return;
                }
                if (message.type == 7) {
                    PkDataUtil.setErshicijishu(PkDataUtil.getErshicijishu() + 1);
                    if (PkDataUtil.getErshicijishu() >= 20) {
                        obj = { 'code': -1, 'message': "网络无法连接，请退出考试" }
                    } else {
                        obj = { 'code': -1, 'message': "正在重新连接" }
                    }
                }
                if (message.type == 8) {
                    obj = { 'code': -1, 'message': "您的账号在其他地方登录" }
                }

                // 先清空消息队列
                array = [];
                that.showerrorToHome(obj);
                //}
            },          //失败回调
            onBlacklistUpdate: function (list) {       //黑名单变动
                // 查询黑名单，将好友拉黑，将好友从黑名单移除都会回调这个函数，list则是黑名单现有的所有好友信息
                console.log(list);
            },
            onReceivedMessage: function (message) {
                cc.log("#########################onReceivedMessage:", message);

            },    //收到消息送达服务器回执
            onDeliveredMessage: function (message) {
                cc.log("#########################onDeliveredMessage:", message);

            },   //收到消息送达客户端回执
            onReadMessage: function (message) {
                cc.log("#########################onReadMessage:", message);

            },        //收到消息已读回执
            onCreateGroup: function (message) { },        //创建群组成功回执（需调用createGroupNew）
            onMutedMessage: function (message) { }        //如果用户在A群组被禁言，在A群发消息会走这个回调并且消息不会传递给群其它成员
        });

        this.timer = setInterval(() => {
            if (PkDataUtil.getAllDie()) {
                if (this.tongji) {
                    this.tongji.active = false;
                }
                let danqianbar = PkDataUtil.getCurBar();
                if (danqianbar) {
                    danqianbar.active = false;
                    danqianbar.destroy();
                }
                this.closeYouTi();
            }

            //try{
            var msg_ = array.shift();
            if (msg_) {
                let pkStage = DataUtil.getPkStage();
                if (pkStage) {
                    let pkStageId = pkStage.stageId;
                    if (pkStageId == msg_.ext.stageId) {
                        cc.log("###处理消息:", msg_);
                        //if (!PkDataUtil.getAllDie()) {
                        that.handleMessage(msg_);
                        //}
                    }
                }
            }
            //}catch(e){
            //    cc.log("failur :"+e);
            //}

        }, 800);

    },

    onDestroy() {
        Debugger.setRequestCB(null, null);
        Debugger.setMessageCB(null, null);
    },

    webImStart() {


    },
    updateData: function () {
        //let isJoin = DataUtil.getIsJoin();
        // let isJoin = true;
        // if (isJoin) {
        let json = {
            "id": "584913865251227672",
            "type": "chatroom",
            "from": "admin",
            "to": "77962956308481",
            "data": {
                "id": "5871a0a0-625b-4d85-b91d-ce949dc05e6b", "items": [
                    { "content": "大、小车运行起动和制动时", "id": "ba2ef91e-a9ce-4ec9-a406-38db32c66adb", "isAnswer": 0, "orderIndex": 1 },
                    { "content": "大、小车运行起动和制动时，可以快速从零扳到第五档或从第五档扳回零位零零扳到第五档或从", "id": "9c158237-df8c-4ecf-9fbc-3e978884202a", "isAnswer": 1, "orderIndex": 2 }],
                "orderIndex": 0,
                "title": "大、小车运行起动和制动时，可以快速从零扳到第五档或从第五档扳回零位。",
                "type": 2
            },
            "error": false,
            "errorText": "",
            "errorCode": ""
        };

        if (this.curQuestion) {
            this.curQuestion.destroy();
        }
        if (this.curBar) {
            this.curBar.destroy();
        }

        this.showDijiti("第一题", json.data);

        cc.log("########################定时发送消息:" + new Date());
        // }
    },
    //显示错误提示,返回首页
    showerrorToHome(json) {
        if (!this.SocketErrorPop.active) {
            // 清空消息
            this.array = [];

            this.SocketErrorPop.active = true;
            let socketErrorPopScript = this.SocketErrorPop.getComponent('PkSocketErrorPop');
            socketErrorPopScript.initView(json);
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

    // 准备数据回调 
    onStagePrepare(json) {
        cc.log("####################################json:", json);

        //增加错误界面提示
        if (typeof (json) == 'undefined' || json.code != 0) {
            let errorPop = cc.instantiate(this.errorPop);
            let errorPopScript = errorPop.getComponent('ErrorPop');
            errorPopScript.initView(json);
            errorPopScript.setCallBack(() => {
                errorPop.destroy();
                if (typeof (json) == 'undefined' || json.code != -1) {//本地断网只需要关闭弹窗
                    if (DataUtil.getChatRoomId()) {
                        WebIM.conn.quitChatRoom({
                            roomId: DataUtil.getChatRoomId(), // 聊天室id
                            success: function (m) {
                                cc.log("##########################joinChatRoom m:" + m);
                            },
                            error: function () {
                                cc.log("##########################joinChatRoom error:");
                            }
                        });
                        DataUtil.setChatRoomId(null);
                    }

                    if (!WebIM.conn.isClosed()) {
                        WebIM.conn.close();
                    }
                    DataUtil.setPkStage(null);
                    cc.director.loadScene('Home');
                }
            });
            this.node.addChild(errorPop);
        }
        else {
            let ps = { stageId: json.data.id, gameName: json.data.name, gameStageNum: 1, orderIndex: 0 };
            DataUtil.setPkStage(ps);

            //保存数据
            DataUtil.setPrepareDate(json);
            DataUtil.setChatRoomId(json.data.chatRoomId);

            //如果参加人数大于500人，显示500人页面
            //选择进入哪个页面
            this.selectpage(json);
            //String    聊天室Id
            var chatRoomId = json.data.chatRoomId;
        

            //  String  环信用户名
            let hxUserName = json.data.hxUserName;
            //  String  环信密码
            let hxPassword = json.data.hxPassword;

            var options = {
                apiUrl: WebIM.config.apiURL,
                user: hxUserName,
                pwd: hxPassword,
                appKey: WebIM.config.appkey,
                success: function (token) {
                    cc.log("##########################login token:", token);
                },
                error: function () {
                    cc.log("##########################login error:");
                }
            };

            WebIM.conn.open(options);

            var handlePresence = function (e) {
                cc.log("##########################joinChatRoom back:", e);
            };
        }
    },

    //获取用户进入等待页面的信息
    getUserPrepareInfo() {

        let stageId = null;
        //从首页传过来的某个题库信息
        let pkStage = DataUtil.getPkStage();
        if (pkStage) {
            stageId = pkStage.stageId;
        } else {
            cc.log("getQueryString.stageId:" + this.getQueryString('stageId'));
            if (this.getQueryString('stageId')) {
                stageId = this.getQueryString('stageId');
            }
        }

        //动态获取域名
        let that = this;
        cc.loader.loadRes("DomainConfig.json", (err, data) => {
            if (data && data.domain) {
                Helper.setDomain(data.domain);
                Helper.setDomain2(data.domain2);

                Http.getInstance().httpGet("pk/stage/" + stageId + "/prepare", (json) => {
                    that.onStagePrepare(json)
                });
            }
        });
    },
    showWubairen() {

        this.wubairen.active = true;
        let wubairenScript = this.wubairen.getComponent('Wubairen');
        wubairenScript.initView();
    },
    //选择进入哪个页面
    selectpage(json) {
        // String  pk赛ID
        let id = json.data.id;
        // String  PK赛名称
        let name = json.data.name;

        // Integer 试题数
        let pondQuestionCount = json.data.pondQuestionCount;
        // Ingeger 单题时间限制
        let singleSeconds = json.data.singleSeconds;
        //Long    当前系统时间
        let systemTime = json.data.systemTime;
        // Long    比赛开始时间
        let startTime = json.data.startTime;
        // String  奖励说明
        //let reward = json.reward;

        //String    聊天室Id
        //let chatRoomId = json.chatRoomId;
        //  String  环信用户名
        //let hxUserName = json.hxUserName;
        //  String  环信密码
        //let hxPassword = json.hxPassword;

        //  Integer 等待用户数
        let waitUserCount = json.data.waitUserCount;
        //  Integer 比赛人数
        let userCount = json.data.userCount;
        //  Integer 通过人数
        let passedUserCount = json.data.passedUserCount;
        //  Integer 当前用户排名,为0表示没有排名
        let currentUserRank = json.data.currentUserRank;
        //  Integer 答对题数
        let rightAnswer = json.data.rightAnswer;

        // Integer 游戏状态0:未开始1:进行中,2已结束
        let gameStatus = json.data.gameStatus;
        //0:未开始根据倒计时，进入哪个页面
        if (gameStatus == 0) {
            this.webImStart();
            let santianmiao = 259200;
            //游戏开始时间-服务器当前时间
            PkDataUtil.initDifferTime(systemTime, startTime);
            let diffTime = PkDataUtil.getDifferTime();

            //如果小于三天，马山开始页面
            if (diffTime < santianmiao) {
                let ma = this.mashan;
                ma.active = true;
                let t = ma.getChildByName("title").getComponent(cc.Label);
                t.string = name;
                if (name.length >= 22) {
                    t.string = name.substr(0, 21) + "...";
                } else {
                    t.string = name;
                }
                let l = ma.getChildByName("pondQuestionCount").getComponent(cc.Label);
                l.string = pondQuestionCount;
                let m = ma.getChildByName("meiTiCount").getComponent(cc.Label);
                m.string = singleSeconds;
                let lai = ma.getChildByName("laizhang").getComponent(cc.Label);
                lai.string = waitUserCount + "人等你来战";
            }
            //如果小于等于0，到等待页面
            //if (diffTime <= 0) {
            //    this.showJion();
            //}
            ////如果大于三天，到三天后开始页面
            if (diffTime > santianmiao) {
                this.showDay(json);
            }
        }
        //到观战者模式-马上开始页
        if (gameStatus == 1) {

            DataUtil.setIsSpectator(true);

            let ma = this.mashan;
            ma.active = true;
            let t = ma.getChildByName("title").getComponent(cc.Label);
            if (name.length >= 22) {
                t.string = name.substr(0, 21) + "...";
            } else {
                t.string = name;
            }
            let l = ma.getChildByName("pondQuestionCount").getComponent(cc.Label);
            l.string = pondQuestionCount;
            let m = ma.getChildByName("meiTiCount").getComponent(cc.Label);
            m.string = singleSeconds;
            let lai = ma.getChildByName("laizhang").getComponent(cc.Label);
            lai.string = waitUserCount + "人等你来战";
        }
        //到结束页面
        if (gameStatus == 2) {
            this.showOver(json);
        }
    },


    //处理接收消息  
    handleMessage(message) {
        this.btnBack.active = true;
        cc.log("##########################handleMessage:", message);
        let type = message.ext.msgType;

        //消息类型(0, "试题信息") 
        if (parseInt(type, 10) == 0) {
            this.btnBack.active = false;

            if (this.jijiang.active) {
                this.jijiang.active = false;
            }
            cc.log("##########################message.ext.消息:" + type);
            let curQuestion = PkDataUtil.getCurQuestion();
            if (curQuestion) {
                curQuestion.destroy();
            }
            let data = JSON.parse(message.data);
            let json = DataUtil.getPrepareDate();
            let str = "第" + data.orderIndex + "题";
            if (data.orderIndex == json.data.pondQuestionCount) {
                //str = "最后一题";
                // 最后一题用动画表示
                str = "";
            }
            //关闭旗帜
            this.banner.active = false;
            let now = new Date();
            let nowInMilliSeconds = now.getTime();
            //第一题要展示三秒
            if (data.orderIndex == 1) {
                PkDataUtil.setCurtimudaodaTime(nowInMilliSeconds + 1000 * 3);
                //关闭加入页
                if (this.join.active) {
                    this.join.active = false;
                }
                //关闭标题
                this.title.active = false;
                this.joinSanMiao.active = true;
                let joinSanMiaoScript = this.joinSanMiao.getComponent('joinSanMiao');
                joinSanMiaoScript.showDate(str, data);
            } else {
                PkDataUtil.setCurtimudaodaTime(nowInMilliSeconds);
                this.showDijiti(str, data);

                if (data.orderIndex == json.data.pondQuestionCount) {
                    this.lastQuestion.active = true;
                    this.lastQuestion.setLocalZOrder(1);
                    this.lastQuestion.runAction(cc.sequence(cc.delayTime(1), cc.hide()));
                }
            }

        }
        //(1,"答题统计信息")
        if (parseInt(type, 10) == 1) {
            this.btnBack.active = false;

            if (this.tongji && this.tongji.active) {
                this.tongji.active = false;
            }
            cc.log("##########################message.ext.答题统计信息:" + type);
            //判断是否是当前关卡
            //let pkStage = DataUtil.getPkStage();
            //pkStage.stageId
            //全军覆没，不处理消息 
            //if (!PkDataUtil.getAllDie()) {
            this.statisticMessageDo(message);
            //}
        }
        // (2,"排行榜信息") 
        if (parseInt(type, 10) == 2) {
            this.btnBack.active = false;

            if (this.dijiti.active) {
                this.dijiti.active = false;
            }
            if (this.tongji.active) {
                this.tongji.active = false;
            }

            if (this.jijiang.active) {
                this.jijiang.active = false;
            }
            if (this.spectator.active) {
                this.spectator.active = false;
            }

            cc.log("##########################message.ext.排行榜信息:" + type);
            //关掉当前题目                
            let curQuestion = PkDataUtil.getCurQuestion();
            if (curQuestion) {
                curQuestion.destroy();
            }
            this.showRank(message);

        }
        // (3,"全军覆没)
        if (parseInt(type, 10) == 3) {
            this.btnBack.active = false;

            cc.log("##########################message.ext.全军覆没:" + type);

            this.centerView.active = false;
            this.dijiti.active = false;
            this.tongji.active = false;
            this.jijiang.active = false;

            PkDataUtil.setAllDie(true);
            this.allDead(message.data);
            this.jijiang.active = false;
        }
    },
    //显示排行榜
    showRank(message) {
        this.tongji.active = false;
        this.rightView.active = false;
        //显示成功页面，两秒执行排行榜
        //#####################################################################################################显示成功页面，两秒执行排行榜
        this.Chengong.active = true;
        this.Chengong.runAction(cc.sequence(cc.fadeOut(5), cc.callFunc(() => {
            //开启排行榜
            let pkStage = DataUtil.getPkStage();
            Http.getInstance().httpGet("pk/stage/" + pkStage.stageId + "/rank", (json) => {
                cc.log("####################################rank:", json);
                //增加错误界面提示
                if (json.code != 0) {
                    let errorPop = cc.instantiate(this.errorPop);
                    let errorPopScript = errorPop.getComponent('ErrorPop');
                    errorPopScript.initView(json);
                    errorPopScript.setCallBack(() => {
                        errorPop.destroy();
                        if (json.code != -1) {//本地断网只需要关闭弹窗
                            if (DataUtil.getChatRoomId()) {
                                WebIM.conn.quitChatRoom({
                                    roomId: DataUtil.getChatRoomId(), // 聊天室id
                                    success: function (m) {
                                        cc.log("##########################joinChatRoom m:" + m);
                                    },
                                    error: function () {
                                        cc.log("##########################joinChatRoom error:");
                                    }
                                });
                                DataUtil.setChatRoomId(null);
                            }
                            if (!WebIM.conn.isClosed()) {
                                WebIM.conn.close();
                            }
                            DataUtil.setPkStage(null);
                            cc.director.loadScene('Home');
                        }
                    });
                    this.node.addChild(errorPop);
                }

                if (json) {
                    this.pkRank.active = true;
                    let PkRanking = this.pkRank.getComponent('PkRanking');
                    PkRanking.initView(json.data);
                }
            });
        })));
    },
    //等待页面
    showJion() {
        //等待页面
        this.join.active = true;
        let joinScript = this.join.getComponent('join');
        joinScript.initView();
    },
    //比赛说明
    showGameDesc(message) {
        //关闭标题
        this.GameDesc.active = true;
        let pkRanking = this.pkRank.getComponent('PkRanking');
        let json = DataUtil.getPrepareDate();

        pkRanking.init(json);
    },
    //比赛结束
    showOver(data) {
        //关闭标题
        this.over.active = true;
        let pkOver = this.over.getComponent('PkOver');
        pkOver.initView(data);

    },
    //等待三天
    showDay(data) {
        //关闭标题
        this.title.active = true;
        this.day.active = true;
        let pkSanTian = this.day.getComponent('PkSanTian');
        pkSanTian.initView(data);

    },

    //全军覆没
    allDead(data) {
        this.tongji.active = false;
        this.btnBack.active = true;
        cc.log("全军覆没消息:", data);
        this.AllDead.active = true;
        let allDeadScript = this.AllDead.getComponent('AllDead');
        allDeadScript.initView(data);

    },
    //展示第几题
    showDijiti(str, q) {

        this.tongji.active = false;
        this.day.active = false;

        PkDataUtil.setPkQuestion(q);
        if (this.curDijiti) {
            this.curDijiti.destroy();
        }
        //关闭三秒页
        if (this.joinSanMiao.active) {
            this.joinSanMiao.active = false;
        }
        //关闭加入页
        if (this.join.active) {
            this.join.active = false;
        }
        //关闭标题
        this.title.active = false;

        let dijiti = cc.instantiate(this.dijitiPrefab);
        this.node.addChild(dijiti);
        let d = dijiti.getComponent(cc.Label);
        d.string = str;

        dijiti.y += (cc.winSize.height / 2 - 600);
        dijiti.active = true;
        this.curDijiti = dijiti;
        //顺序执行，渐隐效果，执行回调
        dijiti.runAction(cc.sequence(cc.fadeOut(1), cc.callFunc(() => {
            //设置开始游戏时间
            DataUtil.setStartGameTime(new Date().getTime());
            this.questions = q;
            if (this.questions) {
                this.initView(q);
            }
        })));

    },
    //初始化界面
    initView(questionObj) {


        this.rightView.active = true;
        //当前第几题
        this.curLabel.string = questionObj.orderIndex;
        let json = DataUtil.getPrepareDate();
        //总共题数
        this.allLabel.string = "/" + json.data.pondQuestionCount;

        //如果是观众模式，则显示图标########################################################################################
        //答题总数
        let datijishu = DataUtil.getDatijishu();

        let join = PkDataUtil.getJoin();

        //答错题数
        let cuoti = DataUtil.getCuotijishu();
        let errorTime = parseInt(join.data.errorTimes);
        //进行中的游戏，也要进入观众模式
        let gameStatus = json.data.gameStatus;

        if (gameStatus == 1) {
            //关闭旗帜
            this.banner.active = false;
            this.spectator.active = true;
            PkDataUtil.setIsDati(true);
            DataUtil.setIsSpectator(true);

        } else if (cuoti == errorTime) {
            //关闭旗帜
            this.banner.active = false;
            this.spectator.active = true;
            PkDataUtil.setIsDati(true);
            // 点击错误马上回调处理了OnAnswerError
            /*if ((questionObj.orderIndex != json.data.pondQuestionCount) && !DataUtil.getIsSpectator()) {
                //this.jijiang.active = true;
                //this.jijiang.runAction(cc.sequence(cc.fadeOut(5),cc.callFunc(()=>{
                //})));
                // 2s启动淘态动画, 答错了会显示2s时间,显示2s
                this.dieOut.active = true;
                this.dieOut.runAction( cc.sequence(cc.delayTime(4.0), cc.fadeOut(0.5)) );
            }
            */
            this.dieOut.runAction(cc.fadeOut(0.5));
            DataUtil.setIsSpectator(true);

        }
        //如果是观众模式，则显示图标########################################################################################

        //显示第几题
        if (!DataUtil.getIsSpectator()) {
            this.dijiti.active = true;
            let dijitiLable = this.dijiti.getComponent(cc.Label);
            dijitiLable.string = "第" + questionObj.orderIndex + "题";
        } else {
            this.dijiti.active = false;
        }
        //创建进度条
        let bar = cc.instantiate(this.barPrefab);
        this.node.addChild(bar);
        bar.setLocalZOrder(2);
        bar.y += (cc.winSize.height / 2 - 200);
        this.curBar = bar;
        PkDataUtil.setCurBar(bar);

        //创建问题
        let question = cc.instantiate(this.questionPrefab);
        this.content.addChild(question);
        let questionScript = question.getComponent('pkQuestion');
        questionScript.setAnwserErrorCb(this.OnAnwserError, this);
        questionScript.initView(questionObj);
        this.curQuestion = question;
        PkDataUtil.setCurQuestion(question);

    },
    // 回答错误处理
    OnAnwserError() {
        let join = PkDataUtil.getJoin();
        //答错题数
        let cuoti = DataUtil.getCuotijishu();
        let errorTime = parseInt(join.data.errorTimes);
        if (cuoti >= errorTime) {
            // 延迟2s显示
            this.node.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(this.showDieOut, this)));
            //this.dieOut.runAction( cc.sequence(cc.delayTime(4.0), cc.fadeOut(0.5)) );
        }
    },
    showDieOut() {
        this.showSpectatorMsg("您已被淘汰\n即将进入观众模式", 1.5);
    },
    showSpectatorMsg(msg, stay) {
        this.dieOut.active = true;
        if (typeof (msg) != "undefined") {
            let label_ = this.getComponentInChildren(cc.Label);
            if (null != label_) {
                label_.string = msg;
            }
        }

        if (typeof (stay) != 'undefined' && stay > 0) {
            this.dieOut.runAction(cc.sequence(cc.delayTime(stay), cc.fadeOut(0.5)));
        }
    },

    //统计消息处理
    statisticMessageDo(msg) {
        let json = DataUtil.getPrepareDate();

        //观战者模式处理
        let userData = DataUtil.getUserData();
        if (userData) {
            let userId = userData.userId;
            let users = msg.ext.weedOutList
            cc.log("#####################users:", users);
            cc.log("##################### users.length:" + users.length);

            // if (users) {
            //     for (let i = 0; i < users.length; i++) {
            //         if (userId == users[i]) {
            //             if ((parseInt(this.curLabel.string, 10) == (json.data.pondQuestionCount-1)) && !DataUtil.getIsSpectator()) {
            //                 this.jijiang.active = true;
            //             }
            //             DataUtil.setIsSpectator(true);
            //         }
            //     }
            // }

        }
        let data = JSON.parse(msg.data);
        let questionId = data.questionId;
        let itemStatList = data.itemStatList;
        try {
            if (this.curQuestion) {
                let questionScript = this.curQuestion.getComponent('pkQuestion');
                questionScript.statisticMessageDo(itemStatList);
            }
        } catch (e) {
            cc.log("failur :", e);
        }

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
                        if (DataUtil.getChatRoomId()) {
                            WebIM.conn.quitChatRoom({
                                roomId: DataUtil.getChatRoomId(), // 聊天室id
                                success: function (m) {
                                    cc.log("##########################joinChatRoom m:" + m);
                                },
                                error: function () {
                                    cc.log("##########################joinChatRoom error:");
                                }
                            });
                            DataUtil.setChatRoomId(null);
                        }
                        if (!WebIM.conn.isClosed()) {
                            WebIM.conn.close();
                        }
                        DataUtil.setPkStage(null);
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
            //第一次闯关成功
            if (passed == 0) {
                //第一次闯关及成功
                if (num == 1) {
                    allBrain += 100;
                    allGold = 20;
                }
                allScore = (2 * questions.length * singleSeconds - (allTime / 1000)) / num;
                allPoint = curSubStage.point || 0;
            }

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

    //点击返回
    onClickBack() {
        Helper.playButtonMusic();
        //如查已经进入加入页后返回，则为观众状态
        if (DataUtil.getIsJoin()) {
            DataUtil.setIsSpectator(true);
        }
        if (DataUtil.getChatRoomId()) {
            WebIM.conn.quitChatRoom({
                roomId: DataUtil.getChatRoomId(), // 聊天室id
                success: function (m) {
                    cc.log("##########################joinChatRoom m:" + m);
                },
                error: function () {
                    cc.log("##########################joinChatRoom error:");
                }
            });
            DataUtil.setChatRoomId(null);
        }
        if (!WebIM.conn.isClosed()) {
            WebIM.conn.close();
        }
        DataUtil.setPkStage(null);
        cc.director.loadScene('Home', () => { });
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
        this.curBar.getComponent("PkProgressBar").stopAllActions();
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

    //关闭返回按钮
    closeBtnBack() {
        this.btnBack.active = false;
    },
    //关闭返回按钮
    onBtnBack() {
        this.btnBack.active = true;
    },
    //开启统计
    onTongji() {
        this.tongji.active = true;
    },
    //观战返回按钮
    gaunzhangBtnBack() {
        //this.tuichuguanzhang.active = true;
        // 2019/08/13 22：30 观战返回直接退出
        this.tuichuguanzhangYes();
    },
    //确定退出观战
    tuichuguanzhangYes() {
        this.isExitWebim = true;
        Helper.playButtonMusic();
        if (DataUtil.getChatRoomId()) {
            WebIM.conn.quitChatRoom({
                roomId: DataUtil.getChatRoomId(), // 聊天室id
                success: function (m) {
                    cc.log("##########################joinChatRoom m:" + m);
                },
                error: function () {
                    cc.log("##########################joinChatRoom error:");
                }
            });
            DataUtil.setChatRoomId(null);
        }
        if (!WebIM.conn.isClosed()) {
            WebIM.conn.close();
        }
        DataUtil.setPkStage(null);
        cc.director.loadScene('Home', () => { });
    },
    //取消退出观战
    tuichuguanzhangNo() {
        Helper.playButtonMusic();
        this.tuichuguanzhang.active = false;
    },
    //退出比赛
    socketErrorBack() {
        Helper.playButtonMusic();
        if (DataUtil.getChatRoomId()) {
            WebIM.conn.quitChatRoom({
                roomId: DataUtil.getChatRoomId(), // 聊天室id
                success: function (m) {
                    cc.log("##########################joinChatRoom m:" + m);
                },
                error: function () {
                    cc.log("##########################joinChatRoom error:");
                }
            });
            DataUtil.setChatRoomId(null);
        }
        if (!WebIM.conn.isClosed()) {
            WebIM.conn.close();
        }
        DataUtil.setPkStage(null);
        cc.director.loadScene('Home', () => { });
    },
    //关闭旗帜，左上角返回按钮，右题数
    closeQfy() {
        this.banner.active = false;
        this.btnBack.active = false;
        if (this.rightView) {
            this.rightView.active = false;
        }
    },
    //关闭右题数
    closeYouTi() {
        if (this.rightView) {
            this.rightView.active = false;
        }
    },
    //开启右题数
    startYouTi() {
        if (this.rightView) {
            this.rightView.active = true;
        }
    },
    //关闭右上角音乐
    closeMusic() {
        if (this.musicNode) {
            this.musicNode.active = false;
        }
    },
    //开启右上角音乐
    startMusic() {
        if (this.musicNode) {
            this.musicNode.active = true;
        }
    },

});

