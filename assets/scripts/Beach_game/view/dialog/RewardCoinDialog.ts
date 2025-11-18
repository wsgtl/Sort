import { _decorator, Component, Node } from 'cc';
import { ViewManager } from '../../manager/ViewManger';
import { CoinManger } from '../../manager/CoinManger';
import { adHelper } from '../../../Beach_common/native/AdHelper';
import { Button } from 'cc';
import { ActionEffect } from '../../../Beach_common/effects/ActionEffect';
import { DialogComponent } from '../../../Beach_common/ui/DialogComtnet';
import { NumFont } from '../../../Beach_common/ui/NumFont';
import { MathUtil } from '../../../Beach_common/utils/MathUtil';
import { delay } from '../../../Beach_common/utils/TimeUtil';
import { isVaild } from '../../../Beach_common/utils/ViewUtil';
import { GameStorage } from '../../GameStorage';
import { RewardType } from '../../GameUtil';
import { AudioManager } from '../../manager/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('RewardCoinDialog')
export class RewardCoinDialog extends DialogComponent {
    @property(Node)
    btnReceive: Node = null;
    @property(Node)
    btnNo: Node = null;
    @property(NumFont)
    num: NumFont = null;


    type: RewardType;
    cb: Function;
    private rewardNum: number = 1;//奖励数量
    private reciveNum: number = 1;//看广告领取倍率
    show(parent: Node, args?: any) {
        parent.addChild(this.node);
        this.init(args.num);
        this.cb = args.cb;
    }
    init(num: number) {
        AudioManager.playEffect("reward", 2);

        this.showReciveNum(2);
        this.rewardNum = num;
        this.num.num = num;

        this.btnNo.once(Button.EventType.CLICK, this.onBtnNo, this);
        this.btnReceive.on(Button.EventType.CLICK, this.onBtnReceive, this);

        this.btnNo.active = false;
        delay(1.5, this.btnNo).then(() => {
            if (!isVaild(this.btnNo)) return;
            this.btnNo.active = true;
            ActionEffect.fadeIn(this.btnNo, 0.5);
        })

    }
    private showReciveNum(n: number) {
        this.reciveNum = n;
        this.btnReceive.getChildByName("r1").active = n == 1;
        this.btnReceive.getChildByName("r2").active = n == 2;
    }
    onBtnNo() {
        this.closeAni();
        if (this.type != RewardType.cash)
            this.addReward(this.rewardNum);
        if (GameStorage.getCurLevel() > 1) {//第二局后有概率弹插屏广告
            adHelper.timesToShowInterstitial();
        }
    }
    onBtnReceive() {
        adHelper.showRewardVideo(() => {
            this.closeAni();
            this.addReward(this.rewardNum * this.reciveNum);
        }, ViewManager.adNotReady)
    }
    private addReward(num: number) {
        this.cb?.(); 
        CoinManger.instance.addCoin(num, false);
        ViewManager.showRewardAni1(RewardType.coin, num, ()=>{});
    }




}


