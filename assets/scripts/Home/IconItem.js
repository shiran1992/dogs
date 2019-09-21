let Helper = require("Helper");
cc.Class({
    extends: cc.Component,

    properties: {
        light: cc.Sprite
    },

    onLoad () {
        this.light.node.setScale(0,0);
        this.light.node.opacity = 0;
        this.node.on(cc.Node.EventType.TOUCH_START,(event)=>{
            if(this.swallowTouch){return}
            this.light.node.runAction(cc.spawn(cc.scaleTo(0.1,1),cc.fadeIn(0.06)));
            Helper.playButtonMusic();
        },this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE,(event)=>{

        },this);

        this.node.on(cc.Node.EventType.TOUCH_END,(event)=>{
            if(this.swallowTouch){return}

            this.light.node.stopAllActions();
            this.light.node.setScale(1,1);
            this.light.node.runAction(cc.sequence(cc.delayTime(0.33),cc.spawn(cc.scaleTo(0.1,0),cc.fadeOut(0.06)),cc.callFunc(()=>{
                if(this.clickHandler){
                    this.clickHandler();
                }
            })));
        },this);

        this.node.on(cc.Node.EventType.TOUCH_CANCEL,(event)=>{
            if(this.swallowTouch){return}

            this.light.node.runAction(cc.spawn(cc.scaleTo(0.1,0),cc.fadeOut(0.06)));
        },this);
    },

    setClickCallback(callback,swallowTouch){
        this.clickHandler = callback;
        this.swallowTouch = swallowTouch;
    }
    
});
