let token = "";
let domain = "";
let domain2 = "";
let userId = null;
let userInfo = {};
let version = "1.0.1";
let bgMusic = null;

function setToken(t) {
    token = t;
}

function getToken() {
    return token;
}

function setDomain(d) {
    domain = d;
}

function getDomain() {
    return domain;
}

function setDomain2(r) {
    domain2 = r;
}

function getDomain2() {
    return domain2;
}

function setVersion(v) {
    version = v;
}

function getVersion() {
    return version;
}

function setUserId(id) {
    userId = id;
}

function getUserId() {
    return userId;
}

function setUserInfo(info) {
    userInfo = info;
}

function getUserInfo() {
    return userInfo;
}

function setMusicSwitch(isOn) {
    cc.sys.localStorage.setItem("musicOn", isOn);
}

function getMusicSwitch() {
    let musicIsOn = cc.sys.localStorage.getItem("musicOn");
    if (musicIsOn == "1" || musicIsOn == undefined || musicIsOn == "") {
        return true;
    } else {
        return false;
    }
}

//格式化时间
function dateFormat(fmt, date) {
    let o = {
        "M+": date.getMonth() + 1,                 //月份   
        "d+": date.getDate(),                    //日   
        "h+": date.getHours(),                   //小时   
        "m+": date.getMinutes(),                 //分   
        "s+": date.getSeconds(),                 //秒   
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
        "S": date.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

//加载网络图片
function loadHttpImg(sprite, url, config, num = 0) {
    if (!url) {
        return;
    }
    try {
        let times = num;//记录图片加载失败重试次数
        cc.loader.load({ url: url, type: "png" || "jpg" || "jpeg" }, (err, texture) => {
            if (!err) {
                if (config && config.type == 'zoom') {
                    let sw = sprite.node.width;

                    let iw = texture.width;
                    let ih = texture.height;
                    let il = ih / iw;

                    sprite.node.height = il * sw;
                } else if (config && config.type == 'display') {
                    let sw = sprite.node.width;

                    let iw = texture.width;
                    let ih = texture.height;
                    let il = ih / iw;

                    texture.width = sw;
                    texture.height = il * sw;
                    sprite.node.height = il * sw;
                } else if (config && config.type == 'limit') {
                    sprite.node.width = config.width;
                    sprite.node.height = config.width / texture.width * texture.height;
                }

                sprite.spriteFrame = new cc.SpriteFrame(texture);
            } else {
                if (times < 3) {
                    console.error("题目图片下载失败" + times, url);
                    times++;
                    this.loadHttpImg(sprite, url, config, times);
                }
            }
        });
    } catch (e) {

    }
}

const cKey1 = CryptoJS.enc.Utf8.parse('OWSFPAHHTNOZHLXC');
const cKey2 = CryptoJS.enc.Utf8.parse('#C9C9C9;#FF9900;');
//加密
function doEncryption(text) {
    let srcs = CryptoJS.enc.Utf8.parse(text);
    //第一轮加密
    let encrypted1 = CryptoJS.AES.encrypt(srcs, cKey1, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
    let word1 = encrypted1.toString();
    //第二轮加密
    let srcs1 = CryptoJS.enc.Utf8.parse(word1);
    let encrypted2 = CryptoJS.AES.encrypt(srcs1, cKey2, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
    return encrypted2.toString();
}

const cKey3 = CryptoJS.enc.Utf8.parse('ONCLICK:DISABLED');
//解密
function deEncryption(text) {
    let decrypted = CryptoJS.AES.decrypt(text, cKey3, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
    return decrypted.toString(CryptoJS.enc.Utf8);
}

//播放背景音乐
function palyBgMusic() {
    if (bgMusic == null) {
        bgMusic = cc.audioEngine.play("res/raw-assets/resources/audio/bgMusic.mp3", true, 0.5);
    }
}

//停止播放
function stopBgMusic() {

    if (bgMusic == null) return;
    cc.audioEngine.stop(bgMusic);
    bgMusic = null;
}

//点击按钮音效
function playButtonMusic() {
    if (getMusicSwitch()) {
        cc.audioEngine.play("res/raw-assets/resources/audio/button.mp3", false, 1);
    }
}

//答对音效
function playRightMusic() {
    if (getMusicSwitch()) {
        cc.audioEngine.play("res/raw-assets/resources/audio/right.mp3", false, 1);
    }
}

//答错音效
function playErrorMusic() {
    if (getMusicSwitch()) {
        cc.audioEngine.play("res/raw-assets/resources/audio/error.mp3", false, 1);
    }
}

//闯关成功音效
function playWinMusic() {
    if (getMusicSwitch()) {
        cc.audioEngine.play("res/raw-assets/resources/audio/win.mp3", false, 0.5);
    }
}

//闯关失败音效
function playFailMusic() {
    if (getMusicSwitch()) {
        cc.audioEngine.play("res/raw-assets/resources/audio/fail.mp3", false, 1);
    }
}

//云彩音效
function playCloudMusic() {
    if (getMusicSwitch()) {
        cc.audioEngine.play("res/raw-assets/resources/audio/cloud.mp3", false, 0.2);
    }
}

//账户结算音效
function playAccountMusic() {
    if (getMusicSwitch()) {
        cc.audioEngine.play("res/raw-assets/resources/audio/account.mp3", false, 0.5);
    }
}

//加载错误弹窗
function loadErrorPop() {
    cc.loader.loadRes("ErrorPop", function (err, prefab) { });
}

module.exports = {
    setToken,
    getToken,
    setDomain,
    getDomain,
    setDomain2,
    getDomain2,
    setVersion,
    getVersion,
    setUserId,
    getUserId,
    setUserInfo,
    getUserInfo,
    setMusicSwitch,
    getMusicSwitch,
    dateFormat,
    loadHttpImg,
    doEncryption,
    deEncryption,
    palyBgMusic,
    stopBgMusic,
    playButtonMusic,
    playRightMusic,
    playErrorMusic,
    playWinMusic,
    playFailMusic,
    playCloudMusic,
    playAccountMusic,
    loadErrorPop
};