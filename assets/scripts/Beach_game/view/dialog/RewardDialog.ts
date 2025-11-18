import { _decorator, Component, Node } from 'cc';
import { DialogComponent } from '../../../Beach_common/ui/DialogComtnet';
import { SpriteFrame } from 'cc';
import { NumFont } from '../../../Beach_common/ui/NumFont';
import { Sprite } from 'cc';
import { RewardType } from '../../GameUtil';
import { MathUtil } from '../../../Beach_common/utils/MathUtil';
import { Button } from 'cc';
import { adHelper } from '../../../Beach_common/native/AdHelper';
import { GameStorage } from '../../GameStorage';
import { CoinManger } from '../../manager/CoinManger';
import { MoneyManger } from '../../manager/MoneyManger';
import { ViewManager } from '../../manager/ViewManger';
import { AudioManager } from '../../manager/AudioManager';
import { delay } from '../../../Beach_common/utils/TimeUtil';
import { ActionEffect } from '../../../Beach_common/effects/ActionEffect';
import { isVaild } from '../../../Beach_common/utils/ViewUtil';
import { Vec3 } from 'cc';
import { UIUtils } from '../../../Beach_common/utils/UIUtils';
import { GuideManger } from '../../manager/GuideManager';
import { Money } from '../component/Money';
import { LangStorage } from '../../../Beach_common/localStorage/LangStorage';
import { Label } from 'cc';
import { FormatUtil } from '../../../Beach_common/utils/FormatUtil';
const { ccclass, property } = _decorator;

@ccclass('RewardDialog')
export class RewardDialog extends DialogComponent {
    @property(Node)
    btnReceive: Node = null;
    @property(Node)
    btnClaim: Node = null;
    @property(Node)
    btnClaimSmall: Node = null;
    @property(Node)
    normalContent: Node = null;
    @property(Node)
    doubleContent: Node = null;



    cb: Function;
    isAd: boolean = false;
    private rewardNum: number = 1;//奖励数量
    private reciveNum: number = 1;//看广告奖励数
    showStart(args?: any) {
        this.cb = args.cb;
        this.isAd = args.isAd;
        this.init();
    }
    init() {
        AudioManager.playEffect("reward", 2);

        this.btnClaimSmall.once(Button.EventType.CLICK, this.onClaim, this);
        this.btnClaim.once(Button.EventType.CLICK, this.onClaim, this);
        this.btnReceive.on(Button.EventType.CLICK, this.onBtnReceive, this);

        this.rewardNum = MoneyManger.instance.getReward();
        this.reciveNum = this.reciveNum * 2;
        this.normalContent.getChildByName("moneyNode").getChildByName("num").getComponent(Label).string = FormatUtil.toMoney(this.rewardNum);

        this.normalContent.active = !this.isAd;
        this.doubleContent.active = this.isAd;
        if (this.isAd) {
            this.startDouble();
        }
    }
    startDouble() {
        const small = this.doubleContent.getChildByName("money_small");
        const big = this.doubleContent.getChildByName("money_big");
        const jt = this.doubleContent.getChildByName("jt");
        small.getChildByName("moneyNode").getChildByName("num").getComponent(Label).string = FormatUtil.toMoney(this.rewardNum);
        big.getChildByName("moneyNode").getChildByName("num").getComponent(Label).string = FormatUtil.toMoney(this.reciveNum);

    }
    onClaim() {
        this.closeAni();
        this.addReward(this.rewardNum);
    }
    onBtnReceive() {
        adHelper.showRewardVideo("领取钱奖励", () => {
            this.closeAni();
            this.addReward(this.reciveNum);
        }, ViewManager.adNotReady)
    }
    private addReward(num: number) {
        MoneyManger.instance.addMoney(num, false);
        ViewManager.showRewardAni1(RewardType.money, num, this.cb);
    }


    // protected onDestroy(): void {
    //     this.mnBack();
    // }


    // private mn: Node;
    // private mnParent: Node;
    // private mnPos: Vec3;
    // private mnIndex: number;
    // showMoneyNode() {
    //     const money = MoneyManger.instance.getMoneyNode();
    //     money.showTips();
    //     const mn = money.node;
    //     this.mnPos = mn.position.clone();
    //     this.mn = mn;
    //     this.mnParent = mn.parent;
    //     this.mnIndex = mn.getSiblingIndex();
    //     UIUtils.changeParent(mn, this.node.parent);
    //     this.mn.getComponent(Money).setBtnInter(false);
    // }
    // mnBack() {
    //     if (isVaild(this.mn) && isVaild(this.mnParent)) {
    //         this.mn.position = this.mnPos;
    //         this.mnParent.insertChild(this.mn, this.mnIndex);
    //         this.mn.getComponent(Money).setBtnInter(true);
    //     } else {
    //         this.mn?.destroy();
    //     }
    // }
}


