cc.Class({
    extends: cc.Component,

    properties: {
        progressBar: cc.ProgressBar,

        full : 0,
        setp : 1,
        value : 0,
    },



    onLoad() {
        
    },

    onEnable()
    {
        if ( this.full > 0 )
        {
            this.startProgress();
        }
    },

    onDisable()
    {
        this.stopProgress();
    },

    startProgress()
    {
        if ( null != this.progressBar )
        {
            this.progressBar.progress = 0;
            this.value = 0;
            this.schedule( this.onStep, 1.0 );
            return true;
        }
        return false;
    },

    stopProgress()
    {
        this.unschedule( this.onStep, this );
    },

    onStep()
    {
        if ( this.full <= 0 || this.value >= this.full )
        {
            this.progressBar.progress = 1;
            this.stopProgress();
            return;
        }

        this.value += this.setp;
        this.progressBar.progress = this.value / this.full;
    }
});
