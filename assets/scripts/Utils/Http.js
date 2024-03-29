const Helper = require("Helper");

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
        return "ucloud--cluster--AAAAALOs4rHBzFeKKuIqbwA1GyvaC81rV3km7E0OT3L_gGV36liTnRDJ6r5k_0es3zUrl8CSdLmE8ZnVOFX0xie0PebMnJOp48gxydp7rqeeSNhaF5ccQGVvnijTHWYTvtJp3nqrRwMqVcYV3IHjL_-3iNY";
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
        xhr.send(config.encryt ? Helper.doEncryption(pString) : pString);
    },
});

httpUtils.getInstance = function () {
    if (httpUtils.instance == null) {
        httpUtils.instance = new httpUtils();
    }
    return httpUtils.instance;
};
