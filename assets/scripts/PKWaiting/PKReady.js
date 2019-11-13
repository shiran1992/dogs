const Http = require('Http');
const DataUtil = require("DataUtil");
const Helper = require("Helper");

const MAX_LIMIT_NUM = 500;//限制最多五百人
const MAX_LIMIT_STRING = 21;
const USER_HEAD_NUM = 30;//人物头像

cc.Class({
    extends: cc.Component,

    properties: {
        title: cc.Label,
        head: cc.Node,
        timeDown: cc.Node,
        threeSecond: cc.Prefab, //倒计时三秒
        delay: cc.Node,//时间已经到等待发题的提示
        num: cc.Label,
        userHead: cc.Prefab,
        userlist: cc.Node,//等待人员列表
        hour0: cc.Label,
        hour1: cc.Label,
        minute0: cc.Label,
        minute1: cc.Label,
        second0: cc.Label,
        second1: cc.Label,
    },

    ctor() {
        this._pkRoom = null;
        this._pkJoin = null;
        this._users = [];//所有用户
        this._curUsers = [];//当前正在显示用户
        this.timeDowning = false;//正在倒计时

        this.timer0 = null;//事件定时器（10分钟调一次接口）
        this.timer1 = null;//事件定时器（时间倒计时翻牌）
    },

    onLoad() {
        cc.game.on(cc.game.EVENT_SHOW, (event) => {
            cc.log('emit cc.game.EVENT_SHOW!');
            this.loadData();
        });

        cc.game.on(cc.game.EVENT_HIDE, (event) => {
            cc.log('emit cc.game.EVENT_HIDE!');
        });
    },

    setData(pkRoom = {}) {
        this._pkRoom = pkRoom;

        this.initView();

        this.loadData();
        this.timer0 = setInterval(() => {//十分钟轮询一次
            this.loadData();
        }, 10 * 60 * 1000);
    },

    //开始倒计时
    startAnimation(callback) {
        this.head.active = false;
        this.delay.active = false;
        let threeNode = cc.instantiate(this.threeSecond);
        this.timeDown.addChild(threeNode);
        let script = threeNode.getComponent("ReadyThreeSecond");
        script.startNumDown(() => {
            this.timeDowning = false;
            callback && callback();
        });
    },

    initView() {
        let name = this._pkRoom.name || "";
        this.title.string = name.length > MAX_LIMIT_STRING ? (name.substr(0, MAX_LIMIT_STRING) + "...") : name;
    },

    //加载下面的等待列表(这个地方之前是10分钟刷新一次，现在待定。。。)
    loadData() {
        let stageId = DataUtil.getPkStageId();
        Http.getInstance().httpGet("pk/stage/" + stageId + "/join", (json) => {
            cc.log("准备信息：", json);
            if (json && json.code == 0) {
                let data = json.data || {};
                DataUtil.setPkJoin(data);

                this._pkJoin = data;
                this._users = data.userList || [];
                this._users.reverse();
                this._curUsers = this._users.concat([]).slice(0, USER_HEAD_NUM);

                let systemTime = this._pkJoin.systemTime; //服务器当前系统时间
                let startTime = this._pkJoin.startTime; //服务器指定的比赛开始时间
                let offTime = startTime - systemTime;
                if (offTime > 0) {//时间没到，进行倒计时
                    this.head.active = true;
                    this.delay.active = false;
                    this.showTimeDown(offTime);
                } else {//时间到了，管理员没发题
                    if (!this.timeDowning) {
                        this.head.active = false;
                        this.delay.active = true;
                    }
                    this.timer1 && clearInterval(this.timer1);
                    this.timer1 = null;
                }
                this.num.string = data.waitUserCount + "人正在等待";

                this.renderUserHeader();
            }
        });
    },

    //渲染下面的头像框
    renderUserHeader() {
        this.userlist.childrenCount && this.userlist.removeAllChildren();
        for (let i = 0; i < USER_HEAD_NUM; i++) {
            let headNode = cc.instantiate(this.userHead);
            headNode.setTag("HEAD" + i);
            this.userlist.addChild(headNode);
            let script = headNode.getComponent("PkHeadNode");
            let user = i < this._curUsers.length ? this._curUsers[i] : {};
            script.setData(user);
        }
    },

    //显示时间倒计时
    showTimeDown(offTime) {
        this.timer1 && clearInterval(this.timer1);
        this.timer1 = null;
        try {
            let time = Math.floor(offTime / 1000);
            this.timer1 = setInterval(() => {
                if (time >= 0) {
                    let s = time % 60;
                    let m = ((time - s) / 60) % 60;
                    let h = Math.floor(((time - s) / 60) / 60);
                    //小时
                    if (h < 10) {
                        this.hour0.string = "0";
                        this.hour1.string = h + "";
                    } else {
                        this.hour0.string = Math.floor(h / 10) + "";
                        this.hour1.string = h % 10 + "";
                    }
                    //分钟
                    if (m < 10) {
                        this.minute0.string = "0";
                        this.minute1.string = m + "";
                    } else {
                        this.minute0.string = Math.floor(m / 10) + "";
                        this.minute1.string = m % 10 + "";
                    }
                    //秒
                    if (s < 10) {
                        this.second0.string = "0";
                        this.second1.string = s + "";
                    } else {
                        this.second0.string = Math.floor(s / 10) + "";
                        this.second1.string = s % 10 + "";
                    }

                    time--;
                } else {
                    this.delay.active = true;
                    this.head.active = false;
                    this.timer1 && clearInterval(this.timer1);
                    this.timer1 = null;
                }
            }, 1 * 1000);
        } catch (e) {

        }
    },

    //更新聊天室等待人数
    addChatRoom(data) {
        if (data) {
            let waitUserCount = data.waitUserCount || 0;
            let users = data.userList || [];
            users = users.slice(0, USER_HEAD_NUM);
            this.num.string = waitUserCount + "人正在等待";
            for (let i = 0; i < users.length; i++) {
                let headNode = this.userlist.getChildByTag("HEAD" + i);
                let script = headNode.getComponent("PkHeadNode");
                script.setData(users[i]);
            }
        }
    },

    clear() {
        this.timer0 && clearInterval(this.timer0);
        this.timer1 && clearInterval(this.timer1);
        this.timer0 = null;
        this.timer1 = null;
        cc.game.off(cc.game.EVENT_SHOW);
        cc.game.off(cc.game.EVENT_HIDE);
    },

    doDestroy() {
        this.clear();
        this.node && this.node.destroy();
    },

    onDestroy() {
        this.clear();
    }
});
