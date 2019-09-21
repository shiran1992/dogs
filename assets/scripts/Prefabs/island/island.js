
let Helper = require("Helper");
cc.Class({
    extends: cc.Component,

    properties: {
        touch: cc.Node,
        idx: cc.Label,
        light: cc.Sprite,
        arrow: cc.Sprite,
        cloud: cc.Sprite,
        idxImg: cc.Sprite,
        topIcon: cc.Node,
        collider: cc.PolygonCollider,
    },


    onLoad() {
        this.idx.node.active = false;
        this.idxImg.node.active = false;
        this.light.node.active = false;
        this.touch.on(cc.Node.EventType.TOUCH_START, (event) => {
            if (!this.isOpen) { return; }
            this.isMove = false;
            let touches = event.getTouches();
            let touchLoc = touches[0].getLocation();
            touchLoc = this.touch.convertToNodeSpaceAR(touchLoc);
            if (cc.Intersection.pointInPolygon(touchLoc, this.collider.points)) {
                this.isvalid = true;
                this.touch.runAction(cc.sequence(cc.delayTime(0.08), cc.scaleTo(0.1, 1.05)));
            } else {
                this.isvalid = false;

            }

            //this.touch.runAction(cc.sequence(cc.scaleTo(0.1,1.1),cc.scaleTo(0.15,0.9),cc.scaleTo(0.1,1.05),cc.scaleTo(0.1,1)));
        }, this);

        this.touch.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
            if (!this.isMove) {
                this.touch.stopAllActions();
                this.touch.setScale(1, 1);
                this.isMove = true;
            }
        }, this);

        this.touch.on(cc.Node.EventType.TOUCH_END, (event) => {
            // let touches = event.getTouches();
            // let starPoint = touches[0].getStartLocation();
            // let endPoint = touches[0].getLocation();
            if (!this.isOpen || !this.isvalid) { return; }
            Helper.playButtonMusic();
            this.touch.setScale(1.05, 1.05);
            this.touch.runAction(cc.sequence(cc.scaleTo(0.15, 0.97), cc.scaleTo(0.2, 1.02), cc.scaleTo(0.12, 1), cc.callFunc(() => {
                if (this.clickHandler) {
                    this.clickHandler(this.data);
                }
            })));
            //this.touch.runAction(cc.sequence(cc.scaleTo(0.1,1.1),cc.scaleTo(0.15,0.9),cc.scaleTo(0.1,1.05),cc.scaleTo(0.1,1)));

        }, this);

        this.touch.on(cc.Node.EventType.TOUCH_CANCEL, (event) => {
            //this.touch.runAction(cc.scaleTo(0.15,0.9),cc.scaleTo(0.1,1.05),cc.scaleTo(0.1,1));
        }, this);
    },

    setIndex(index, curIndex) {
        //this.idx.string = index;
        cc.loader.loadRes("num/num", cc.SpriteAtlas, (err, atlas) => {
            this.idxImg.node.active = true;
            var frame = atlas.getSpriteFrame(index + "");
            this.idxImg.spriteFrame = frame;
        });
        if (index > curIndex) {
            this.isOpen = false;
            this.cloud.node.active = true;
            if (index % 2 == 0) {
                this.cloud.node.x += cc.winSize.width;
                this.cloud.node.runAction(cc.sequence(cc.delayTime(0.8), cc.moveBy(0.8, cc.p(-cc.winSize.width, 0))));
            } else {
                this.cloud.node.x -= cc.winSize.width;
                this.cloud.node.runAction(cc.sequence(cc.delayTime(0.8), cc.moveBy(0.8, cc.p(cc.winSize.width, 0))));
            }

        } else {
            this.isOpen = true;
            this.cloud.node.active = false;
        }
    },

    setData(data) {
        this.data = cc.instantiate(data);
        let urserNode = this.node.getChildByName("islandUserItem");
        let headNode = urserNode.getChildByName("head");

        let nameLabel = headNode.getChildByName("userName").getComponent(cc.Label);
        if (data.challengerName) {
            nameLabel.string = data.challengerName;
        } else {
            nameLabel.string = '';
            let nameBg = headNode.getChildByName("bg");
            nameBg.active = false;
        }

        let headIcon = headNode.getChildByName("icon").getComponent(cc.Sprite);
        if (data.avatar) {
            Helper.loadHttpImg(headIcon, data.avatar);
        }

        let tipsLabel = urserNode.getChildByName("index").getChildByName("passTips").getComponent(cc.Label);
        if (data.passNum == 0) {
            tipsLabel.string = "无人闯关";
            this.topIcon.active = false;
        } else {
            tipsLabel.string = data.passNum + "人已闯关";
        }
    },

    setCallback(fun) {
        this.clickHandler = fun;
    },

    hideArrow() {
        this.arrow.node.active = false;
    },

    setOpenning() {
        this.light.node.active = true;
        this.light.node.setScale(2, 2);
        this.light.node.opacity = 0;
        //this.light.node.stopAllActions();
        //this.light.node.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(1,0.8),cc.scaleTo(0.15,2),cc.delayTime(0.15))));
        this.light.node.runAction(cc.repeatForever(cc.sequence(cc.fadeIn(0.3), cc.delayTime(0.1), cc.fadeOut(0.8), cc.delayTime(0.1))));
    },

});
