const DataUtil = require("DataUtil");

let mid = "";
let cb = null;
function setCallback(callback) {
    cb = callback;
}


//初始化WebIM
function initWebIM(callback) {
    cb = callback;
    WebIM.config = WebImConfig;
    let conn = WebIM.conn = new WebIM.connection({
        isHttpDNS: WebIM.config.isHttpDNS,
        isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
        https: WebIM.config.https,
        url: WebIM.config.xmppURL,
        isAutoLogin: true,
        heartBeatWait: WebIM.config.heartBeatWait,
        autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
        autoReconnectInterval: WebIM.config.autoReconnectInterval,
        isStropheLog: WebIM.config.isStropheLog,
        delivery: WebIM.config.delivery
    });
    /*
    如果isAutoLogin设置为false，那么必须手动设置上线，否则无法收消息
    手动上线指的是调用conn.setPresence(); 如果conn初始化时已将isAutoLogin设置为true
    则无需调用conn.setPresence();
    */
    conn.listen({
        //连接成功回调
        onOpened: function (message) {
            cc.log("###############################onOpened:", message);
            let pkRoom = DataUtil.getPkRoom();
            if (pkRoom.chatRoomId) {
                WebIM.conn.joinChatRoom({
                    roomId: pkRoom.chatRoomId, // 聊天室id
                    success: function () {
                        DataUtil.setRecords({ eName: "加入聊天室成功", time: new Date(), data: null });
                        cc.log("##########################joinChatRoom m:" + m);
                    },
                    error: function () {
                        cc.log("##########################joinChatRoom error:");
                    }
                });
            }
        },
        //连接关闭回调
        onClosed: function (message) {
            cc.log("###############################onClosed:", message);
        },
        //收到文本消息
        onTextMessage: function (message) {
            cc.log("###############################onTextMessage:", message);
            if (mid != message.id) {
                let stageId = DataUtil.getPkStageId();
                if (message.ext && message.ext.stageId == stageId) {
                    DataUtil.setRecords({eName: "环信消息", time: new Date(), data: message});
                    mid = message.id;
                    cb && cb(message);
                }
            }
        },
        onEmojiMessage: function (message) { },   //收到表情消息
        onPictureMessage: function (message) { }, //收到图片消息
        onCmdMessage: function (message) { },     //收到命令消息
        onAudioMessage: function (message) { },   //收到音频消息
        onLocationMessage: function (message) { },//收到位置消息
        onFileMessage: function (message) { },    //收到文件消息
        //收到视频消息
        onVideoMessage: function (message) {
            cc.log("###############################onVideoMessage:", message);
        },
        //处理“广播”或“发布-订阅”消息，如联系人订阅请求、处理群组、聊天室被踢解散等消息
        onPresence: function (message) {
            cc.log("#########################onPresence:", message);
        },
        //处理好友申请
        onRoster: function (message) {
            cc.log("#########################onRoster:", message);
        },
        //处理群组邀请
        onInviteMessage: function (message) {
            cc.log("#########################onInviteMessage:", message);
        },
        //本机网络连接成功
        onOnline: function () {
            cc.log("#########################onOnline:连接成功");
            let node = cc.find("Canvas");
            node.removeChildByTag("ERROR");
        },
        //本机网络掉线
        onOffline: function () {
            cc.log("#########################onOffline:本机网络掉线");
            cc.loader.loadRes("ErrorPop", function (err, prefab) {
                let errorPop = cc.instantiate(prefab);
                errorPop.setTag("ERROR");
                let errorPopScript = errorPop.getComponent('ErrorPop');
                errorPopScript.initView();
                errorPopScript.setCallBack(() => {
                    errorPop.destroy();
                    cc.director.loadScene('Home');
                });
                let node = cc.find("Canvas");
                node.addChild(errorPop);
            });
        },
        //失败回调
        onError: function (message) {
            cc.log("#########################onErr:", message);
        },
        //黑名单变动，查询黑名单，将好友拉黑，将好友从黑名单移除都会回调这个函数，list则是黑名单现有的所有好友信息
        onBlacklistUpdate: function (list) {
            cc.log("#########################onBlacklistUpdate:", list);
        },
        //收到消息送达服务器回执
        onReceivedMessage: function (message) {
            cc.log("#########################onReceivedMessage:", message);
        },
        //收到消息送达客户端回执
        onDeliveredMessage: function (message) {
            cc.log("#########################onDeliveredMessage:", message);
        },
        //收到消息已读回执
        onReadMessage: function (message) {
            cc.log("#########################onReadMessage:", message);
        },
        //创建群组成功回执（需调用createGroupNew）
        onCreateGroup: function (message) { },
        //如果用户在A群组被禁言，在A群发消息会走这个回调并且消息不会传递给群其它成员    
        onMutedMessage: function (message) { }
    });
}


module.exports = {
    initWebIM,
    setCallback
};
