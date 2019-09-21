const Http = require('Http');
const Helper = require('Helper');
const DataUtil = require('DataUtil');
const PkDataUtil = require('PkDataUtil');
const Debuger = require("Debugger");

cc.Class({
    extends: cc.Component,

    properties: {
        title: cc.Node,
        renshu: cc.Node,
        renlist: cc.Node,//等待人员列表
        headPrefab: cc.Prefab, //实例人员头像
        errorPop: cc.Prefab,

        shi1shu: cc.Node,
        shi2shu: cc.Node,
        fen1shu: cc.Node,
        fen2shu: cc.Node,
        miao1shu: cc.Node,
        miao2shu: cc.Node,

        denguanli: cc.Node,//等待发题
        daojishi: cc.Node, //倒计时面
        Jijiang: cc.Node, //观众等待页面
        sanmiao: cc.Node, //三秒倒计时

        // 定时器id
        timerid : 0,
    }, 

    onLoad: function () {
//        cc.sys.openURL('https://www.baidu.com');
        //计算器清零
        this.timerid = 0;
        DataUtil.setIsJoin(true);
        
        let pkStage = DataUtil.getPkStage();
        console.log("#######################join pkStage:"+JSON.stringify(pkStage));

        Http.getInstance().httpGet("pk/stage/" + pkStage.stageId + "/join", (json) => {
            //增加错误界面提示
            if(json.code != 0){
                if (json.message == '已超过游戏最大人数限制.') {
                    let pkScript = cc.find('Canvas').getComponent('Pk');
                    pkScript.showWubairen();
                }else{
                    let errorPop = cc.instantiate(this.errorPop);
                    let errorPopScript = errorPop.getComponent('ErrorPop');
                    errorPopScript.initView(json);
                    errorPopScript.setCallBack(() => {
                        errorPop.destroy();
                        if (json.code != -1) {//本地断网只需要关闭弹窗
                            if (DataUtil.getChatRoomId()) {
                                WebIM.conn.quitChatRoom({
                                    roomId:  DataUtil.getChatRoomId(), // 聊天室id
                                    success: function (m) {
                                        cc.log("##########################joinChatRoom m:"+m);
                                    },
                                    error: function(){
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
            }
            if(json.code == 0){
                this.selectPage(json);
            }
         });

         // 切换到前台
         cc.game.on(  cc.game.EVENT_SHOW, this.onGameShow, this);
    },

    onDestroy()
    {
        cc.game.off( cc.game.EVENT_SHOW, this.onGameShow, this );
    },

    onGameShow(event)
    {
        Debuger.log("###on event show: calc diff time");
        PkDataUtil.calcDifferTime();
    },

    initView()
    {
        if(!DataUtil.getIsSpectator()){
            if ( this.timerid == 0 )
            {
                this.timerid = this.schedule(this.updateData, 1);  
            }

            // 先立即执行一次
            this.updateData();
         }
         else
         {
            this.daojishi.active = false;
         }
    },

    selectPage(json){
        let pkScript = cc.find('Canvas').getComponent('Pk');

        PkDataUtil.setJoin(json);
        PkDataUtil.setJoinData(json);

        //systemTime	Long	当前系统时间
        //Long    当前系统时间
        let systemTime = json.data.systemTime;
        // Long    比赛开始时间
        let startTime = json.data.startTime;
        PkDataUtil.initDifferTime( systemTime, startTime );
        let differTime = PkDataUtil.getDifferTime();

        //如果已经结束,则显示结束页面 
        if (json.data.gameStatus == 2) {
            let prepare = DataUtil.getPrepareDate();
            pkScript.showOver(prepare);
        //如果游戏已经进行中，则进入观战等待页面
        }else if(json.data.gameStatus == 1){
            this.daojishi.active = false;
            //this.Jijiang.active = true;
            pkScript.showSpectatorMsg( "您已错过比赛\n即将进入观众模式");

            //设置观众模式
            DataUtil.setIsSpectator(true);
            //关闭上面的显示
            pkScript.closeQfy();
        //如果游戏未开始，则进入等待管理员下发题目
        }else{
            this.daojishi.active = true;
            this.denguanli.active = false;
 
            this.showDate(json);
            this.initView();
        }
    },
    showDate(json){
        let pkScript = cc.find('Canvas').getComponent('Pk');

        pkScript.closeYouTi();
        pkScript.startMusic();
        //标题
        this.title.active = true;
        let t = this.title.getComponent(cc.Label);
        if (json.data.name.length > 21) {
            t.string = json.data.name.substr(0, 21)+"...";
        }else{
            t.string = json.data.name;
        }
        //多少人在等待
        this.renshu.active = true;
        let r = this.renshu.getComponent(cc.Label);
        r.string = json.data.waitUserCount+"人在等待";
        //清除人员头像下的所有节点
        this.renlist.active = true;
        this.renlist.removeAllChildren();
        //等待人员头像
        if (json.data.userList) {
            let flipTime = 1;
            json.data.userList.forEach((element, i) => {
                //l.forEach((element, i) => {
                    let headNode = cc.instantiate(this.headPrefab);
                    let headNodeScript = headNode.getComponent("PkHeadNode")
                    headNodeScript.initView(element.avatar, flipTime * i); 
                    headNode.parent = this.renlist;
                });
        }

    },

    updateData: function () {  
        PkDataUtil.setJoinCount(PkDataUtil.getJoinCount()+1);
        let shi1shuLable = this.shi1shu.getComponent(cc.Label);
        let shi2shuLable = this.shi2shu.getComponent(cc.Label);
        let fen1shuLable = this.fen1shu.getComponent(cc.Label);
        let fen2shuLable = this.fen2shu.getComponent(cc.Label);
        let miao1shuLable = this.miao1shu.getComponent(cc.Label);
        let miao2shuLable = this.miao2shu.getComponent(cc.Label);
            if (PkDataUtil.getDifferTime() <= 0) {
                //倒计时结束到等待页面
                this.daojishi.active = false;
                this.sanmiao.active = false;
                this.denguanli.active = true;
            }else{
                this.daojishi.active = true;
                //倒计时
                let differTime = PkDataUtil.getDifferTime();
                //计算时间
                let h = parseInt(differTime / 3600,10)
                let m = parseInt((differTime - h * 3600) / 60,10)
                let s = parseInt(differTime - h * 3600 - m * 60,10)

                //时
                if (h < 10 ) {
                    shi1shuLable.string = 0;
                    shi2shuLable.string = h;
                }else{
                    shi1shuLable.string = String(h).split('')[0];
                    shi2shuLable.string = String(h).split('')[1];
                }
                //分
                if (m < 10) {
                    fen1shuLable.string = 0;
                    fen2shuLable.string = m;
                } else {
                    fen1shuLable.string = String(m).split('')[0];
                    fen2shuLable.string = String(m).split('')[1];
                }
                //秒
                if (s < 10) {
                    miao1shuLable.string = 0;
                    miao2shuLable.string = s;
                } else {
                    miao1shuLable.string = String(s).split('')[0];
                    miao2shuLable.string = String(s).split('')[1];
                }

                PkDataUtil.elapseDifferTime();
            }


        //10分钟计数执行
        let join10Count = PkDataUtil.getJoin10Count();
        if (join10Count >= 600) {

            //执行请求接口，更新数据
            let pkStage = DataUtil.getPkStage();
            Http.getInstance().httpGet("pk/stage/" + pkStage.stageId + "/join", (json) => {
                //增加错误界面提示
                if(json.code == 0){
                    PkDataUtil.setJoinData(json);
                    this.selectPage(json);
                }else if (json.message == '已超过游戏最大人数限制.') {
                    let pkScript = cc.find('Canvas').getComponent('Pk');
                    pkScript.showWubairen();
                }else{
                    let errorPop = cc.instantiate(this.errorPop);
                    let errorPopScript = errorPop.getComponent('ErrorPop');
                    errorPopScript.initView(json);
                    errorPopScript.setCallBack(() => {
                        errorPop.destroy();
                        if (json.code != -1) {//本地断网只需要关闭弹窗
                            if (DataUtil.getChatRoomId()) {
                                WebIM.conn.quitChatRoom({
                                    roomId:  DataUtil.getChatRoomId(), // 聊天室id
                                    success: function (m) {
                                        cc.log("##########################joinChatRoom m:"+m);
                                    },
                                    error: function(){
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
            PkDataUtil.setJoin10Count(1);
        }else{
            PkDataUtil.setJoin10Count(join10Count+1);
        }

        //3秒钟计数执行
        let join3Count = PkDataUtil.getJoin3Count();
        let flipTime = 1;
        let waitFlipTime = this.renlist.childrenCount * flipTime + 3;
        if (join3Count >= waitFlipTime) {
            this.renlist.removeAllChildren(false);
            let joinData = PkDataUtil.getJoinData();
            if (joinData != null && joinData.data !=null && joinData.data.userList != null) {
                let arr = joinData.data.userList;
                //执行打乱数据，翻新头像
                if (arr) {
                    function randomsort(a, b) {
                        return Math.random()>.5 ? -1 : 1;
                    }
                    arr.sort(randomsort);
                    arr.forEach((element, i) => {
                            if (i <= 30) {
                                let headNode = cc.instantiate(this.headPrefab);
                                let headNodeScript = headNode.getComponent("PkHeadNode");
                                headNodeScript.initView(element.avatar, i * flipTime); 
                                headNode.parent = this.renlist;

                            }
                        });
                }
            }
            PkDataUtil.setJoin3Count(1);

        }else{
            PkDataUtil.setJoin3Count(join3Count+1);
        }

    }

});
