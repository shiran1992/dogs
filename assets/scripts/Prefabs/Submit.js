cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    //点击提交
    onClickSubmit() {
        let questionScript = this.node.parent.getComponent('Question');
        questionScript.doMulSelect();
    }
});
