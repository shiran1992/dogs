cc.Class({
    extends: cc.Component,

    properties: {
        title: cc.Label
    },

    ctor() {
        this._callback = null;
        this._timer = null;
    },

    //-1表示最后一道题
    initView(text) {
        this.title.string = text;
    },

    //回调函数、延迟时间（0--没有时间）
    setCallback(cb, time) {
        if (cb && time) {
            this._callback = cb;
            this._timer = setTimeout(()=>{
                this._callback && this._callback();
            }, time)
        }
    },

    doDestroy() {
        this.node.destroy();
        this._timer && clearTimeout(this._timer);
        this._timer = null;
    }
});
