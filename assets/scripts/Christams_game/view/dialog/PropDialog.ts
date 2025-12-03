import { _decorator, RichText, Button, Label, Node } from "cc";
import { GameStorage } from "../../GameStorage";
import { PropType, GameUtil, RewardType } from "../../GameUtil";
import { AudioManager } from "../../manager/AudioManager";
import { CoinManger } from "../../manager/CoinManger";
import { ViewManager } from "../../manager/ViewManger";
import { ConfigConst } from "../../manager/ConfigConstManager";
import { GlobalButtonLock } from "../../../Christams_common/Decorator";
import { adHelper } from "../../../Christams_common/native/AdHelper";
import { DialogComponent } from "../../../Christams_common/ui/DialogComtnet";
import { ActionEffect } from "../../../Christams_common/effects/ActionEffect";
import { delay } from "../../../Christams_common/utils/TimeUtil";
import { view } from "cc";

const { ccclass, property } = _decorator;

@ccclass('PropDialog')
export class PropDialog extends DialogComponent {
    @property(Node)
    btnClaim: Node = null;
    @property(Node)
    btnResurrect: Node = null;
    @property(Node)
    btnCoin: Node = null;
    @property(Node)
    btnAddCoin: Node = null;
    @property(Node)
    btnOver: Node = null;
    @property(RichText)
    limit: RichText = null;
    @property([Node])
    icons: Node[] = [];
    @property([Node])
    strs: Node[] = [];

    private curCoin: number = 100;
    private curLimit: number = 3;
    type: PropType;
    cb: Function;
    onlyCloseCb: Function;
    isResurrect: boolean;
    show(parent: Node, args?: any) {
        parent.addChild(this.node);
        this.cb = args.cb;
        this.isResurrect = args.isResurrect;
        this.onlyCloseCb = args.closeCb;
        this.init(args.type);
        this.btnClaim.on(Button.EventType.CLICK, this.onClaim, this);
        this.btnResurrect.on(Button.EventType.CLICK, this.onResurrect, this);
        this.btnCoin.on(Button.EventType.CLICK, this.onCoin, this);
        this.btnAddCoin.on(Node.EventType.TOUCH_START, this.onAddCoin, this);
        this.btnOver.on(Button.EventType.CLICK, () => {
            this.closeAni();
            this.onlyCloseCb?.();
        });
    }
    @GlobalButtonLock(1)
    private onClaim() {
        adHelper.showRewardVideo("获取道具", () => {
            this.addProp(true);
        }, ViewManager.adNotReady)
    }
    @GlobalButtonLock(1)
    private onResurrect() {
        adHelper.showRewardVideo("复活", () => {
            this.resurrect(true);
        }, ViewManager.adNotReady)
    }
    @GlobalButtonLock(1)
    private onCoin() {
        const coin = GameStorage.getCoin();
        if (coin < this.curCoin) {
            // ViewManager.showTips(i18n.string("str_nogold"));
            ViewManager.showGold();
            return;
        }
        CoinManger.instance.addCoin(-this.curCoin);
        if (this.isResurrect)
            this.resurrect(false);
        else
            this.addProp(false);
    }
    @GlobalButtonLock(1)
    private onAddCoin() {
        adHelper.showRewardVideo("加金币", () => {
            this.addCoin();
        }, ViewManager.adNotReady);
    }
    private addCoin() {
        CoinManger.instance.addCoin(GameUtil.ReceiveCoins, false, false);
        ViewManager.showRewardAni1(RewardType.coin, GameUtil.ReceiveCoins, () => { }, this.btnAddCoin);
    }
    /**复活 */
    private resurrect(isAd: boolean) {
        this.cb?.();
        this.closeAni();
        GameStorage.resurrection(isAd);
    }
    init(type: PropType) {
        this.type = type;
        this.icons.forEach((v, i) => { v.active = i == type - 1 });
        this.strs.forEach((v, i) => { v.active = i == type - 1 });
        const limit = ConfigConst.Other.PropLimit;
        const cn = GameStorage.getPropCurLevel(type);
        this.btnClaim.active = type != PropType.resurrection && cn.ad == 0;
        this.btnResurrect.active = type == PropType.resurrection && cn.ad == 0;
        this.curCoin = GameUtil.PropCoins[cn.coin];
        this.curLimit = limit - cn.all;
        this.btnCoin.getChildByName("Layout").getChildByName("num").getComponent(Label).string = this.curCoin + "";
        this.setLimit();
        this.btnAddCoin.getChildByName("num").getComponent(Label).string = "+" + GameUtil.ReceiveCoins;

        const h = view.getVisibleSize().y - 1920;
        this.btnAddCoin.y -= h * 0.4;
    }
    addProp(isAd: boolean) {

        GameStorage.addPropNum(this.type, 1, isAd);
        this.cb?.();
        this.closeAni();

        //动画
        // this.add.y = 0;
        // this.add.active = true;
        // tween(this.add)
        //     .to(0.5, { y: 140 })
        //     .start();
        // ActionEffect.fadeOut(this.add, 0.5);

        AudioManager.playEffect("good");
    }
    setLimit() {
        // this.limit.string = `<outline color=#a7511f width=2><color=#fff>Limit:</color><color=#47f051>${this.curLimit}</color><color=#fff>/${ConfigConst.Other.PropLimit}</color>`
        this.limit.string = `<outline color=#d82a4b width=2><color=#fff>Limit:${this.curLimit}/${ConfigConst.Other.PropLimit}</color>`
    }
}


