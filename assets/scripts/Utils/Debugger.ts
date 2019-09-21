const { ccclass, property } = cc._decorator; // 从 cc._decorator 命名空间中引入 ccclass 和 property 两个装饰器

@ccclass // 使用装饰器声明 CCClass
export default class Debugger extends cc.Component { // ES6 Class 声明语法，继承 cc.Component

    @property(cc.Boolean)           // 使用 property 装饰器声明属性，括号里是属性类型，装饰器里的类型声明主要用于编辑器展示
    recordMode: boolean = false;    // 这里是 TypeScript 用来声明变量类型的写法，冒号后面是属性类型，等号后面是默认值

    fnMsgCb: Function = null;
    fnMsgTarget: any = null;
    fnRecordCb: Function = null;
    fnRecordTarget: any = null;


    @property(cc.Toggle)
    toggleShrink: cc.Toggle = null;

    @property(cc.EditBox)
    editText: cc.EditBox = null;

    @property(cc.Button)
    btnRequest: cc.Button = null;

    @property(cc.Button)
    btnMessage: cc.Button = null;

    @property(cc.Button)
    btnNextMessage: cc.Button = null;
    @property(cc.Button)
    btnPreMessage: cc.Button = null;

    @property(cc.Toggle)
    toggleRecord: cc.Toggle = null;

    @property(cc.Node)
    panelDebuger: cc.Node = null;

    @property(cc.Node)
    logView: cc.Node = null;
    @property(cc.Label)
    logText: cc.Label = null;

    @property(cc.Button)
    btnViewLog: cc.Button = null;
    @property(cc.Button)
    btnCleanLog: cc.Button = null;

    // 也可以使用完整属性定义格式
    @property({
        visible: false
    })

    requests: object = {};
    messages: object[] = [];
    curIndex: number = 0;

    logs: string[] = [];
    showLog: boolean = false;

    // 成员方法
    onLoad() {
        Debugger.sInst = this;
        this.loadData();

        cc.game.addPersistRootNode(this.node);
        // 绑定回调函数
        this.toggleShrink.node.on("toggle", (event: cc.Event.EventCustom) => {
            if (this.toggleShrink.isChecked) {
                this.panelDebuger.active = true;
            }
            else {
                this.panelDebuger.active = false;
            }
        }, this);
        this.btnRequest.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventCustom) => {
            let url: string = this.editText.string;
            if (url.trim() != "") {
                this.execRequest(url.trim());
            }
        }, this);
        this.btnMessage.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventCustom) => {
            let key: string = this.editText.string;
            if (key.trim() != "") {
                let index: number = parseInt(key, 10);
                this.execMessage(index);
            }
        }, this);
        this.btnPreMessage.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventCustom) => {
            this.execPreMessage();
        }, this);
        this.btnNextMessage.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventCustom) => {
            this.execNextMessage();
        }, this);
        this.toggleRecord.node.on("toggle", (event: cc.Event.EventCustom) => {
            if (this.toggleRecord.isChecked) {
                this.recordMode = true;
                this.messages = [];
                this.requests = {};
            }
            else {
                this.recordMode = false;
                this.saveData();
            }
        }, this);

        this.btnViewLog.node.on(cc.Node.EventType.TOUCH_END, (event) => {
            if (this.showLog) {
                this.logView.active = false;
                this.logText.string = "";
            }
            else {
                this.logView.active = true;
                this.logText.string = this.logs.join("\n");
            }
            this.showLog = !this.showLog;
        });
        this.btnCleanLog.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventCustom) => {
            this.logs = [];
            this.logText.string = "";
        }, this);
    }

    onDestroy() {
        if (this.recordMode) {
            Debugger.sInst = null;
            this.saveData();
        }
    }

    start() {
        this.showLog = false;
        this.logView.active = false;
    }

    update() {

    }

    pushRequest(key: string, response: object) {
        this.requests[key] = response;
    }

    pushMessage(msg: object) {
        this.messages.push(msg);
    }

    execRequest(key: string) {
        let req = this.requests[key];
        if (typeof (req) != 'undefined' && null != this.fnRecordCb) {
            if (null == this.fnRecordTarget) {
                this.fnRecordCb(key, req);
            }
            else {
                this.fnRecordCb.call(this.fnRecordTarget, key, req);
            }
            return true;
        }
        return false;
    }

    execMessage(index: number) {
        if (typeof (index) == null || typeof (index) == 'undefined') {
            index = 1;
        }
        else {
            index = index - 1;
        }

        if (index > this.messages.length) {
            index = this.messages.length - 1;
        }
        else if (index < 0) {
            index = 0;
        }

        if (index < this.messages.length) {
            let msg = this.messages[index];
            this.curIndex = index;
            if (null != this.fnMsgCb) {
                if (null != this.fnMsgTarget) {
                    this.fnMsgCb.call(this.fnMsgTarget, msg);
                }
                else {
                    this.fnMsgCb(msg);
                }
            }
        }
    }

    execNextMessage() {
        // 下标从1开始
        this.execMessage(this.curIndex + 2);
    }

    execPreMessage() {
        // 下标从1开始
        this.execMessage(this.curIndex);
    }

    private loadData() {
        this.requests = JSON.parse(cc.sys.localStorage.getItem('debugger-requests', JSON.stringify(this.requests)));
        this.messages = JSON.parse(cc.sys.localStorage.getItem("debugger-messages", JSON.stringify(this.messages)));

        this.requests = this.requests || {};
        this.messages = this.messages || [];
    }
    private saveData() {
        cc.sys.localStorage.setItem('debugger-requests', JSON.stringify(this.requests));
        cc.sys.localStorage.setItem("debugger-messages", JSON.stringify(this.messages));
    }

    pushLog(msg: string) {
        this.logs.push(msg);
    }

    // 静态方法
    private static sInst: Debugger = null;
    static recordRequest(key: string, response: object) {
        if (null != Debugger.sInst) {
            Debugger.sInst.pushRequest(key, response);
        }
    }
    static recordMessage(msg: object) {
        if (null != Debugger.sInst) {
            Debugger.sInst.pushMessage(msg);
        }
    }
    static setMessageCB(cb: Function, target: any) {
        if (null != Debugger.sInst) {
            Debugger.sInst.fnMsgCb = cb;
            Debugger.sInst.fnMsgTarget = target;
        }
    }
    static setRequestCB(cb: Function, target: any) {
        if (null != Debugger.sInst) {
            Debugger.sInst.fnRecordCb = cb;
            Debugger.sInst.fnRecordTarget = target;
        }
    }

    static log(msg: string) {
        if (null != Debugger.sInst) {
            Debugger.sInst.pushLog(msg);
        }

        cc.log(msg);
    }
}

module.exports = {
    default: Debugger,
    recordRequest: Debugger.recordRequest,
    recordMessage: Debugger.recordMessage,
    setMessageCB: Debugger.setMessageCB,
    setRequestCB: Debugger.setRequestCB,
    log: Debugger.log,
}