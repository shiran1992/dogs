const Http = require('Http');
const Helper = require('Helper');
const DataUtil = require('DataUtil');
const PkDataUtil = require('PkDataUtil');
const MsgBox = require('MessageBox');

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    //点击提交
    onClickSubmit() {
        Helper.playButtonMusic();

        if ( typeof(WebIM) == 'undefined' ||  typeof(WebIM.conn) == 'undefined' || !WebIM.conn.isOpened() )
        {
            MsgBox.show( "正在连接服务器，请稍后!!!", 1.0 );
            return;
        }
        //关闭马上界面
        cc.log("#################################this.node.parent.active:"+this.node.parent.active);
        this.node.parent.active = false;
        let mashan =  this.node.parent;
        var  chatRoomId = DataUtil.getChatRoomId();
        WebIM.conn.joinChatRoom({
            roomId: chatRoomId, // 聊天室id
            success: function (m) {
                cc.log("##########################joinChatRoom m:"+m);
            },
            error: function(){
                cc.log("##########################joinChatRoom error:");
            }
        });
        
        //请求进入页面
        let join = mashan.parent.getChildByName('join');
        join.active = true;

        //cc.log("########################"+join);
        let joinScript = join.getComponent('join');
        joinScript.initView();
    }
});
