var Game = cc.Layer.extend({
    chessboard: null,
    //已下棋子
    chessArr: null,
    /*
     * 棋盘上所有位置, 初始值:
     * /|\ 000
     *  |  000
     *  |  000
     *  +---------->
     */
    boardArr: null,
    directionArr: null,
    ctor: function() {
        this._super();
        this.init();
    },
    init: function() {
        var bRet = false;
        if (this._super()) {
            //获取游戏大小
            var size = cc.Director.getInstance().getWinSize();

            //背景层
            var layer = cc.LayerColor.create(new cc.Color4B(128, 128, 128, 255), size.width, size.height);
            this.addChild(layer);

            //棋盘
            chessboard = cc.Sprite.create(s_Chessborad);
            chessboard.setPosition(size.width / 2, size.height / 2);
            this.addChild(chessboard);

            //初始化棋子数组
            chessArr = new Array();
            boardArr = new Array();
            for (var i = 0; i < 3; i++) {
                boardArr[i] = new Array();
                for (var j = 0; j < 3; j++)
                    boardArr[i][j] = 0;
            }
            directionArr = new Array([1, 0, -1, 0], [1, 1, -1, -1], [0, 1, 0, -1], [-1, 1, 1, -1]);

            //注册touch事件
            cc.registerTargetedDelegate(1, true, this);

            bRet = true;
        }
        return bRet;
    },
    //判断触摸点是否在图片的区域上
    containsTouchLocation: function(touch, obj) {
        //获取触摸点位置
        var getPoint = touch.getLocation();
        //获取图片区域尺寸
        var contentSize = obj.getContentSize();
        //判断点击是否在区域上
        var deltaX = Math.abs(getPoint.x - obj.getPosition().x);
        var deltaY = Math.abs(getPoint.y - obj.getPosition().y);

        return (deltaX <= contentSize.width / 2 && deltaY <= contentSize.height / 2);
    },
    //获取触摸点在棋盘上的位置
    getTouchBoardPosition: function(touch) {
        var contentSize = chessboard.getContentSize();
        var startX = chessboard.getPosition().x - contentSize.width / 2;
        var startY = chessboard.getPosition().y - contentSize.height / 2;
        var positionX = Math.floor((touch.getLocation().x - startX) / contentSize.width * 3);
        var positionY = Math.floor((touch.getLocation().y - startY) / contentSize.height * 3);
        var result = new Object();
        result.x = positionX;
        result.y = positionY;
        return result;
    },
    //向指定位置下子
    go: function(position) {
        var color = null;
        if (chessArr.length % 2 == 0)
            color = s_BlackChess;
        else
            color = s_WhiteChess;
        var chess = cc.Sprite.create(color);
        var contentSize = chessboard.getContentSize();
        var x = (position.x + 0.5) * contentSize.width / 3;
        var y = (position.y + 0.5) * contentSize.height / 3;
        chess.setScale(2);
        chess.setPosition(x, y);
        chessboard.addChild(chess);

        chess.positionX = position.x;
        chess.positionY = position.y;
        boardArr[position.x][position.y] = chessArr.length % 2 + 1;
        chessArr[chessArr.length] = chess;

        //return chess color num, 1-black, 2-white
        return boardArr[position.x][position.y];
    },
    getMaxSum: function(positionX, positionY, chessColor, max) {
        var sum = -1;
        for (var index = 0; index < directionArr.length; index++) {
            var temp = this.getMax(positionX, positionY, chessColor, directionArr[index][0], directionArr[index][1]) + this.getMax(positionX, positionY, chessColor, directionArr[index][2], directionArr[index][3]);
            if (temp >= max)
                return temp;
            if (temp > sum)
                sum = temp;
        }
        return sum;
    },
    getMax: function(positionX, positionY, color, directionX, directionY) {
        if (positionX + directionX < 0 || positionX + directionX > 2 || positionY + directionY < 0 || positionY + directionY > 2)
            return 0;
        if (boardArr[positionX + directionX][positionY + directionY] == color)
            return 1 + this.getMax(positionX + directionX, positionY + directionY, color, directionX, directionY);
        else
            return 0;
    },
    onTouchBegan: function(touch, event) {
        return this.containsTouchLocation(touch, chessboard);
    },
    onTouchEnded: function(touch, event) {
        if (this.containsTouchLocation(touch, chessboard)) {
            var position = this.getTouchBoardPosition(touch);

            if (boardArr[position.x][position.y] == 0) {
                cc.log("Going " + position.x + ", " + position.y);
                var color = this.go(position);
                var sum = this.getMaxSum(position.x, position.y, color, 2);
                cc.log("Max: " + sum);
                if (sum >= 2)
                    alert("Win!");
            }
            else {
                //chessboard.removeAllChildren();
            }

        }
    },
    onTouchMoved: function(touch, event) {
        //cc.log("Moving ahahahha");
    },
    onExit: function() {
        cc.unregisterTouchDelegate(this);
        this._super();
    }
});

