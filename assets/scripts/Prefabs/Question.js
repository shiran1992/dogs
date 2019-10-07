const Helper = require('Helper');
const DataUtil = require('DataUtil');
const QuestionType = ['singlechoice@2x', 'multiplechoice@2x', 'TrueorFalse@2x'];
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
        questionLabel: cc.RichText, //题目内容
        optionPrefab: cc.Prefab, //题目选项
        iBPrefab: cc.Prefab, //查看图片组件
        submitPrefab: cc.Prefab, //提交答案按钮
        resultPopPrefab: cc.Prefab, //选择答案之后的结果框
        resultHintPrefab: cc.Prefab, //回答问题之后下面的提示信息
    },

    ctor() {
        this.type = 0; //题目类型（单选0， 多选1， 判断2）
        this.index = 0; //第几题
        this.answers = [];  //本题的答案
        this.curSelect = 0; //用户选择项
        this.lastSelect = -1; //上一次选择
        this.options = [];  //本题的选项
        this.selects = []; //用户选择的答案
        this.startTime = ''; //开始时间
        this.endTime = ''; //结束时间
        this.flag = false; //是否已经答题
    },

    //创建题目
    initView(obj = {}) {
        //题目标题
        let question = obj.title || '';
        //题目类型
        this.type = obj.type || 0;
        //题目答案
        this.answers = [];
        //第几题
        this.index = obj.index || 0;

        var temp = document.createElement("div");
        temp.innerHTML = question;
        let output = temp.innerText || temp.textContent;

        let richText = "<img src='" + QuestionType[this.type] + "'/> " + output;
        this.questionLabel.string = richText;
        //判断是否需要显示图片
        if (obj.imageUrl) {
            let imgBrowser = cc.instantiate(this.iBPrefab);
            this.node.addChild(imgBrowser);
            let imgBrowserScript = imgBrowser.getComponent('QImage');
            imgBrowserScript.initView(obj.imageUrl);
        }
        //创建选项
        let options = obj.items || [];
        options.forEach((element, i) => {
            element.type = this.type;
            element.letter = Letter[element.orderIndex];
            if (element.isAnswer) {
                this.answers.push(element.letter);
            }
            let option = cc.instantiate(this.optionPrefab);
            this.node.addChild(option);
            this.options.push(option);
            let optionScript = option.getComponent('Option');
            optionScript.initView(element);
        });
        //创建提交按钮
        if (this.type == 1) {
            let submit = cc.instantiate(this.submitPrefab);
            this.node.addChild(submit);
            this.submit = submit;
        };
        //答案提示信息
        let resultHint = cc.instantiate(this.resultHintPrefab);
        this.node.addChild(resultHint);
        resultHint.opacity = 0;
        this.resultHint = resultHint;

        this.startTime = new Date().getTime();
    },

    //进行选择(单选，判断) 
    doSelect(obj = {}) {
        if (this.flag) {
            return;
        }
        this.selects = [obj];
        //提交答案
        this.doSubmit();
        this.curSelect = parseInt(obj.orderIndex, 10) - 1;
        let arr = [];
        if (this.lastSelect == -1) {
            arr = [this.curSelect];
        } else if (this.curSelect != this.lastSelect) {
            arr = [this.lastSelect, this.curSelect];
        }
        arr.forEach((element, i) => {
            let option = this.options[element];
            let optionScript = option.getComponent('Option');
            optionScript.changeOption();
        });
        this.lastSelect = this.curSelect;
    },

    //进行选择（多选）
    doMulSelect() {
        if (this.flag) {
            return;
        }
        if (this.submit) {
            this.submit.active = false;
        }
        this.selects = [];
        this.options.forEach((element, i) => {
            let optionScript = element.getComponent('Option');
            if (optionScript.status) {
                this.selects.push(optionScript.option);
            }
        });
        //提交答案
        this.doSubmit();
    },

    //选择答案之后，显示正确还是错误
    doSubmit() {
        if (this.flag) {
            return;
        }
        let curSubStage = DataUtil.getCurSubStage();
        //本轮答题用时
        let singleSeconds = curSubStage.singleSeconds || 60;
        this.flag = true;
        this.endTime = new Date().getTime();
        let gameScript = cc.find('Canvas').getComponent('Game');
        gameScript.hideBigImage();
        //关闭进度条
        gameScript.stopProgressBar();
        //滑到视图最下面(产品说不要这个效果)
        //gameScript.scrollToBottom();
        let arr = [];
        this.selects.forEach((element, i) => {
            arr.push(element.letter);
        });
        arr.sort();
        //选择答案的index的字符串形式
        let selectsStr = arr.join(',');

        this.answers.sort();
        //正确答案的index的字符串形式
        let answersStr = this.answers.join(',');

        //答题时间差
        let offTime = this.endTime - this.startTime;
        if (offTime > singleSeconds * 1000) {
            offTime = singleSeconds * 1000;
        }
        //答题情况对象
        let tag = { offTime: offTime };
        let obj = { type: 0, text: '哎呦~答错了' };
        if (selectsStr == answersStr) {//答对
            //Helper.playRightMusic();
            let flag = this.handleCorrect();
            if (flag == 0) {
                tag.brainValue = 5;
            } else if (flag == 1) {
                tag.brainValue = 15;//额外增加10个脑力值
            } else if (flag == 2) {
                tag.brainValue = 35;//额外增加30个脑力值
            }
            tag.state = true;
            obj = { type: 1, text: '恭喜你！答对啦', flag: flag };
        } else {//答错
            //Helper.playErrorMusic();
            tag.state = false;
            tag.brainValue = 0;
            obj = { type: 0, text: '哎呦~答错了', flag: -1 };
        }
        obj.index = this.index;
        DataUtil.setQuestionTag(this.index, tag);

        //显示弹窗
        let resultPop = cc.instantiate(this.resultPopPrefab);
        let gameNode = cc.find('Canvas');
        gameNode.addChild(resultPop);
        let resultPopScript = resultPop.getComponent('ResultPop');
        resultPopScript.initView(obj);

        //显示文字提示
        obj.answer = this.answers;
        this.resultHint.opacity = 255;
        let resultHintScript = this.resultHint.getComponent('ResultHint');
        resultHintScript.initView(obj);
    },

    //判断是几连击
    handleCorrect() {
        let questions = DataUtil.getQuestions();
        let flag = 0;//0正常答对；1二连击；2三连击 
        //判断前一题是否答对
        if (this.index - 1 >= 0) {
            let question = questions[this.index - 1];
            let tag = question.tag || {};
            //如果前一题答对，二连击
            if (tag.brainValue == 5) {
                flag = 1;
            } else if (tag.brainValue == 15) {
                flag = 2;
            } else if (tag.brainValue == 35) {
                flag = 0;
            }
        }

        return flag;
    }
});
