let DataUtil = require("DataUtil");
let Helper = require("Helper");
let Http = require("Http");
cc.Class({
    extends: cc.Component,

    properties: {
        scrollView: cc.ScrollView,

        island1: cc.Prefab,
        island2: cc.Prefab,
        island3: cc.Prefab,
        island4: cc.Prefab,
        island5: cc.Prefab,
        island6: cc.Prefab,
        island7: cc.Prefab,

        rulePopPrefab: cc.Prefab,
        levelRankPrefab: cc.Prefab,
        loadingPre: cc.Prefab,

        errorPop: cc.Prefab
    },

    ctor() {
        this.title = '';
    },

    onLoad() {
        this.islandIdx = 0;
        this.islandNum = 0;
        this.curIndex = 1;
        this.bgBaseH = 1334;
        this.posY = 250;
        this.preIslands = [this.island1, this.island2, this.island3, this.island4, this.island5, this.island6, this.island7];
        this.islands = [];
        this.scrollView.content.height = cc.winSize.height;
        this.sendRequst();
        //this.loadIslands();
    },

    sendRequst() {
        let stageData = DataUtil.getCurStage() || {};
        let stageId = stageData.stageId;
        //获取浏览器url参数
        let page = this.getQueryString('page');
        let id = this.getQueryString('stageId');
        if (!stageId && page == 'Stage') {
            if (id) {
                //动态获取域名
                cc.loader.loadRes("DomainConfig.json", (err, data) => {
                    if (data && data.domain) {
                        Helper.setDomain(data.domain);
                        stageId = id;
                        DataUtil.setCurStage({
                            stageId: stageId
                        });
                        this.getStagesInfo(stageId);
                    }
                });
            } else {
                cc.director.loadScene('Home');
            }
        } else {
            this.getStagesInfo(stageId);
        }
        /*stageId = 'd7ca32bd-3151-40e9-be31-4cfc9ee87e1b';
        DataUtil.setCurStage({
            stageId: stageId
        });*/
    },
    //获取海岛详情
    getStagesInfo(stageId) {
        Http.getInstance().httpGet("gameStageDetail/" + stageId, (json) => {
            DataUtil.switchLog && console.log("receive:", json);
            if (json.code == 0) {
                let data = json.data || {};

                let title = this.scrollView.content.getChildByName("title").getComponent(cc.Label);
                title.string = data.gameName;
                this.title = data.gameName;
                let stage = data.gameSubStageDetails || [];
                DataUtil.setAllSubStage(stage);
                this.curIndex = Math.min(data.maxIndex, stage.length);
                this.loadIslands(data.gameSubStageDetails, data);
                this.timer = setTimeout(() => {
                    Helper.playCloudMusic();
                }, 800);
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

    getQueryString(name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        let r = window.location.search.substr(1).match(reg);
        if (r) {
            return unescape(r[2]);
        }
        return null;
    },

    loadIslands(data, json) {
        if (!data) { return }
        this.islandNum = data.length;
        for (let i = 0; i < data.length; i++) {
            let itemData = data[i];
            let idx = i
            if (idx > 6) {
                idx = idx % 7;
            }
            itemData.singleSeconds = json.singleSeconds; //塞小关卡信息里面方便使用;
            this.loadIsland(idx, i, itemData);
        }
    },

    loadIsland(idx, index, data) {
        let island = cc.instantiate(this.preIslands[idx]);
        let pNode = this.scrollView.content.getChildByName("island");
        island.parent = pNode;
        this.islands.push(island);

        let scp = island.getComponent("island");
        scp.setIndex(index + 1, this.curIndex);
        scp.setData(data);
        scp.setCallback((itemData) => {
            DataUtil.switchLog && console.log("ggggg");
            DataUtil.setCurSubStage(itemData);
            this.pushToGame();
        });
        if (this.curIndex == index + 1) {
            scp.setOpenning();
        }

        if (index == this.islandNum - 1) {
            scp.hideArrow();
        }

        island.y = -(this.posY + island.height / 2)
        this.posY += island.height;

        if (this.posY > cc.winSize.height) {
            this.scrollView.content.height = this.posY;
        }

        if (this.scrollView.content.height > this.bgBaseH) {
            let bgRoot = this.scrollView.content.getChildByName("bg");
            let bgItem = bgRoot.getChildByName("bg_sea");
            let addItem = cc.instantiate(bgItem);
            addItem.parent = bgRoot;

            //flies
            let pFlyNode = this.scrollView.content.getChildByName("flies");
            let flyItem = pFlyNode.getChildByName("fireflies");
            let copyItem = cc.instantiate(flyItem);
            copyItem.parent = pFlyNode;

            this.bgBaseH += bgItem.height;
        }

        if (index + 1 == this.islandNum) {
            let curIsland = this.islands[this.curIndex - 1];
            if (Math.abs(curIsland.y) > this.scrollView.node.height / 2) {
                this.scrollView.setContentPosition(cc.p(0, this.scrollView.content.y + Math.abs(curIsland.y) - this.scrollView.node.height / 2));
                //this.scrollView.scrollToPercentVertical((Math.abs(curIsland.y - 667) - this.scrollView.node.height/2)/(this.scrollView.content.height));
            }
        }
    },

    onDestroy() {
        clearTimeout(this.timer);
        this.timer = null;
    },

    //返回首页
    onClickBack() {
        Helper.playButtonMusic();
        cc.director.loadScene('Home', () => { });
    },

    //点击排行榜
    onClickRank() {
        Helper.playButtonMusic();
        let levelRankPop = cc.instantiate(this.levelRankPrefab);
        let levelRankPopScript = levelRankPop.getComponent('LevelRankPop');
        levelRankPopScript.setTitle(this.title);
        this.node.addChild(levelRankPop);
    },

    //点击规则界面
    onClickRule() {
        Helper.playButtonMusic();
        let rulePop = cc.instantiate(this.rulePopPrefab);
        this.node.addChild(rulePop);
    },

    //进入答题界面
    pushToGame() {
        let loadingPre = cc.instantiate(this.loadingPre);
        let scp = loadingPre.getComponent("LoadingQuestion");
        scp.setPreLoadScene("Game");
        loadingPre.parent = this.node;
    }
});
