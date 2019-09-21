cc.Class({
    extends: cc.Component,

    properties: {
       text: cc.Label
    },

    initView(obj = {}) {
        let pointName = obj.pointName || '';
        this.text.string = pointName;
    }
});
