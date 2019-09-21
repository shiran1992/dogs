import { CLabelOverwrite } from "./LabelOverwrite";

const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(CLabelOverwrite)
export class CLabelShadow extends cc.Component {
    @property({
        tooltip: "描边颜色"
    })
    shadowColor = cc.color(0, 0, 0, 255);

    @property({
        tooltip: "偏移量"
    })
    shadowOffset = cc.p(0, -4);

    /** 阴影文字 */
    shadeLabel = null;

    /** 设置阴影颜色 */
    setColor(color) {
        this.shadowColor = color;
        this.refreshShadow();
    }
    /** 设置阴影偏移量 */
    setOffset(offset) {
        this.shadowOffset = offset;
        this.refreshShadow();
    }

    /** 更新阴影 */
    refreshShadow() {
        if (CC_JSB) {
            let label = this.node.getComponent(cc.Label);
            if (label) {
                label._sgNode.enableShadow(this.shadowColor, cc.size(this.shadowOffset.x, this.shadowOffset.y));
            }
        } else if (this.shadeLabel) {
            this.shadeLabel.node.color = this.shadowColor;
            this.shadeLabel.node.position = this.shadowOffset;
        }
    }

    onLoad() {
        this.node.on("updateNodeSize", () => {
            this.onLabelChange();
        });
        this.node.on("onEnable", () => {
            if (this.shadeLabel) {
                this.shadeLabel.node.active = true;
            }
        });
        this.node.on("onDisable", () => {
            if (this.shadeLabel) {
                this.shadeLabel.node.active = false;
            }
        });
    }

    onEnable() {
        let label = this.node.getComponent(cc.Label);
        if (label) {
            if (CC_JSB) {
                label._sgNode.enableShadow(this.shadowOffset, cc.size(this.shadowOffset.x, this.shadowOffset.y));
            } else {
                if (this.shadeLabel) {
                    this.shadeLabel.node.active = true;
                } else {
                    let node = new cc.Node();
                    this.shadeLabel = node.addComponent(cc.Label);
                    this.shadeLabel.node.on("onDestroy", () => { this.destroy(); })
                    this.node.addChild(node, -8, "LabelShadow");
                    this.onLabelChange();
                    this.refreshShadow();
                }
            }
        }
    }

    onDisable() {
        if (this.shadeLabel) {
            this.shadeLabel.node.active = false;
        }
    }

    /** 刷新阴影数据 */
    onLabelChange() {
        if (CC_JSB) {
            return;
        }

        let label = this.node.getComponent(cc.Label);
        if (label && this.shadeLabel) {
            this.shadeLabel.string = label.string;
            this.shadeLabel.horizontalAlign = label.horizontalAlign;
            this.shadeLabel.verticalAlign = label.verticalAlign;
            this.shadeLabel.fontSize = label.fontSize;
            this.shadeLabel.fontFamily = label.fontFamily;
            this.shadeLabel.lineHeight = label.lineHeight;
            this.shadeLabel.overflow = label.overflow;
            this.shadeLabel.enableWrapText = label.enableWrapText;
            this.shadeLabel.font = label.font;
            this.shadeLabel.isSystemFontUsed = label.isSystemFontUsed;
        }
    }
}