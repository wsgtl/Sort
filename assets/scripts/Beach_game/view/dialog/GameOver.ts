import { _decorator, Component, Node } from 'cc';
import { Button } from 'cc';
import { AudioManager } from '../../manager/AudioManager';
import { adHelper } from '../../../Beach_common/native/AdHelper';
import { DialogComponent } from '../../../Beach_common/ui/DialogComtnet';
import { Label } from 'cc';
import { view } from 'cc';
import { MoneyManger } from '../../manager/MoneyManger';
import { FormatUtil } from '../../../Beach_common/utils/FormatUtil';
import { ViewManager } from '../../manager/ViewManger';
import { RewardType } from '../../GameUtil';
const { ccclass, property } = _decorator;

@ccclass('GameOver')
export class GameOver extends DialogComponent {
    @property(Node)
    btnClaim: Node = null;
    @property(Node)
    btnRestart: Node = null;
    @property(Node)
    winContent: Node = null;
    @property(Node)
    failContent: Node = null;
    @property(Node)
    statusShow: Node = null;
    @property(Label)
    moneyLabel: Label = null;


    private isWin: boolean = false;
    private claimMoneyNum: number = 0;
    async showStart(args?: any) {
        this.isWin = args.isWin;
        this.btnClaim.on(Button.EventType.CLICK, () => {
            this.setCanClick(false);
            this.closeAni();
            MoneyManger.instance.addMoney(this.claimMoneyNum, false);
            ViewManager.showRewardAni1(RewardType.money, this.claimMoneyNum, () => {
                args.continueCb();
            })

        })

        this.btnRestart.on(Button.EventType.CLICK, () => {
            args.restartCb();
            this.setCanClick(false);
            this.closeAni();
        })

        adHelper.showInterstitial("结算页");
        this.init();

    }
    private init() {
        this.winContent.active = this.isWin;
        this.failContent.active = !this.isWin;
        if (this.isWin) {
            AudioManager.playEffect("win");
            this.claimMoneyNum = MoneyManger.instance.getReward();
            this.moneyLabel.string = FormatUtil.toMoney(this.claimMoneyNum);
        }
        else {
            AudioManager.playEffect("failed");
            this.moneyLabel.string = MoneyManger.instance.getMoneyString();
        }

    }


    private setCanClick(v: boolean) {
        this.btnClaim.getComponent(Button).interactable = v;
        this.btnRestart.getComponent(Button).interactable = v;
    }


}


