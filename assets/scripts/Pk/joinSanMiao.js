const Http = require('Http');
const Helper = require('Helper');
const DataUtil = require('DataUtil');
const PkDataUtil = require('PkDataUtil');

cc.Class({
    extends: cc.Component,

    properties: {
        title2: cc.Node,
        sanmiao: cc.Node,
        renshu2: cc.Node,
        renlist2: cc.Node,
        headPrefab: cc.Prefab, //实例人员头像

    },
    onLoad: function () {
        let msgStr = "";
        let msgData = "";
        this.schedule(this.updateData,1);  
    },
    showDate(str,data){
        this.msgStr = str;
        this.msgData = data;

        let json = PkDataUtil.getJoinData(json); 
                //标题
                let t = this.title2.getComponent(cc.Label);
                if (json.data.name.length >= 22) {
                    t.string = json.data.name.substr(0, 21)+"...";
                }else{
                    t.string = json.data.name;
                }
                //多少人在等待
                let r = this.renshu2.getComponent(cc.Label);
                r.string = json.data.waitUserCount+"人在等待";
                //清除人员头像下的所有节点
                this.renlist2.removeAllChildren();
                //等待人员头像
                if (json.data.userList) {
                    let flipTime = 1;
                    json.data.userList.forEach((element, i) => {
                            let headNode = cc.instantiate(this.headPrefab);
                            let headNodeScript = headNode.getComponent("PkHeadNode")
                            headNodeScript.initView(element.avatar, flipTime * i);
                            headNode.parent = this.renlist2;
                        });
                }
        
    },
    updateData: function () {  
        let num = PkDataUtil.getSanMiaoCount() - 1;
        PkDataUtil.setSanMiaoCount(num);
        let sanmiaoScript = this.sanmiao.getComponent(cc.Label);
        if ( num > 0 )
        {
            sanmiaoScript.string = num;
        }
        else if ( num == 0 )
        {
            sanmiaoScript.string = "GO";
        }
        //倒计时结束，调用显示题目
        else {
            sanmiaoScript.string = "";
            this.unschedule( this.updateData, this );

            PkDataUtil.setSanMiaoCount(3);
            let pkScript = cc.find('Canvas').getComponent('Pk');
            pkScript.showDijiti(this.msgStr,this.msgData);
        }
    }
        
});
        