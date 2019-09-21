
function showMsgBox( msg, stayTime )
{
    let msgBox_ = cc.find("/Canvas/MessageBox");
    if ( null == msgBox_ )
    {
        return;
    }

    let label_ = msgBox_.getComponentInChildren(cc.RichText);
    if ( typeof(msg) != 'undefined' && null != label_ )
    {
        label_.string = msg;
    }

    if ( typeof(stayTime) == 'undefined' )
    {
        stayTime = 1.0;
    }
    msgBox_.setLocalZOrder(10000);
    msgBox_.active = true;
    msgBox_.runAction( cc.sequence( cc.fadeIn(0.3), cc.delayTime(stayTime), cc.fadeOut(0.3) ) );
}

module.exports = {
    show : showMsgBox
}