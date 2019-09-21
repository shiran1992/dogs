
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
        content: cc.Node,
        title: cc.Label,
        condition: cc.Label,
        state: cc.Label,

    },

    onLoad () {
        this.title.string = "";
        this.condition.string = "";
        this.state.string = "";
    },

    setData (data) {
        this.data = cc.instantiate(data);
        let bg = this.node.getChildByName("bg");
        bg.on(cc.Node.EventType.TOUCH_START,(event)=>{
        },this);

        bg.on(cc.Node.EventType.TOUCH_MOVE,(event)=>{
        },this);

        bg.on(cc.Node.EventType.TOUCH_END,(event)=>{
            this.onClose();
        },this);

        if(!data){return;}

        cc.loader.loadRes("medal", cc.SpriteAtlas, (err, atlas)=>{
            let medal = this.content.getChildByName("medal").getComponent(cc.Sprite);
            var frame = atlas.getSpriteFrame(this.data.img);
            medal.spriteFrame = frame;

            this.title.string = medalConfig[this.data.proType].title;
            if(this.data.gray == 1){
                medal._sgNode.setState(1);
                this.condition.string = medalConfig[this.data.proType].condition[0];
                this.state.string = "(暂未获得)";
            }else{
                this.condition.string = medalConfig[this.data.proType].condition[this.data.medalLevel - 1];
                this.state.string = "";
            }

            medal.node.setScale(0,0);
            medal.node.runAction(cc.sequence(cc.scaleTo(0.2,1.05),cc.scaleTo(0.1,0.92),cc.scaleTo(0.1,1)));

            let light = this.content.getChildByName("light");
            let ani = light.getComponent(cc.Animation);
            ani.play();
            
            light.runAction(cc.repeatForever(cc.rotateBy(2,360)));
        });
    },

    onClose(){
        this.node.destroy();
    }

});
