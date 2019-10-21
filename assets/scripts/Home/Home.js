let DataUtil = require("DataUtil");
let PkDataUtil = require("PkDataUtil");
let Helper = require("Helper");
let Http = require("Http");

cc.Class({
    extends: cc.Component,

    properties: {
        bgNode: cc.Node,
        scroll: cc.ScrollView,

        scrollViewNode1: cc.Node,
        scrollViewNode2: cc.Node,
        scrollViewNode3: cc.Node,
        scrollViewNode4: cc.Node,
        scrollViewNode5: cc.Node,

        scroll1: cc.ScrollView,
        scroll2: cc.ScrollView,
        scroll3: cc.ScrollView,
        scroll4: cc.ScrollView,
        scroll5: cc.ScrollView,

        pItem: cc.Node,
        pkItem: cc.Prefab,//首页PK赛列表Item

        rank: cc.Node,
        bag: cc.Node,
        medal: cc.Node,
        shop: cc.Node,

        brainRankPrefab: cc.Prefab,
        Loading: cc.Prefab,
        medalLayer: cc.Prefab,

        medalContent: cc.Node,

        errorPop: cc.Prefab,
        vsion: cc.Node
    },

    onLoad() {
        //2.加载字体
        cc.loader.loadRes("font/zzgfxy.ttf");
        //1.加载域名
        cc.loader.loadRes("DomainConfig.json", (err, data) => {
            if (data && data.domain) {
                Helper.setDomain(data.domain);

                //3.加载index数据接口
                this.sendRequst();
                //4.初始化数据
                this.initData();

                //5.如果上次数据没提交，这次再继续提交
                let questionResultStr = cc.sys.localStorage.getItem("questionResult");
                if (questionResultStr) {
                    DataUtil.switch && console.log('上次提交失败，再次提交数据');
                    let questionResult = JSON.parse(questionResultStr);
                    let stageId = questionResult.stageId;
                    let subStageId = questionResult.subStageId;
                    let obj = questionResult.obj;
                    if (stageId && subStageId) {
                        Http.getInstance().httpPost("stage/" + stageId + "/submit/" + subStageId, obj, { encryt: true }, (json) => {
                            cc.sys.localStorage.setItem("questionResult", '');
                        });
                    }
                }
            }
        });

        Helper.loadErrorPop();

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

    sendRequst() {
        Http.getInstance().httpGet("index", (json) => {
            //增加错误界面提示
            if (json.code != 0) {
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

            if (json) {
                let data = json.data || {};
                let userInfo = data.userInfo;
                let gameStages = data.gameStages || [];
                let gamePKInfos = data.gamePKInfos || [];
                gamePKInfos = gamePKInfos.slice(0, 5);

                //3.1加载用户信息
                this.setUserInfo(userInfo);
                //3.2加载关卡信息
                this.loadItems(gameStages, gamePKInfos);
                this.loadPkItem(gamePKInfos);
                //3.3加载背景
                this.initBg();
            }

        });
    },

    //一期初始化数据
    initData() {
        this.itemNum = 20;
        this.itemList = [];
        this.setJumpItem(this.rank, () => {
            let brainRankPop = cc.instantiate(this.brainRankPrefab);
            this.node.addChild(brainRankPop);
        });

        this.setJumpItem(this.bag, () => {

        }, true);

        this.setJumpItem(this.medal, () => {
            let medalLayer = cc.instantiate(this.medalLayer);
            this.node.addChild(medalLayer);
            medalLayer.setPosition(0, 0);
        });

        this.setJumpItem(this.shop, () => {

        }, true);
    },

    setJumpItem(target, callback, swallwTouch) {
        let scp = target.getComponent("IconItem");
        scp.setClickCallback(callback, swallwTouch);
    },

    //设置个人信息
    setUserInfo(data) {
        if (!data) { return; };
        DataUtil.setUserData(cc.instantiate(data));
        let userNode = this.scroll.content.getChildByName("Node_userInfo");
        let headNode = userNode.getChildByName("headNode");

        let icon = headNode.getChildByName("headIcon").getComponent(cc.Sprite);
        if (data.avatar) {
            Helper.loadHttpImg(icon, data.avatar);
        }
        this.avatar = data.avatar;

        let labelName = headNode.getChildByName("userName").getComponent(cc.Label);
        labelName.string = data.cName;
        if (data.cName.length > 5) {
            labelName.string = data.cName.substr(0, 5) + "...";
        } else {
            labelName.string = data.cName;
        }

        let levelName = headNode.getChildByName("levelName").getComponent(cc.Label);
        levelName.string = data.levelName;

        let gold = userNode.getChildByName("moneyNode").getChildByName("goldNum").getComponent(cc.Label);
        gold.string = data.coin;

        let percent = 0;
        if (data.maxValue > 0) {
            percent = (data.brainValue - data.minValue) / (data.maxValue - data.minValue);
        } else {
            percent = 1;
        }

        let levelNode = userNode.getChildByName("levelNode");
        let progressBar = levelNode.getChildByName("levelProgressBar").getComponent(cc.ProgressBar);
        progressBar.progress = percent;

        let brainLabel = levelNode.getChildByName("brainNum").getComponent(cc.Label);
        brainLabel.string = data.brainValue;

        let levelLabel = levelNode.getChildByName("leveTitle").getComponent(cc.Label);
        levelLabel.string = "LV" + data.level;
        /*
        let medalItem = userNode.getChildByName("medalItem");
        let svrData = [];

        for (let i = 0; i < data.gameUserPropsMedals.length; i++) {
            svrData[data.gameUserPropsMedals[i].proType] = data.gameUserPropsMedals[i];
        }

        let gotList = [];
        let unOwnList = [];
        for (let i = 0; i < 8; i++) {
            if (svrData[i]) {
                gotList.push(svrData[i]);
            } else {
                unOwnList.push({ "idx": i });
            }
        }
        DataUtil.setMedalData({ "gotList": gotList, "unOwnList": unOwnList })

        for (let i = 0; i < gotList.length; i++) {
            let medalData = gotList[i];
            let item = cc.instantiate(medalItem);
            this.medalContent.addChild(item);
            cc.loader.loadRes("medal", cc.SpriteAtlas, (err, atlas) => {
                item.active = true;
                var frame = atlas.getSpriteFrame("medal" + (medalData.proType + 1) + "_" + medalData.medalLevel);
                item.getComponent(cc.Sprite).spriteFrame = frame;
            });
        }

        for (let i = 0; i < unOwnList.length; i++) {
            let medalData = unOwnList[i];
            let item = cc.instantiate(medalItem);
            this.medalContent.addChild(item);
            cc.loader.loadRes("medal", cc.SpriteAtlas, (err, atlas) => {
                item.active = true;
                var frame = atlas.getSpriteFrame("medal" + (medalData.idx + 1) + "_" + 1);
                let icon = item.getComponent(cc.Sprite);
                icon.spriteFrame = frame;
                icon._sgNode.setState(1);
            });
        }*/
    },

    //加载关卡
    loadItems(data, gamePKInfos) {
        if ((!data || data.length == 0) && gamePKInfos.length == 0) {
            this.loadBlankItem();
            return;
        }

        if (!data || data.length == 0) {
            this.loadBlankItem2();
        }

        let itemRoot = this.scroll.content.getChildByName("itemNode");
        let itemH = 0
        for (let i = 0; i < data.length; i++) {
            let itemData = data[i];
            let item = cc.instantiate(this.pItem);
            item.parent = itemRoot;
            let scp = item.getComponent("EnterItem");
            scp.setData(itemData);
            scp.setClickCallback(() => {
                cc.log("###################### 全局保存选中的海岛游戏 itemData:" + JSON.stringify(itemData));

                DataUtil.setCurStage(itemData);
                this.goStage();
            });

            item.active = true;
            this.itemList[i] = item;

            scp.setIdx(i, i == 0);

            itemH += (item.height + 15);
        }
        itemRoot.height = itemH;

        if (gamePKInfos.length == 0) {
            itemRoot.y = -651;
        } else if (gamePKInfos.length == 1) {
            itemRoot.y = -958;
        } else if (gamePKInfos.length == 2) {
            itemRoot.y = -1165;
        } else if (gamePKInfos.length == 3) {
            itemRoot.y = -1314;
        } else if (gamePKInfos.length == 4) {
            itemRoot.y = -1518;
        } else if (gamePKInfos.length >= 5) {
            itemRoot.y = -1656;
        }
    },

    loadBlankItem() {
        let pItem = this.node.getChildByName("blankItem");
        let itemRoot = this.scroll.content.getChildByName("itemNode");
        let item = cc.instantiate(pItem);
        item.parent = itemRoot;
        item.active = true;
    },

    loadBlankItem2() {
        let pItem = this.node.getChildByName("blankItem2");
        let itemRoot = this.scroll.content.getChildByName("itemNode");
        let item = cc.instantiate(pItem);
        item.parent = itemRoot;
        item.active = true;
    },

    goStage(data) {
        let loadingPre = cc.instantiate(this.Loading);
        let scp = loadingPre.getComponent("StageLoading");
        scp.setPreLoadScene("Stage");
        scp.setAvatar(this.avatar);
        loadingPre.height = this.node.height;
        loadingPre.height = this.node.width;
        loadingPre.parent = this.node;
        loadingPre.setPosition(this.node.width / 2, this.node.width / 2);
    },

    //加载ＰＫ赛数据
    loadPkItem(data) {
        let itemRoot = null;
        if (!data || data.length == 0) {
            //不显示
        } else if (data.length == 1) {
            this.scrollViewNode1.active = true;
            itemRoot = this.scroll1.content;
        } else if (data.length == 2) {
            this.scrollViewNode2.active = true;
            itemRoot = this.scroll2.content;
        } else if (data.length == 3) {
            this.scrollViewNode3.active = true;
            itemRoot = this.scroll3.content;
        } else if (data.length == 4) {
            this.scrollViewNode4.active = true;
            itemRoot = this.scroll4.content;
        } else if (data.length >= 5) {
            this.scrollViewNode5.active = true;
            itemRoot = this.scroll5.content;
        }
        if (data && data.length > 0) {
            let itemH = 0
            for (let i = 0; i < data.length; i++) {
                let itemData = data[i];
                let item = cc.instantiate(this.pkItem);
                item.parent = itemRoot;
                let scp = item.getComponent("pkEnterItem");
                scp.setData(itemData, i);

                item.active = true;
                this.itemList[i] = item;
                itemH += (item.height + 15);
            }
            if (itemRoot) {
                itemRoot.height = itemH;
            }
        }
    },

    initBg() {
        //初始两个，关卡叠加高度超过，则增加
        let bgItem = this.bgNode.getChildByName("bg1");
        let itemRoot = this.scroll.content.getChildByName("itemNode");
        let constH = Math.abs(itemRoot.y);

        let contentH = constH + itemRoot.height;
        if (contentH > bgItem.height) {
            let offsetH = contentH - bgItem.height;
            let addNum = Math.ceil(offsetH / bgItem.height);
            for (let i = 0; i < addNum; i++) {
                let bg = cc.instantiate(bgItem);
                bg.parent = this.bgNode;
            }
        }

        this.scroll.content.height = cc.winSize.height;
        if (contentH > cc.winSize.height) {
            this.scroll.content.height = contentH;
        }
    },

    homeBack() {
        Helper.playButtonMusic();

        if (window.isApp) {
            window.yxt.ui.navigation.back({
                onSuccess: function (data) {
                    if (data.isback) {
                        window.history.go(-1)
                    } else {
                        window.yxt.ui.navigation.close({
                            onSuccess: function (data) {
                            }
                        })
                    }
                }
            })
        } else {
            window.history.go(-1)
        }
    },


    //调试日志
    onclickRecord() {
        cc.director.loadScene("Debug");
    },
})