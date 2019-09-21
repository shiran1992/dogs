const DataUtil = require('DataUtil');

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    //点击提交
    onClickSubmit() {
        //关闭马上界面
        cc.log("#################################this.node.parent.active:"+this.node.parent.active);
        this.node.parent.active = false;
        if (DataUtil.getChatRoomId()) {
            WebIM.conn.quitChatRoom({
                roomId:  DataUtil.getChatRoomId(), // 聊天室id
                success: function (m) {
                    cc.log("##########################joinChatRoom m:"+m);
                },
                error: function(){
                    cc.log("##########################joinChatRoom error:");
                }
            });
            DataUtil.setChatRoomId(null);
        }
        if (!WebIM.conn.isClosed()) {
            WebIM.conn.close();
        }
        DataUtil.setPkStage(null);
        cc.director.loadScene('Home', () => { });
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
