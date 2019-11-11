const Helper = require('Helper');
const DataUtil = require('DataUtil');
const Http = require('Http');
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
        questionTitle: cc.Prefab, //标题
        pkOptionPrefab: cc.Prefab, //题目选项
        pkIBPrefab: cc.Prefab, //查看图片组件
        submitPrefab: cc.Prefab,//实际占位置用的 
    },

    ctor() {
        this.question = null;//题目
        this.type = 0; //题目类型（单选0， 多选1， 判断2）
        this.index = 0;
        this.answers = [];  //本题的答案
        this.curSelect = 0; //用户选择项
        this.lastSelect = -1; //上一次选择
        this.options = [];  //本题的选项
        this.selects = []; //用户选择的答案
        this.optionIds = ''; //用户选择的答案Ids
        this.startTime = ''; //开始时间
        this.endTime = ''; //结束时间
        this.endTime = ''; //结束时间
        this.flag = false; //是否已经答题(true---已经选择过了   false---并没有选择)
    },

    //创建题目
    initView(obj = {}) {
        this.question = obj;
        //题目标题
        let title = obj.title || '';
        //题目类型
        this.type = obj.type || 0;
        //题目答案
        this.answers = [];
        //第几题
        this.index = obj.index || 0;
        if (title) {
            let titleNode = cc.instantiate(this.questionTitle);
            this.node.addChild(titleNode);
            let script = titleNode.getComponent("QuestionTitle");
            script.setData(this.question);
        }
        //判断是否需要显示图片
        if (obj.imageUrl) {
            let imgBrowser = cc.instantiate(this.pkIBPrefab);
            this.node.addChild(imgBrowser);
            let imgBrowserScript = imgBrowser.getComponent('PkQImage');
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
            let option = cc.instantiate(this.pkOptionPrefab);
            this.node.addChild(option);
            this.options.push(option);
            let optionScript = option.getComponent('PkOption');
            optionScript.initView(element);
        });

        let submit = cc.instantiate(this.submitPrefab);
        this.node.addChild(submit);

        this.startTime = new Date().getTime();
    },

    //获取选项是否还可以选择
    getOptionSelectable() {
        return !this.flag;
    },

    //设置该问题可不可以选择答案
    setSelectable(able) {
        this.flag = !able;
    },

    //显示对的和错的人数量的进度条
    showBarResult(result = {}) {
        let itemStatList = result.itemStatList || [];
        this.options.forEach((e, i) => {
            let optionScript = e.getComponent('PkOption');
            optionScript.showDataResult(itemStatList[i]);
        });
    },

    //进行选择(单选，判断) 
    doSelect(obj = {}) {
        if (this.flag) {
            return;
        }
        this.flag = true;
        this.selects = [obj];
        //提交答案
        this.doSubmit();
    },

    //选择答案之后，显示正确还是错误
    doSubmit() {
        cc.log("提交答案喽~");

        let arr = [];
        this.selects.forEach((element, i) => {
            element && element.letter && arr.push(element.letter);
        });
        arr.sort();
        //选择答案的index的字符串形式
        let selectsStr = arr.join(',');

        this.answers.sort();
        //正确答案的index的字符串形式
        let answersStr = this.answers.join(',');

        let pkRoom = DataUtil.getPkRoom();
        //本轮答题用时
        let singleSeconds = pkRoom.singleSeconds || 10;
        this.endTime = new Date().getTime();
        //答题时间差
        let offTime = this.endTime - this.startTime;
        if (offTime > singleSeconds * 1000) {
            offTime = singleSeconds * 1000;
        }

        //答题情况对象
        let obj = { type: 0, flag: 3, text: '哎呦~答错了' };
        if (selectsStr == answersStr) {//答对
            //Helper.playRightMusic();
            obj = { type: 1, text: '恭喜你！答对啦' };
        } else {//答错
            //Helper.playErrorMusic();
            obj = { type: 0, flag: 3, text: '哎呦~答错了' };
            //记录错题
            DataUtil.setErrQuestions(this.question);
        }
        obj.index = this.index;
        //设置答题结果
        DataUtil.setQuestionResult(obj);

        //提交数据
        let o = {
            questionId: this.question.id,
            itemId: this.selects[0].id,
            isRight: obj.type,
            startDate: this.startTime,
            submitDate: this.endTime,
            usedTime: offTime / 1000
        };
        //只有做出选择才提交数据
        this.selects[0].id && this.submitData(o);
    },

    //提交数据
    submitData(obj) {
        let stageId = DataUtil.getPkStageId();
        Http.getInstance().httpPost("pk/stage/" + stageId + "/submit", obj, { encryt: true }, (json) => {
            cc.log("提交答案：", json);
        });
    },

    //销毁掉
    doDestroy() {
        this.node.destroy();
    },
});
