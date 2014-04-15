var WelcomeLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        this.init();
    },
    init:function () {
        var bRet = false;
        if (this._super()) {
            var size = cc.Director.getInstance().getWinSize();
            
            var layer = cc.LayerColor.create(new cc.Color4B(128,128,128,255), size.width, size.height);
            this.addChild(layer);
            var itemStartGame = cc.MenuItemImage.create(
                "res/btn/btnStartGameNor.png",
                "res/btn/btnStartGameDown.png",
                this.menuCallBack,
                this
            );
            itemStartGame.setPosition(size.width/2, size.height/2);
//            itemStartGame.setAnchorPoint(cc.p(0.5, 0.5));

            var menu = cc.Menu.create(itemStartGame);
            menu.setPosition(0,0);
            this.addChild(menu);

            bRet = true;
        }
        return bRet;
    },
    menuCallBack:function(sender){
        var nextScene = cc.Scene.create();
        var nextLayer = new Game;
        nextScene.addChild(nextLayer);
        cc.Director.getInstance().replaceScene(cc.TransitionSlideInT.create(0.4, nextScene));
    }
});

var WelcomeScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new WelcomeLayer();
        layer.init();
        this.addChild(layer);
    }
});
