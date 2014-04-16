var Chessboard = cc.Sprite.extend({
    ctor:function () {
        this._super();
        this.initWithFile(s_Chessborad);
        cc.registerTargetedDelegate(1, true, this);
    },
    //判断触摸点是否在图片的区域上
    containsTouchLocation:function (touch) {
        //获取触摸点位置
        var getPoint = touch.getLocation();
        //获取图片区域尺寸
        var contentSize  =  this.getContentSize();
//        定义拖拽的区域
//        var myRect = cc.Rect(this.getPosition().x-this.getContentSize().width/2, this.getPosition().y-this.getContentSize().height/2, contentSize.width, contentSize.height);
//        myRect.origin.x += this.getPosition().x-this.getContentSize().width/2;
//        myRect.origin.y += this.getPosition().y-this.getContentSize().height/2;
        //判断点击是否在区域上
        var deltaX = Math.abs(getPoint.x - this.getPosition().x);
        var deltaY = Math.abs(getPoint.y - this.getPosition().y);
        
        return (deltaX <= contentSize.width/2 && deltaY <= contentSize.height/2);
    },
    onTouchBegan:function (touch, event) {
        return this.containsTouchLocation(touch);
    },
    onTouchEnded:function (touch, event) {
        cc.log("Move end ahahah");
    },
    onTouchMoved: function(touch, event) {
        cc.log("Moving ahahahha");
    }
});

