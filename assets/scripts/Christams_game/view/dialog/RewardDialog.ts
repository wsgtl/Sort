import { _decorator, Component, Node } from 'cc';
import { Sprite } from 'cc';
import { RewardType } from '../../GameUtil';
import { Button } from 'cc';
import { MoneyManger } from '../../manager/MoneyManger';
import { ViewManager } from '../../manager/ViewManger';
import { AudioManager } from '../../manager/AudioManager';
import { v3 } from 'cc';
import { Label } from 'cc';
import { ActionEffect } from '../../../Christams_common/effects/ActionEffect';
import { adHelper } from '../../../Christams_common/native/AdHelper';
import { DialogComponent } from '../../../Christams_common/ui/DialogComtnet';
import { FormatUtil } from '../../../Christams_common/utils/FormatUtil';
import { delay } from '../../../Christams_common/utils/TimeUtil';
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
        this.rewardNum = args.rewardNum;
        this.reciveNum = this.rewardNum * 2;
        this.init();
    }
    init() {
        AudioManager.playEffect("rewardDialog", 1);

        this.btnClaimSmall.on(Button.EventType.CLICK, () => { this.onClaim(true) }, this);
        this.btnClaim.on(Button.EventType.CLICK, () => { this.onClaim(false) }, this);
        this.btnReceive.on(Button.EventType.CLICK, this.onBtnReceive, this);

        // this.rewardNum = MoneyManger.instance.getReward();
        // this.reciveNum = this.reciveNum * 2;
        this.normalContent.getChildByName("moneyNode").getChildByName("num").getComponent(Label).string = FormatUtil.toMoney(this.rewardNum);

        this.normalContent.active = !this.isAd;
        this.doubleContent.active = this.isAd;
        if (this.isAd) {
            this.startDouble();
        }
    }
    private getNodes() {
        const title = this.content.getChildByName("title");
        const statusShow = this.content.getChildByName("statusShow");
        const cur = this.isAd ? this.doubleContent : this.normalContent;
        return [title, cur, statusShow];
    }
    /**开始动画 */
    async startAni() {
        this.isAni = true;
        ActionEffect.fadeIn(this.bg, 0.3);
        const nodes =this.getNodes();
        nodes.forEach(async (v, i) => {
            v.scale = v3();
            await delay(i * 0.2);
            AudioManager.vibrate(20,155);
            ActionEffect.scale(v, 0.3, 1, 0, "backOut");
        })
        await delay(0.6,this.node);
        this.isAni = false;
    }
    /**关闭动画 */
    async closeAni() {
        if (this.isAni) return;
        const time = 0.3;
        this.isAni = true;
        ActionEffect.fadeOut(this.bg, time);
        const nodes =this.getNodes();
        nodes.forEach(async (v, i) => {
            await delay(i * 0.2);
            AudioManager.vibrate(20,155);
            ActionEffect.scale(v, 0.3, 0, 1, "backIn");
        })
        await delay(0.7,this.node);
        // this.isAni = false;
        this.node.destroy();
        this.closeCb?.();
    }
    async startDouble() {
        const small = this.doubleContent.getChildByName("money_small");
        const big = this.doubleContent.getChildByName("money_big");
        const jt = this.doubleContent.getChildByName("jt");
        small.getChildByName("moneyNode").getChildByName("num").getComponent(Label).string = FormatUtil.toMoney(this.rewardNum);
        big.getChildByName("moneyNode").getChildByName("num").getComponent(Label).string = FormatUtil.toMoney(this.reciveNum);
        jt.scale = v3();
        big.scale = v3();
        small.scale = v3();
        this.btnReceive.scale = v3();
        await delay(0.3, this.node);
        await ActionEffect.scale(small, 0.3, 1, 0, "backOut");
        await ActionEffect.scale(jt, 0.3, 1, 0, "backOut");
        ActionEffect.scale(this.btnReceive, 0.3, 1, 0, "backOut");
        await ActionEffect.scale(big, 0.3, 1, 0, "backOut");

    }
    onClaim(isMust: boolean) {
        if (this.isAni) return;
        isMust ? adHelper.showInterstitial("双倍领取钱弹窗") : adHelper.timesToShowInterstitial();
        this.closeAni();
        this.addReward(this.rewardNum);
    }
    onBtnReceive() {
        if (this.isAni) return;
        adHelper.showRewardVideo("领取钱奖励", () => {
            this.closeAni();
            this.addReward(this.reciveNum);
        }, ViewManager.adNotReady)
    }
    private addReward(num: number) {
        MoneyManger.instance.addMoney(num, false, false);
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


