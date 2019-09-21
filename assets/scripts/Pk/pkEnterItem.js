const DataUtil = require("DataUtil");

const MAX_LIMIT_STRING = 17;

cc.Class({
    extends: cc.Component,

    properties: {
        line: cc.Sprite,
        bao: cc.Sprite,
        title: cc.Label,
        selectFrame: [cc.SpriteFrame],

        _itemData: null,//Item数据
        _index: 0, //列表中的位置
    },

    onLoad() { },

    //填充数据
    setData(data, index) {
        this._itemData = data;
        this._index = index;
        let imgIndex = this._index % 5;
        //后面的icon
        this.bao.spriteFrame = this.selectFrame[imgIndex];
        //标题
        this.title.string = (data.gameName.length > MAX_LIMIT_STRING) ?
            (data.gameName.substr(0, MAX_LIMIT_STRING) + "...") : data.gameName;
    },

    //点击Item
    onClickItem() {
        DataUtil.setPkStageId(this._itemData.stageId);

        cc.director.loadScene("PKWaiting");
    }
});
