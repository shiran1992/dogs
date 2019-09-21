let Helper = require("Helper");
cc.Class({
    extends: cc.Component,

    properties: {
        crown: cc.Sprite,
    },

    onLoad() {
        this.crown.node.active = false;
    },

    showCrown() {
        this.crown.node.active = true;
    },

    setData(data = {}) {
        let icon = this.node.getChildByName("icon").getComponent(cc.Sprite);
        Helper.loadHttpImg(icon, data.avatar);

        let name = this.node.getChildByName("name").getComponent(cc.Label);
        if (data.cName) {
            if (data.cName.length <= 4) {
                name.string = data.cName;
            } else {
                name.string = data.cName.substring(0,4);
            }
        }

    }
});
