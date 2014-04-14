var Game = cc.Layer.extend({
    ctor:function () {
        this._super();
        this.init();
    },
    init:function () {
        var bRet = false;
        if (this._super()) {
            var size = cc.Director.getInstance().getWinSize();
            
            var layer = cc.LayerColor.create(new cc.Color4B(128,128,128,255), 800, 600);
            this.addChild(layer);
            
            var chessboard = cc.Sprite.create(s_Chessborad);
            chessboard.setPosition(size.width/2, size.height/2);
            
            this.addChild(chessboard);
            
            bRet = true;
        }
        return bRet;
    }
});

