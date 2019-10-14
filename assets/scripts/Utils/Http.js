const Helper = require("Helper");
const DataUtil = require("DataUtil");
const Debugger = require('Debugger');

let httpUtils = cc.Class({
    extends: cc.Component,

    statics: {
        instance: null
    },

    ctor() {
        //测试环境
        this.domain = Helper.getDomain();
    },

    //获取缓存Token
    getLocalToken: function () {
        //return "ucloud--cluster--AAAAAKuTbWtNrfpA2QFK-4gii1rY9s9QJBzVcjgbMqFNBIVWI2r90-yMX4kFGmN71jOrvd9OapAVC7sxrp9p7Ns-NGBnVw8rnFIBa_5f0N4_AlAvd5367M7iqxEQu06XEMdMcEqjyPB3ykc7mmRKhW5XL58";
        let t = cc.sys.localStorage.getItem("token");
        if (!t) {
            this.goBackLogin();

            return '';
        }
        return t;
    },

    //返回登录页
    goBackLogin() {
        cc.sys.localStorage.setItem('returnUrl', '/g2');
        window.location.href = '/#login';
    },

    httpGet: function (url, callback) {
        let token = this.getLocalToken();
        let xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                //401直接返回登录界面
                if (xhr.status == 401) {
                    this.goBackLogin();
                    return;
                }
                let json = {};
                let respone = {};
                if (xhr.status == 400) {
                    if (xhr.response) {
                        respone = JSON.parse(xhr.response);
                        json.code = xhr.status || -1;
                        json.message = respone.error.message;
                    }
                } else if (xhr.status >= 200 && xhr.status < 300) {
                    respone = JSON.parse(xhr.response);
                    json.code = 0;
                    json.data = respone;
                } else {
                    //服务器异常
                    if (xhr.status == 404) {
                        json.code = 404;
                        json.message = '服务器未响应，请稍后再试。';
                    } else if (xhr.status == 0) {//本地网络断了
                        json.code = xhr.status || -1;
                        json.message = '您的网络开小差了，请稍后再试。';
                    } else {
                        respone = JSON.parse(xhr.response);
                        let error = respone.error || {};
                        json.message = error.message || '网络异常';
                        json.code = xhr.status || -1;
                    }
                }
                callback && callback(json);
            }
        };
        url = this.domain + url;
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Token", token);
        xhr.timeout = 10000;
        xhr.send();
    },

    httpPost: function (url, param, config, callback) {
        let token = this.getLocalToken();
        config = config || {};
        let xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                //401直接返回登录界面
                if (xhr.status == 401) {
                    this.goBackLogin();
                    return;
                }
                let json = {};
                let respone = {};
                if (xhr.status >= 200 && xhr.status < 300) {
                    if (xhr.response) {

                        respone = JSON.parse(xhr.response);
                    }
                    json.code = 0;
                    json.data = respone;
                } else {
                    //服务器异常
                    if (xhr.status == 404) {
                        json.code = 404;
                        json.message = '服务器未响应，请稍后再试。';
                    } else if (xhr.status == 0) {//本地网络断了
                        json.code = xhr.status || -1;
                        json.message = '您的网络开小差了，请稍后再试。';
                    } else {
                        respone = JSON.parse(xhr.response);
                        let error = respone.error || {};
                        json.message = error.message || '网络异常';
                        json.code = xhr.status || -1;
                    }
                }

                callback && callback(json);
            }
        };
        url = this.domain + url;
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Token", token);
        xhr.setRequestHeader("content-Type", "application/json");
        xhr.timeout = 10000;
        let pString = JSON.stringify(param);
        xhr.send(this.doEncryption(pString));
    },

    //加密
    doEncryption(word) {
        let key1 = 'OWSFPAHHTNOZHLXC';
        let key2 = '#C9C9C9;#FF9900;';
        let cKey1 = CryptoJS.enc.Utf8.parse(key1);
        let cKey2 = CryptoJS.enc.Utf8.parse(key2);
        let srcs = CryptoJS.enc.Utf8.parse(word);
        //第一轮加密
        let encrypted1 = CryptoJS.AES.encrypt(srcs, cKey1, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
        let word1 = encrypted1.toString();
        //第二轮加密
        let srcs1 = CryptoJS.enc.Utf8.parse(word1);
        let encrypted2 = CryptoJS.AES.encrypt(srcs1, cKey2, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
        return encrypted2.toString();
    },
});

httpUtils.getInstance = function () {
    if (httpUtils.instance == null) {
        httpUtils.instance = new httpUtils();
    }
    return httpUtils.instance;
};
