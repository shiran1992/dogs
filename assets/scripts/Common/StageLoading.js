
cc.Class({
    extends: cc.Component,

    properties: {
        barBg: cc.Sprite,
        progress: cc.ProgressBar,
        head: cc.Node
    },

    onLoad () {
        this.isPreLoadScene = false;
        this.progress.progress = 0;
        if(this.preSceneName && this.preSceneName != ""){
            cc.director.preloadScene(this.preSceneName,()=>{
                this.isPreLoadScene = true;
            })
        }

        this.barBg.node.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(1,0.9),cc.scaleTo(1,1.01))));
    },

    setPreLoadScene(sceneName) {
        this.preSceneName = sceneName;
    },

    setAvatar(avatar){
        let headIcon = this.head.getChildByName("headIcon").getComponent(cc.Sprite);
        require("Helper").loadHttpImg(headIcon,avatar);
    },

    update (dt) {
        if(this.preSceneName){
            if(this.isPreLoadScene && this.progress.progress > 0.85){
                this.progress.progress += 0.02;
            }else{
                if(this.progress.progress < 0.3){
                    this.progress.progress += 0.005;
                }else if(this.progress.progress < 0.85){
                    this.progress.progress += 0.01;
                }
            }
        }else{
            if(this.progress.progress < 0.3){
                this.progress.progress += 0.005;
            }else if(this.progress.progress < 0.85){
                this.progress.progress += 0.01;
            }else{
                this.progress.progress += 0.02;
            }
        }

        if(this.progress.progress >= 1){
            if(this.preSceneName){
                cc.director.loadScene(this.preSceneName,()=>{})
            }else{
                this.node.destroy();
            }
        }
    },
});
