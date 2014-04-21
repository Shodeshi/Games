//判断触摸点是否在图片的区域上
var Utils = new Object();
Utils.containsTouchLocation = function (touch, obj) {
//获取触摸点位置
    var getPoint = touch.getLocation();
    //获取图片区域尺寸
    var contentSize = obj.getContentSize();
    //判断点击是否在区域上
    var deltaX = Math.abs(getPoint.x - obj.getPosition().x);
    var deltaY = Math.abs(getPoint.y - obj.getPosition().y);
    return (deltaX <= contentSize.width / 2 && deltaY <= contentSize.height / 2);
}