const DataUtil = require('DataUtil');
cc.Class({
    extends: cc.Component,

    properties: {
        background: cc.Node,
        errText: cc.Label,
        timeoutText: cc.Label,
    },

    ctor() {
        this.callBack = () => { };
    },

    initView(obj = {}) {
        this.errText.string = obj.message || '网络异常';
        this.createActions();
    },

    createActions() {
        this.background.y += (cc.winSize.height / 2 + 280);
        this.background.active = true;
        let action1 = cc.moveTo(0.4, cc.v2(0, -40)).easing(cc.easeQuarticActionIn());
        let action2 = cc.moveTo(0.1, cc.v2(0, 20)).easing(cc.easeQuarticActionOut());
        let action3 = cc.moveTo(0.05, cc.v2(0, 0)).easing(cc.easeQuarticActionIn());

        this.background.runAction(cc.sequence(action1, action2, action3));
    },

    //设置回调
    setCallBack(callBack) {
        this.callBack = callBack;
    },

    //点击背景
    onClickBg() {
        this.callBack();
    }
});
