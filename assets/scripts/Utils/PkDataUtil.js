let pkQuestion = null;
let optionIds = null;
let pkRank = null;
let whoInPkGameDesc = null;
let join = null;
let differTime = 0;
let joinCount = 0;//PK参加页面计算器
let allDie = false;//当前题库是否全军覆灭
let curQuestion = null; //当前题库节点
let curBar = null;//当前倒计时
let tongji = null;
let flag = false;//是否已经答题1
let curtimudaodaTime = null;//当前题目到达时间
let pkEnterItemCount = 0; //答题大赛题目数计数
let join10Count = 1; //PK参加页面10分钟计数器
let join3Count = 1; //PK参加页面3秒计数器
let joinData = null; //PK参加页面数据
let isDati = false;//是否答题2
let sanMiaoCount = 3;//三秒倒计时
let ershicijishu = 0;//重连20次计数
// 服务器时间与本地时差
let severDiffTime = 0;
// 记录游戏开始时间
let gameStartTime = 0;

function setErshicijishu(data) {
    ershicijishu = data;
}

function getErshicijishu() {
    return ershicijishu;
}

function setCurtimudaodaTime(data) {
    curtimudaodaTime = data;
}

function getCurtimudaodaTime() {
    return curtimudaodaTime;
}

function setSanMiaoCount(data) {
    sanMiaoCount = data;
}

function getSanMiaoCount() {
    return sanMiaoCount;
}

function setIsDati(data) {
    isDati = data;
}

function getIsDati() {
    return isDati;
}

function setFlag(data) {
    flag = data;
}

function getFlag() {
    return flag;
}

function setTongji(data) {
    tongji = data;
}

function getTongji() {
    return tongji;
}

function setCurBar(data) {
    curBar = data;
}

function getCurBar() {
    return curBar;
}

function setJoinData(data) {
    joinData = data;
}

function getJoinData() {
    return joinData;
}

function setJoin3Count(data) {
    join3Count = data;
}

function getJoin3Count() {
    return join3Count;
}

function setJoin10Count(data) {
    join10Count = data;
}

function getJoin10Count() {
    return join10Count;
}

function setPkEnterItemCount(data) {
    pkEnterItemCount = data;
}

function getPkEnterItemCount() {
    return pkEnterItemCount;
}

function setCurQuestion(data) {
    curQuestion = data;
}

function getCurQuestion() {
    return curQuestion;
}

function setAllDie(data) {
    allDie = data;
}

function getAllDie() {
    return allDie;
}

function setJoinCount(data) {
    joinCount = data;
}

function getJoinCount() {
    return joinCount;
}

function initDifferTime(srvTime, startTime) {
    gameStartTime = startTime;
    severDiffTime = Date.now() - srvTime;

    differTime = (gameStartTime - srvTime) / 1000;
}

function calcDifferTime() {
    let srvTime = Date.now() - severDiffTime;
    differTime = (gameStartTime - srvTime) / 1000;
}

function elapseDifferTime(v) {
    if (v == null || v == 'undefined') {
        v = 1;
    }

    if (null != differTime) {
        differTime -= 1;
    }
}

function getDifferTime() {
    return differTime;
}

function setJoin(data) {
    join = data;
}

function getJoin() {
    return join;
}

function setWhoInPkGameDesc(data) {
    whoInPkGameDesc = data;
}

function getWhoInPkGameDesc() {
    return whoInPkGameDesc;
}

function setPkRank(data) {
    pkRank = data;
}

function getPkRank() {
    return pkRank;
}

function setPkQuestion(data) {
    pkQuestion = data;
}

function getPkQuestion() {
    return pkQuestion;
}

function setOptionIds(data) {
    optionIds = data;
}

function getOptionIds() {
    return optionIds;
}

module.exports = {
    setErshicijishu,
    getErshicijishu,
    setCurtimudaodaTime,
    getCurtimudaodaTime,
    setSanMiaoCount,
    getSanMiaoCount,
    setIsDati,
    getIsDati,
    setFlag,
    getFlag,
    setTongji,
    getTongji,
    setJoinData,
    getJoinData,
    setJoin3Count,
    getJoin3Count,
    setJoin10Count,
    getJoin10Count,
    setPkEnterItemCount,
    getPkEnterItemCount,
    setCurQuestion,
    getCurQuestion,
    setAllDie,
    getAllDie,
    setJoinCount,
    getJoinCount,
    initDifferTime,
    calcDifferTime,
    elapseDifferTime,
    getDifferTime,
    setJoin,
    getJoin,
    setWhoInPkGameDesc,
    getWhoInPkGameDesc,
    setPkRank,
    getPkRank,
    setPkQuestion,
    getPkQuestion,
    setOptionIds,
    getOptionIds,
    setCurBar,
    getCurBar
};