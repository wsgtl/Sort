import { _decorator, Component, Node } from 'cc';
import { DialogComponent } from '../../../Beach_common/ui/DialogComtnet';
import { Button } from 'cc';
import { adHelper } from '../../../Beach_common/native/AdHelper';
import { MoneyManger } from '../../manager/MoneyManger';
import { ViewManager } from '../../manager/ViewManger';
import { RewardType } from '../../GameUtil';
import { Label } from 'cc';
import { FormatUtil } from '../../../Beach_common/utils/FormatUtil';
import { ActionEffect } from '../../../Beach_common/effects/ActionEffect';
import { delay } from '../../../Beach_common/utils/TimeUtil';
const { ccclass, property } = _decorator;

@ccclass('BigWinDialog')
export class BigWinDialog extends DialogComponent {
    @property(Node)
    btnClaim: Node = null;
    @property(Node)
    btnNt: Node = null;
    @property(Node)
    jt: Node = null;
    @property([Node])
    gs: Node[] = [];
    @property(Label)
    moneyNode: Label = null;

    private rewardNum: number = 0;
    private bl: number = 1;
    private blNums: number[] = [2, 3, 2, 5, 2, 4];
    private isAd: boolean;
    showStart(args?: any): void {
        this.isAd = args.isAd;
        this.rewardNum = MoneyManger.instance.getReward(0.3);
        if (!this.isAd) {
            this.btnNt.destroy();
            this.btnClaim.getChildByName("Layout").getChildByName("sp").active = false;
        }
        this.showLight();
    }
    protected onLoad(): void {
        this.btnClaim.on(Button.EventType.CLICK, this.onReceive, this);
        this.btnNt.on(Button.EventType.CLICK, () => { if (this.isStop) return; this.closeAni(); adHelper.timesToShowInterstitial(); });
    }
    private isStop: boolean = false;
    private speed: number = 180;
    private fx: number = 1;
    protected update(dt: number): void {
        if (this.isStop) return;
        this.jt.angle += dt * this.speed * this.fx;//旋转
        if (this.jt.angle > 80) {//换方向
            this.fx = -1;
        } else if (this.jt.angle < -80) {
            this.fx = 1;
        }
        const bl = this.blNums[Math.floor(-(this.jt.angle - 90) / 30)] ?? 2;
        if (bl != this.bl) {
            this.bl = bl;
            this.moneyNode.string = FormatUtil.toMoney(this.getMoney());//显示钱
        }

    }
    onReceive() {
        if (this.isStop) return;
        this.isStop = true;
        if (this.isAd)
            adHelper.showRewardVideo("气泡转轮", () => {
                this.claimMoney();
            }, () => { ViewManager.adNotReady(); this.isStop = false; })
        else {
            this.claimMoney();
            adHelper.timesToShowInterstitial();
        }

    }
    async claimMoney() {
        await delay(1);
        this.closeAni();
        const money = this.getMoney();
        MoneyManger.instance.addMoney(money);
        ViewManager.showRewardAni1(RewardType.money, money, () => { });
    }
    private getMoney() {
        return this.rewardNum * this.bl;
    }
    private gn: number = 0;
    private async showLight() {
        this.gs.forEach((v, i) => {
            v.active = this.gn == i;
        })
        await delay(0.3, this.node);
        this.gn = 1 - this.gn;
        this.showLight();
    }
}
