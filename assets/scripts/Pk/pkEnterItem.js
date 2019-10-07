const Http = require('Http');
const DataUtil = require("DataUtil");

const MAX_LIMIT_STRING = 17;
const MAX_LIMIT_NUM = 500;//限制最多五百人

cc.Class({
    extends: cc.Component,

    properties: {
        line: cc.Sprite,
        bao: cc.Sprite,
        title: cc.Label,
        selectFrame: [cc.SpriteFrame],

        _itemData: null,//Item数据
        _index: 0, //列表中的位置
    },

    onLoad() { },

    //填充数据
    setData(data, index) {
        this._itemData = data;
        this._index = index;
        let imgIndex = this._index % 5;
        //后面的icon
        this.bao.spriteFrame = this.selectFrame[imgIndex];
        //标题
        this.title.string = (data.gameName.length > MAX_LIMIT_STRING) ?
            (data.gameName.substr(0, MAX_LIMIT_STRING) + "...") : data.gameName;
    },

    //点击Item
    onClickItem() {
        DataUtil.setPkStageId(this._itemData.stageId);

        this.loadPKStatus();
    },

    //获取PK擂台的状态
    loadPKStatus() {
        Http.getInstance().httpGet("pk/stage/" + this._itemData.stageId + "/prepare", (json) => {
            cc.log("JSON00000:", json);
            let scene = "PKWaiting";
            if (json && json.code == 0) {
                let data = json.data || {};
                DataUtil.setPkRoom(data);

                let userCount = data.userCount || 0; //当前进来多少人
                if (userCount > MAX_LIMIT_NUM) { //超出500人
                    scene = "PKWaiting";
                }

                let gameStatus = data.gameStatus; //游戏状态0:未开始   1:进行中    2已结束
                let systemTime = data.systemTime; //服务器当前系统时间
                let startTime = data.startTime; //服务器指定的比赛开始时间
                if (gameStatus == 0) {//PK还没有开始
                    let offTime = startTime - systemTime;
                    if (offTime > 0) {
                        if (offTime > 1000 * 60 * 60 * 24 * 3) {//大于三天
                            scene = "PKWaiting";
                        } else {//小于三天
                            scene = "PKWaiting";
                        }
                    } else {//比赛时间已经到，到等待界面
                        DataUtil.setJoinStatus(0);
                        scene = "PKGame";
                    }
                } else if (gameStatus == 1) {//比赛已经开始
                    this.renderDoingView();
                } else if (gameStatus == 2) {//比赛已经结束
                    scene = "PKWaiting";
                }
            }

            cc.director.loadScene(scene);
        });
    },

    //比赛正在进行
    renderDoingView() {
        Http.getInstance().httpGet("pk/stage/" + this._itemData.stageId + "/join", (json) => {
            cc.log("比赛正在进行：", json);
            if (json && json.code == 0) {
                let data = json.data || {};
                DataUtil.setPkJoin(data);

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
});
