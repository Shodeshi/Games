var Game = cc.Layer.extend({
    chessboard: null,
    //已下棋子
    chessArr: null,
    /*
     * 棋盘上所有位置, 初始值为0:
     * /|\ 
     *  |  (2,0) (2,1) (2,2)
     *  |  (1,0) (1,1) (1,2)
     *  |  (0,0) (0,1) (0,2)
     *  +-------------------->
     */
    boardArr: null,
    directionArr: null,
    controlLabel: null,
    menu: null,
    webSocket: null,
    //当前游戏准备玩家数量
    playerCount: null,
    //当前玩家顺序, 1-黑棋, 2-白棋
    myOrder: null,
    userName: null,
    ctor: function(userName) {
        this.userName = userName;
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

            directionArr = new Array([1, 0, -1, 0], [1, 1, -1, -1], [0, 1, 0, -1], [-1, 1, 1, -1]);

            controlLabel = cc.LabelTTF.create("当前玩家: 0/2", "Microsoft Yahei", 30);
            controlLabel.setPosition(size.width / 2, size.height / 2 + chessboard.getContentSize().height / 2 + 30);
            //controlLabel.setColor(cc.c3b(255, 0, 0));
            this.addChild(controlLabel);

            var resetBtn = cc.MenuItemFont.create("开始游戏", this.resetRequest, this);
            resetBtn.setDisabledColor(cc.c3b(32, 32, 64));
            resetBtn.setFontSize(30);
            resetBtn.setFontName("Microsoft Yahei");
            menu = cc.Menu.create(resetBtn);
            menu.setPosition(size.width / 2, size.height / 2 - chessboard.getContentSize().height / 2 - 30);
            this.addChild(menu);
            //TODO
            myOrder = -1;

            webSocket = new WebSocket("ws://" + HOST + ":8080/GameServer-war/server");
            webSocket.game = this;
            webSocket.onopen = function(event) {
                cc.log('WebSocket connected.');
                var request = new Object();
                request.action = "login";
                request.userName = this.game.userName;
                this.send(JSON.stringify(request));
            };
            webSocket.onerror = function() {
                cc.error('WebSocket connect failed.');
            };
            webSocket.onmessage = function(event) {
                cc.log("Server message: " + event.data);
                var obj = JSON.parse(event.data);
                switch (obj.action) {
                    case "go":
                        var position = new Object();
                        position.x = obj.positionX;
                        position.y = obj.positionY;
                        this.game.goResponse(position);
                        break;
                    case "reset":
                        playerCount = obj.playerCount;
                        this.game.resetResponse();
                        break;
                    case "assignOrder":
                        myOrder = obj.playerOrder;
                        break;
                }
            };

            //注册touch事件
            cc.registerTargetedDelegate(1, true, this);

            bRet = true;
        }
        return bRet;
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
    resetRequest: function() {
        var request = new Object();
        this.removeChild(menu);
        request.action = "reset";
        webSocket.send(JSON.stringify(request));
    },
    resetResponse: function() {
        if (playerCount < 2)
            controlLabel.setString("当前玩家: " + playerCount + "/2");
        else
            this.resetGame();
    },
    resetGame: function() {
        //清空棋子
        chessboard.removeAllChildren();
        //初始化棋子数组
        chessArr = new Array();
        boardArr = new Array();
        for (var i = 0; i < 3; i++) {
            boardArr[i] = new Array();
            for (var j = 0; j < 3; j++)
                boardArr[i][j] = 0;
        }
        controlLabel.setString("开始了...");
    },
    //发送下棋请求
    goRequest: function(position) {
        var goRequestObject = new Object();
        goRequestObject.action = 'go';
        goRequestObject.positionX = position.x;
        goRequestObject.positionY = position.y;

        webSocket.send(JSON.stringify(goRequestObject));
    },
    //下棋相应
    goResponse: function(position) {
        var color = this.go(position);
        var sum = this.getMaxSum(position.x, position.y, color, 2);
        //cc.log("Max: " + sum);
        if (sum >= 2) {
            var text = null;
            if (color == 1)
                text = "黑方获胜！";
            else
                text = "白方获胜！";
            controlLabel.setString(text);
            myOrder = -1;
            this.addChild(menu);
        }
        else if (chessArr.length == 9) {
            controlLabel.setString("平局");
            myOrder = -1;
            this.addChild(menu);
        }
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
        return Utils.containsTouchLocation(touch, chessboard);
    },
    onTouchEnded: function(touch, event) {
        if (Utils.containsTouchLocation(touch, chessboard) && playerCount == 2) {
            if ((chessArr.length % 2 + 1) != myOrder) {
                controlLabel.setString("没轮到你");
                return;
            }

            var position = this.getTouchBoardPosition(touch);

            if (boardArr[position.x][position.y] == 0) {
                //cc.log("Going " + position.x + ", " + position.y);
                this.goRequest(position);

            }
            else {
                controlLabel.setString("该位置有子了");
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

