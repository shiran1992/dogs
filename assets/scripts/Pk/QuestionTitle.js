cc.Class({
    extends: cc.Component,

    properties: {
        questionLabel: cc.RichText, //题目内容
    },

    ctor() {
        this.question = null;//题目
    },

    setData(question) {
        this.question = question || {};
        //题目标题
        let title = this.question.title || '';
        //题目标题
        // var temp = document.createElement("div");
        // temp.innerHTML = title;
        // let output = temp.innerText || temp.textContent;
        // let richText = "<img src='" + QuestionType[this.type] + "'/> <size=36><b>" + output + "<b/></size>";
        // this.questionLabel.string = richText;
        //可能暂时都是单选题
        this.questionLabel.string = title;
    }
});
