cc.Class({
    extends: cc.Component,

    properties: {
        hint: cc.Label,
        answer: cc.Label,
    },

    onLoad() {
        this.initView();
    },

    initView(obj = {}) {
        let { type, answer = [] } = obj;
        if (type) { //回答正确
            this.hint.string = '答对啦';
            this.answer.string = '';
        } else {
            this.hint.string = '答错了';
            this.answer.string = '答案：' + answer.join(',');
        }
    }
});
