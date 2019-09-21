
cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    onLoad () {
        this.node.setScale(1,0);
        this.node.runAction(cc.sequence(cc.delayTime(0.6),
            cc.scaleTo(0.1,1),cc.scaleTo(0.08,1,0.7),cc.scaleTo(0.05,1)
        ))
    },

});
