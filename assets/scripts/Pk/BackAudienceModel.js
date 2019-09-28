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
        cc.director.loadScene("Home", () => {
            let pkRoom = DataUtil.getPkRoom();
            WebIM.conn && WebIM.conn.quitChatRoom({
                roomId: pkRoom.chatRoomId, // 聊天室id
                success: function (m) {
                    cc.log("##########################joinChatRoom m:" + m);
                },
                error: function () {
                    cc.log("##########################joinChatRoom error:");
                }
            });

            WebIM.conn.close();
        });
    },
});
