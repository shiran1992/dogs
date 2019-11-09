const Letter = {
    1: 'A', 2: 'B', 3: 'C', 4: 'D', 5: 'E',
    6: 'F', 7: 'G', 8: 'H', 9: 'I', 10: 'J',
    11: 'K', 12: 'L', 13: 'M', 14: 'N', 15: 'O',
    16: 'P', 17: 'Q', 18: 'R', 19: 'S', 20: 'T',
    21: 'U', 22: 'V', 23: 'W', 24: 'X', 25: 'Y',
    26: 'Z'
};
cc.Class({
    extends: cc.Component,

    properties: {
        selected: cc.Node,//选中的背景
        unselect: cc.Node,//未选中的背景

        pkLetter: cc.Label,//选项A,B,C....
        pkItem: cc.Label, //选项内容
        pkItemNode: cc.Node, //选项内容

        blueLine: cc.Node,
        bbar: cc.Node,
        bdata: cc.Label,

        yellowLine: cc.Node,
        ybar: cc.Node,
        ydata: cc.Label,
    },

    ctor() {
        this.delay = 0;//动画开始延迟时间
        this.status = false; //选中状态
        this.option = {};
        this.type = 0;
    },

    start() {
        this.node.scale = 0.1;
        this.node.runAction(cc.sequence(cc.delayTime(this.delay), cc.scaleTo(0.2, 1.1, 1.1), cc.scaleTo(0.02, 1, 1)));
    },

    //初始化
    initView(obj = {}) {
        this.option = obj;
        let orderIndex = obj.orderIndex || 1;
        this.delay = (orderIndex - 1) * 0.1;
        let itemText = obj.content || "";
        this.type = obj.type;
        this.pkLetter.string = Letter[orderIndex];

        let temp = document.createElement("div");
        temp.innerHTML = itemText;
        let output = temp.innerText || temp.textContent;
        this.pkItem.string = output;
        //背景放大
        let h = this.pkItem.node.height + 100;
        this.node.height = h;
        this.selected.height = h;
        this.unselect.height = h;
    },

    //点击选项
    onClickOption() {
        let type = this.option.type;
        let questionScript = this.node.parent.getComponent('pkQuestion');
        //判断是否可以点击
        let able = questionScript.getOptionSelectable();
        if (able) {
            if (type == 1) { //多选题
                //this.changeOption();
                cc.log("暂时还没处理多选题");
            } else {
                this.selected.active = true;
                this.unselect.active = false;
                questionScript.doSelect(this.option);
            }
        }
    },

    //选中或者取消选项
    changeOption() {
        this.status = !this.status;
        if (this.status) {
            this.bg.active = false;
            this.xuanzhon.active = true;
        } else {
            this.bg.active = false;
            this.xuanzhon.active = true;
        }
    },

    //结果数据  
    showDataResult(item = {}) {
        //是否答案0:否,1:是
        if (item.isAnswer == 1) {
            this.blueLine.active = true;
            this.bdata.string = item.totalNum + "人" + " (" + (+item.proportion) + "%)";
            // 1s过度动画
            this.bbar.width = 0;

            this.timer = setInterval(() => {
                if (this.bbar.width >= +item.proportion * 2) {
                    clearInterval(this.timer);
                    this.timer = null;
                } else {
                    this.bbar.width += 4;
                }
            }, 20);
        } else {
            this.yellowLine.active = true;
            this.ydata.string = item.totalNum + "人" + " (" + (+item.proportion) + "%)";
            // 1s过度动画
            this.ybar.width = 0;

            this.timer = setInterval(() => {
                if (this.ybar.width >= +item.proportion * 2) {
                    clearInterval(this.timer);
                    this.timer = null;
                } else {
                    this.ybar.width += 4;
                }
            }, 20);
        }
    },

    onDestroy() {
        this.timer && clearInterval(this.timer);
        this.timer = null;
    }
});
