let Helper = require("Helper");
let configScrap = [
    {board:"res/raw-assets/textures/Home/item1.png",leaf:"res/raw-assets/textures/Home/item_leaf1.png",vine:"res/raw-assets/textures/Home/item_vine1.png"},
    {board:"res/raw-assets/textures/Home/item2.png",leaf:"res/raw-assets/textures/Home/item_leaf2.png",vine:"res/raw-assets/textures/Home/item_vine2.png"},
    {board:"res/raw-assets/textures/Home/item3.png",leaf:"res/raw-assets/textures/Home/item_leaf1.png",vine:"res/raw-assets/textures/Home/item_vine1.png"},
    {board:"res/raw-assets/textures/Home/item4.png",leaf:"res/raw-assets/textures/Home/item_leaf2.png",vine:"res/raw-assets/textures/Home/item_vine2.png"},
    {board:"res/raw-assets/textures/Home/item5.png",leaf:"res/raw-assets/textures/Home/item_leaf2.png",vine:"res/raw-assets/textures/Home/item_vine2.png"},
    {board:"res/raw-assets/textures/Home/item6.png",leaf:"res/raw-assets/textures/Home/item_leaf1.png",vine:"res/raw-assets/textures/Home/item_vine1.png"},
    {board:"res/raw-assets/textures/Home/item7.png",leaf:"res/raw-assets/textures/Home/item_leaf2.png",vine:"res/raw-assets/textures/Home/item_vine2.png"}
];
cc.Class({
    extends: cc.Component,

    properties: {
        //点击之后显示的亮底
       light: cc.Sprite,
       //背景框
       board: cc.Sprite,
       leaf: cc.Sprite,
       vine: cc.Sprite,
       head: cc.Sprite,

       item1: cc.SpriteFrame,
       item2: cc.SpriteFrame,
       item3: cc.SpriteFrame,
       item4: cc.SpriteFrame,
       item5: cc.SpriteFrame,
       item6: cc.SpriteFrame,
       item7: cc.SpriteFrame,

       leaf1: cc.SpriteFrame,
       leaf2: cc.SpriteFrame,

       vine1: cc.SpriteFrame,
       vine2: cc.SpriteFrame,
       title1: cc.Label,
       stage1: cc.Label,
       cord: cc.Node,
       //config:[cc.Sprite]
    },

    onLoad () {
        this.cord.setLocalZOrder(100);
        this.config = [
            {board:this.item1,leaf:this.leaf1,vine:this.vine1},
            {board:this.item2,leaf:this.leaf2,vine:this.vine2},
            {board:this.item3,leaf:this.leaf1,vine:this.vine1},
            {board:this.item4,leaf:this.leaf2,vine:this.vine2},
            {board:this.item5,leaf:this.leaf2,vine:this.vine2},
            {board:this.item6,leaf:this.leaf1,vine:this.vine1},
            {board:this.item7,leaf:this.leaf2,vine:this.vine2}
        ];
        //亮底节点的透明度
        this.light.node.opacity = 0;
        //当手指触摸到屏幕时
        this.node.on(cc.Node.EventType.TOUCH_START,(event)=>{
            if(this.swallowTouch){return;}
            this.light.node.runAction(cc.sequence(cc.delayTime(0.1),cc.fadeIn(0.1)));
            this.isMove = false;
        },this);
        //当手指在屏幕上目标节点区域内移动时
        this.node.on(cc.Node.EventType.TOUCH_MOVE,(event)=>{
            if(this.swallowTouch){return;}
            if(!this.isMove){
                this.light.node.stopAllActions();
                this.light.node.opacity = 0;
                this.isMove = true;
            }
        },this);
        //当手指在目标节点区域内离开屏幕时
        this.node.on(cc.Node.EventType.TOUCH_END,(event)=>{
            Helper.playButtonMusic();
            if(this.swallowTouch){return;}
            //this.light.node.runAction(cc.sequence(cc.fadeIn(0.1),cc.fadeOut(0.1)));
            this.light.node.stopAllActions();
            this.light.node.opacity = 255;
            //顺序执行，渐隐效果，执行回调
            this.light.node.runAction(cc.sequence(cc.fadeOut(0.15),cc.callFunc(()=>{
                if(this.clickHandler){
                    this.clickHandler();
                }
            })));
        },this);
        //当手指在目标节点区域外离开屏幕时
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,(event)=>{
            //this.light.node.runAction(cc.fadeOut(0.1));
        },this);
    },
    
    setData(data){
        if(data.gameStageNum <= 0){
            this.swallowTouch = true;
        }
        this.title1.string = data.gameName;

        this.stage1.string = data.gameStageNum + "个关卡";
    },

    setIdx(idx, isLast){
        this.cord.active = !isLast;
        if(idx > 0){
            this.head.node.active = false;
        }else{
            this.head.node.active = true;
        }
        if(idx > 6){
            idx = idx % 7;
        }
        let cfg = this.config[idx];
        if(!cfg){return;}

        // let tex = cc.textureCache.addImage(cfg.board);
        // this.board.spriteFrame = new cc.SpriteFrame(tex);
        // tex = cc.textureCache.addImage(cfg.leaf);
        // this.leaf.spriteFrame = new cc.SpriteFrame(tex);
        // tex = cc.textureCache.addImage(cfg.vine);
        // this.vine.spriteFrame = new cc.SpriteFrame(tex);

        this.board.spriteFrame = cfg.board;
        //this.leaf.spriteFrame = cfg.leaf;
        this.vine.spriteFrame = cfg.vine;
    },

    setClickCallback(callback){
        this.clickHandler = callback;
    }
});
