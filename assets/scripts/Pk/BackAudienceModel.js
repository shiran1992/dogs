const DataUtil = require('DataUtil');

cc.Class({
    extends: cc.Component,

    properties: {

    },

    //点击取消
    onClickCancel() {
        this.node.destroy();
    },

    //点击确定
    onClickOK() {
        DataUtil.setRecords({eName: "退出观众模式", time: new Date(), data: null});
        cc.director.loadScene("Home", () => {
            let pkRoom = DataUtil.getPkRoom();
            WebIM.conn && WebIM.conn.quitChatRoom({
                roomId: pkRoom.chatRoomId, // 聊天室id
                success: function (m) {
                    WebIM.conn.close();
                    cc.log("##########################joinChatRoom m:" + m);
                },
                error: function () {
                    cc.log("##########################joinChatRoom error:");
                }
            });
        });
    },
});
