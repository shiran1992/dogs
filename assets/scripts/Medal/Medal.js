let Helper = require("Helper")
let DataUtil = require("DataUtil")
let medalConfig = [
    {"title":"秒答快手","condition":["5个关卡,通关时间最短","50个关卡，通关时间最短","500个关卡,通关时间最短"]},
    {"title":"连击杀手","condition":["50次 三连击","300次三连击","500次三连击"]},
    {"title":"连赢侠客","condition":["1个连赢3次200秒PK赛","10个连赢3次200秒PK赛","50个连赢3次200秒PK赛"]},
    {"title":"PK勇士","condition":["赢得20场200秒PK赛","赢得100场200秒PK赛","赢得300场200秒PK赛"]},
    {"title":"万贯财主","condition":["金币达到10000","金币达到20000","金币达到50000"]},
    {"title":"通关达人","condition":["通关达到50关","通关达到300关","通关达到1000关"]},
    {"title":"超级擂主","condition":["获得10关卡擂主","获得50关卡擂主","获得200关卡擂主"]},
    {"title":"黑暗圣人","condition":["使用过道具卡10张","使用过道具卡50张","使用过道具卡200张"]},

];
cc.Class({
    extends: cc.Component,

    properties: {
        scrollView: cc.ScrollView,
        item: cc.Node,
        board: cc.Sprite,

        headNode: cc.Node,
        levelNode: cc.Node,

        bigItem: cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.medalNum = 40;
        this.index = 1;

        this.scrollView.node.height = cc.winSize.height * (600 / 1334);

        this.setUserInfo();

        let data = DataUtil.getMedalData();
        let gotList = [];
        //if (data.g.gotList) {
        //    gotList = data.gotList;
        //}
        let unOwnList = [];
        //if (condition) {
        //    unOwnList = data.unOwnList;
        //}
        let iconList = [];
        for (let i = 0; i < gotList.length; i++) {
            let medalData = gotList[i];
            let item = cc.instantiate(this.item);
            item.parent = this.scrollView.content;
            let title = item.getChildByName("title").getComponent(cc.Label);
            title.string = medalConfig[medalData.proType].title;
            iconList.push({"gray":0,"proType":medalData.proType,"medalLevel":medalData.medalLevel,"node":item,"img":"medal"+ (medalData.proType + 1) + "_" + medalData.medalLevel});
            cc.loader.loadRes("medal", cc.SpriteAtlas, (err, atlas)=>{
                item.active = true;
                var frame = atlas.getSpriteFrame("medal"+ (medalData.proType + 1) + "_" + medalData.medalLevel);
                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = frame;
            });
        }

        for (let i = 0; i < unOwnList.length; i++) {
            let medalData = unOwnList[i];
            let item = cc.instantiate(this.item);
            item.parent = this.scrollView.content;
            let title = item.getChildByName("title").getComponent(cc.Label);
            title.string = medalConfig[medalData.idx].title;
            iconList.push({"gray":1,"proType":medalData.idx,"node":item,"img":"medal"+ (medalData.idx + 1) + "_" + 1});
            cc.loader.loadRes("medal", cc.SpriteAtlas, (err, atlas)=>{
                item.active = true;
                var frame = atlas.getSpriteFrame("medal"+ (medalData.idx + 1) + "_" + 1);
                let icon = item.getChildByName("icon").getComponent(cc.Sprite);
                icon.spriteFrame = frame;
                icon._sgNode.setState(1);
            });
        }

        this.iconList = iconList;

        for (let i = 0; i < iconList.length; i++) {
            let unit = iconList[i]
            unit.node.tag = i;
            unit.node.on(cc.Node.EventType.TOUCH_START,(event)=>{
                
            },this);
    
            unit.node.on(cc.Node.EventType.TOUCH_MOVE,(event)=>{
                
            },this);
    
            unit.node.on(cc.Node.EventType.TOUCH_END,(event)=>{
                let tag = event.target.tag
                let item = cc.instantiate(this.bigItem)
                item.parent = this.node;
                let scp = item.getComponent("SeeMedal");
                scp.setData(this.iconList[tag]);
            },this);
        }

        // for (let i = 0; i < 40; i++) {
        //     let item = cc.instantiate(this.item);
        //     item.parent = this.scrollView.content;
        //     item.active = true;
        //     if(i > 20){
        //         let icon = item.getChildByName("icon").getComponent(cc.Sprite);
        //         icon._sgNode.setState(1);
        //     }
        // }
    },

    setUserInfo(){
        let data = DataUtil.getUserData();
        if(!data){return;}

        let headIcon = this.headNode.getChildByName("headIcon").getComponent(cc.Sprite);
        Helper.loadHttpImg(headIcon,data.avatar);

        let labelName = this.headNode.getChildByName("userName").getComponent(cc.Label);
        labelName.string = data.cName;

        let levelName = this.headNode.getChildByName("levelName").getComponent(cc.Label);
        levelName.string = data.levelName;

        let percent = 0;
        if(data.maxValue > 0){
            percent = (data.brainValue - data.minValue) / (data.maxValue - data.minValue);
        }else{
            percent = 1;
        }

        let progressBar = this.levelNode.getChildByName("levelProgressBar").getComponent(cc.ProgressBar);
        progressBar.progress = percent;

        let brainLabel = this.levelNode.getChildByName("brainNum").getComponent(cc.Label);
        brainLabel.string = data.brainValue;

        let levelLabel = this.levelNode.getChildByName("leveTitle").getComponent(cc.Label);
        levelLabel.string = "LV" + data.level;
    },

    onBack () {
        Helper.playButtonMusic();
        this.node.destroy();
         cc.director.loadScene('Home', () => {
         });
    },

    

});
