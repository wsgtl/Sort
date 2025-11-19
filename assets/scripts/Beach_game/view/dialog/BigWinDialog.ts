import { _decorator, Component, Node } from 'cc';
import { DialogComponent } from '../../../Beach_common/ui/DialogComtnet';
import { Button } from 'cc';
import { adHelper } from '../../../Beach_common/native/AdHelper';
import { MoneyManger } from '../../manager/MoneyManger';
import { ViewManager } from '../../manager/ViewManger';
import { RewardType } from '../../GameUtil';
import { Label } from 'cc';
import { FormatUtil } from '../../../Beach_common/utils/FormatUtil';
const { ccclass, property } = _decorator;

@ccclass('BigWinDialog')
export class BigWinDialog extends DialogComponent {
    @property(Node)
    btnClaim: Node = null;
    @property(Node)
    btnNt: Node = null;
    @property(Node)
    jt: Node = null;
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
    }
    protected onLoad(): void {
        this.btnClaim.on(Button.EventType.CLICK, this.onReceive, this);
        this.btnNt.on(Button.EventType.CLICK, () => { this.closeAni(); });
    }
    private isStop: boolean = false;
    private speed: number = 180;
    private fx: number = 1;
    protected update(dt: number): void {
        if (this.isStop) return;
        this.jt.angle += dt * this.speed * this.fx;//旋转
        if (Math.abs(this.jt.angle) > 80) {//换方向
            this.fx = -this.fx;
        }
        const bl = this.blNums[Math.floor(-(this.jt.angle - 90) / 30)] ?? 2;
        if (bl != this.bl) {
            this.bl = bl;
            this.moneyNode.string = FormatUtil.toMoney(this.getMoney());//显示钱
        }

    }
    onReceive() {
        this.isStop = true;
        if (this.isAd)
            adHelper.showRewardVideo("气泡转轮", () => {
                this.claimMoney();
            }, () => { ViewManager.adNotReady(); this.isStop = false; })
        else
            this.claimMoney();
    }
    claimMoney() {
        this.closeAni();
        const money = this.getMoney();
        MoneyManger.instance.addMoney(money);
        ViewManager.showRewardAni1(RewardType.money, money, () => { });
    }
    private getMoney() {
        return this.rewardNum * this.bl;
    }
}
