cc.Class({
    extends: cc.Component,

    properties: {
        icon: cc.Sprite,
        letter: cc.Label,
        item: cc.Label,
        selectFrame: [cc.SpriteFrame],
        unselectFrame: [cc.SpriteFrame],
    },

    ctor() {
        this.status = false; //选中状态
        this.option = {};
        this.type = 0;
    },

    //初始化
    initView(obj = {}) {
        this.option = obj;
        let optionText = obj.letter || '';
        let itemText = obj.content || '';
        this.type = obj.type;

        this.letter.string = optionText;

        var temp = document.createElement("div"); 
        temp.innerHTML = itemText;
        let output = temp.innerText || temp.textContent; 
        this.item.string = output;
        
        this.icon.spriteFrame = this.unselectFrame[this.type];
        //将选项文字高度赋值
        this.node.height = this.item.node.height + 20;
    },

    //点击选项
    onClickOption() {
        let type = this.option.type;
        let questionScript = this.node.parent.getComponent('Question');
        if (type == 1) { //多选题
            this.changeOption();
        } else {
            questionScript.doSelect(this.option);
        }
    },

    //选中或者取消选项
    changeOption() {
        this.status = !this.status;
        if (this.status) {
            this.icon.spriteFrame = this.selectFrame[this.type];
            this.item.node.color = new cc.color(58, 208, 230, 255);
            this.letter.node.color = new cc.color(5, 61, 107, 255);
            this.changeOptionActive();
        } else {
            this.icon.spriteFrame = this.unselectFrame[this.type];
            this.item.node.color = new cc.color(255, 255, 255, 255);
            this.letter.node.color = new cc.color(254, 234, 185, 255);
        }
    },

    //切换点亮状态
    changeOptionActive() {
        if (this.type == 1) {//多选
            this.runMultActions();
        } else { //单选、判断
            this.runSingleActions();
        }
    },

    //单选、判断题点亮动画
    runSingleActions() {
        let scaleToIn = cc.scaleTo(0.2, 1.1, 1.1);
        let scaleToOut = cc.scaleTo(0.1, 1, 1);
        let actions = cc.sequence(scaleToIn, scaleToOut);
        this.icon.node.runAction(actions);
    },

    //多选题动画
    runMultActions() {
        let scaleToIn = cc.scaleTo(0.2, 1.1, 1.1);
        let scaleToOut = cc.scaleTo(0.1, 1, 1);
        let actions = cc.sequence(scaleToIn, scaleToOut);
        this.icon.node.runAction(actions);
    }
});
