var WelcomeLayer = cc.Layer.extend({
    userNameInput: null,
    menu: null,
    ctor: function() {
        this._super();
        this.init();
    },
    init: function() {
        var bRet = false;
        if (this._super()) {
            var size = cc.Director.getInstance().getWinSize();

            var layer = cc.LayerColor.create(new cc.Color4B(255, 250, 205, 255), size.width, size.height);
            this.addChild(layer);

            var itemStartGame = cc.MenuItemImage.create(
                    s_StartBtnNor,
                    s_StartBtnDown,
                    this.menuCallBack,
                    this
                    );
            itemStartGame.setPosition(size.width / 2, size.height / 2);

            menu = cc.Menu.create(itemStartGame);
            menu.setPosition(0, 0);


            userNameInput = cc.TextFieldTTF.create("请输入昵称", TEXT_INPUT_FONT_NAME, TEXT_INPUT_FONT_SIZE);
            userNameInput.setPosition(size.width / 2, size.height / 2 + itemStartGame.getContentSize().height + 20);
            userNameInput.setColor(cc.c3b(128, 128, 128));
            this.addChild(userNameInput);

            //注册touch事件
            cc.registerTargetedDelegate(1, true, this);

            bRet = true;
        }
        return bRet;
    },
    onTouchBegan: function(touch, event) {
        return true;
    },
    onTouchEnded: function(touch, event) {
        if (Utils.containsTouchLocation(touch, userNameInput))
            userNameInput.attachWithIME();
        else {
            userNameInput.detachWithIME();
            if (userNameInput.getString() == "")
                this.removeChild(menu);
            else
                this.addChild(menu);
        }
    },
    menuCallBack: function(sender) {
        if (userNameInput.getString() == "") {
            this.removeChild(menu);
            return;
        }

        var nextScene = cc.Scene.create();
        var nextLayer = new Game(userNameInput.getString());
        nextScene.addChild(nextLayer);
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1, nextScene));
    },
    onExit: function() {
        cc.unregisterTouchDelegate(this);
        this._super();
    }
});

var WelcomeScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var layer = new WelcomeLayer();
        layer.init();
        this.addChild(layer);
    }
});
