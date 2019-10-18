let questions = [];
let startTime = '';
let endTime = '';

let curStageData = null;
let curSubStageData = null;
let allSubStageData = null;
let medalData = null;
let userData = null;
let switchLog = false;

let pkStageId = "";//首页对应item的id，很关键
let pkRoom = null;//房间数据
let pkJoin = null;//准备页数据
let errQuestions = [];//错题
let model = 0;//模式（0--正常模式   1--观众模式）
let joinStatus = 0;//0--正常加入   1--已经错过答题被淘汰   2--错题达到数量被淘汰  3--中途退出又进来可以正常答题的
let isLast = false;//是否是最后一题
let curQuestionResult = null;//本次答题结果
let records = [];//行为日志

/********************************************一期功能*********************************************/
//设置题库
function setQuestions(q) {
    questions = q;
}

//获取题库
function getQuestions() {
    return questions;
}

//设置游戏的开始时间
function setStartGameTime(time) {
    startTime = time;
}

//获取游戏的开始时间
function getStartGameTime() {
    return startTime;
}

//设置游戏的结束时间
function setEndGameTime(time) {
    endTime = time;
}

//获取游戏的结束时间
function getEndGameTime() {
    return endTime;
}

//设置每道题的回答情况
function setQuestionTag(index, obj = {}) {
    if (getQuestions().length) {
        getQuestions()[index].tag = obj;
    }
}

function setCurStage(data) {
    curStageData = data;
}

function getCurStage() {
    return curStageData;
}

function setCurSubStage(data) {
    curSubStageData = data;
}

function getCurSubStage() {
    return curSubStageData;
}

function setAllSubStage(data) {
    allSubStageData = data;
}

function getAllSubStage() {
    return allSubStageData;
}

function setMedalData(data) {
    medalData = data;
}

function getMedalData() {
    return medalData;
}

function setUserData(data) {
    userData = data;
}

function getUserData() {
    return userData;
}

/*********************************************二期功能************************************************/
//设置选择PK关卡的id
function setPkStageId(p) {
    pkStageId = p;
}

//获取选择PK关卡的id
function getPkStageId() {
    return pkStageId;
}

//设置pk赛room数据
function setPkRoom(p) {
    pkRoom = p;
}

//获取pk赛room数据
function getPkRoom() {
    return pkRoom;
}

//设置pk赛join数据
function setPkJoin(p) {
    pkJoin = p;
}

//获取pk赛join数据
function getPkJoin() {
    return pkJoin;
}

//清空错题数组
function clearErrQuestions() {
    errQuestions = [];
}

//记录错题
function setErrQuestions(question) {
    errQuestions.push(question);
}

//是否是最后一题
function setLastQuestion(flag) {
    isLast = flag;
}

//获取是否是最后一题
function getLastQuestion() {
    return isLast;
}

//获取错题
function getErrQuestions() {
    return errQuestions;
}

//设置模式
function setModel(m) {
    model = m;
}

//获取模式
function getModel() {
    return model;
}

//设置是否已经被淘汰
function setJoinStatus(f) {
    joinStatus = f;
}

//获取是否已经被淘汰
function getJoinStatus() {
    return joinStatus;
}

//设置本题的答题结果
function setQuestionResult(r) {
    curQuestionResult = r;
}

//获取本题的答题结果
function getQuestionResult() {
    return curQuestionResult;
}

//清空行为日志
function clearRecords() {
    records = [];
}

//记录行为日志
function setRecords(re) {
    records.push(re);
}

//获取行为日志
function getRecords() {
    return records;
}

module.exports = {
    setPkStageId,
    getPkStageId,
    setPkRoom,
    getPkRoom,
    setPkJoin,
    getPkJoin,
    clearErrQuestions,
    setErrQuestions,
    getErrQuestions,
    setModel,
    getModel,
    setJoinStatus,
    getJoinStatus,
    setLastQuestion,
    getLastQuestion,
    setQuestionResult,
    getQuestionResult,
    setRecords,
    getRecords,
    clearRecords,

    setQuestions,
    getQuestions,
    setStartGameTime,
    getStartGameTime,
    setEndGameTime,
    getEndGameTime,
    setQuestionTag,
    setCurStage,
    getCurStage,
    setCurSubStage,
    getCurSubStage,
    setAllSubStage,
    getAllSubStage,
    setMedalData,
    getMedalData,
    setUserData,
    getUserData,
    switchLog
};