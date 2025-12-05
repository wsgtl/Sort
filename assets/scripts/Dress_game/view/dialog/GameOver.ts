import { _decorator, Component, Node } from 'cc';
import { Button } from 'cc';
import { AudioManager } from '../../manager/AudioManager';
import { Label } from 'cc';
import { view } from 'cc';
import { MoneyManger } from '../../manager/MoneyManger';
import { ViewManager } from '../../manager/ViewManger';
import { RewardType } from '../../GameUtil';
import { ConfigConst } from '../../manager/ConfigConstManager';
import { CoinManger } from '../../manager/CoinManger';
import { GameStorage } from '../../GameStorage';
import { adHelper } from '../../../Dress_common/native/AdHelper';
import { DialogComponent } from '../../../Dress_common/ui/DialogComtnet';
import { FormatUtil } from '../../../Dress_common/utils/FormatUtil';
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
    @property(Node)
    tips: Node = null;
    @property(Label)
    moneyLabel: Label = null;


    private type: RewardType;
    private isWin: boolean = false;
    private claimNum: number = 0;
    async showStart(args?: any) {
        this.type = ConfigConst.isShowA ? RewardType.coin : RewardType.money;
        adHelper.showInterstitial("结算界面");
        this.isWin = args.isWin;
        this.btnClaim.on(Button.EventType.CLICK, () => {
            this.setCanClick(false);
            this.closeAni();
            this.addReward(args.continueCb());
            // MoneyManger.instance.addMoney(this.claimMoneyNum, false);
            // ViewManager.showRewardAni1(RewardType.money, this.claimMoneyNum, () => {
            //     args.continueCb();
            // })

        })

        this.btnRestart.on(Button.EventType.CLICK, () => {
            args.restartCb()
            this.setCanClick(false);
            this.closeAni();
        })

        adHelper.showInterstitial("结算页");
        this.init();

        const pa = this.moneyLabel.node.parent;
        pa.getChildByName("coin").active = this.type == RewardType.coin;
        pa.getChildByName("money").active = this.type != RewardType.coin;
        this.tips.active = !ConfigConst.isShowA;
    }
    private init() {
        this.winContent.active = this.isWin;
        this.failContent.active = !this.isWin;
        const content = this.isWin?this.winContent:this.failContent;
        const isCoin = this.type == RewardType.coin;
        if (this.isWin) {
            AudioManager.playEffect("win");
            this.claimNum = isCoin ? CoinManger.instance.getReward(): MoneyManger.instance.getReward();
            this.moneyLabel.string = isCoin ? FormatUtil.toCoin(this.claimNum) : FormatUtil.toMoney(this.claimNum);
        }
        else {
            AudioManager.playEffect("failed");
            this.moneyLabel.string = isCoin ? FormatUtil.toCoin(GameStorage.getCoin()) : MoneyManger.instance.getMoneyString();
        }
        content.getChildByName("icon_coin").active = isCoin;
        content.getChildByName("icon_money").active = !isCoin;
    }


    private setCanClick(v: boolean) {
        this.btnClaim.getComponent(Button).interactable = v;
        this.btnRestart.getComponent(Button).interactable = v;
    }
    private addReward(cb: Function) {
        this.type == RewardType.coin ? CoinManger.instance.addCoin(this.claimNum, false) : MoneyManger.instance.addMoney(this.claimNum, false);
        ViewManager.showRewardAni1(this.type, this.claimNum, () => {
            cb?.();
        })
    }

}


