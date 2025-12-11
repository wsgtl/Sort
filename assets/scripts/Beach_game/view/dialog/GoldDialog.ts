import { _decorator, Component, Node } from 'cc';
import { DialogComponent } from '../../../Beach_common/ui/DialogComtnet';
import { CoinManger } from '../../manager/CoinManger';
import { Button } from 'cc';
import { GameUtil, RewardType } from '../../GameUtil';
import { adHelper } from '../../../Beach_common/native/AdHelper';
import { ViewManager } from '../../manager/ViewManger';
import { GameStorage } from '../../GameStorage';
import { EventTracking } from '../../../Beach_common/native/EventTracking';
import { AudioManager } from '../../manager/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('GoldDialog')
export class GoldDialog extends DialogComponent {
    @property(Node)
    btnClaim: Node = null;
    @property(Node)
    btnNt: Node = null;

    protected onLoad(): void {
        CoinManger.instance.setDialog(this.node);
        this.btnClaim.on(Button.EventType.CLICK, this.onReceive, this);
        this.btnNt.on(Button.EventType.CLICK, () => { this.closeAni(); adHelper.timesToShowInterstitial(); });
        AudioManager.playEffect("reward");
    }
    protected onDestroy(): void {
        CoinManger.instance.setDialog(null);
    }
    onReceive() {
        // EventTracking.sendEventCoin(GameStorage.getCoin());
        adHelper.showRewardVideo("增加金币", () => {
            this.closeAni();
            CoinManger.instance.addCoin(GameUtil.ReceiveCoins);
            ViewManager.showRewardAni1(RewardType.coin, GameUtil.ReceiveCoins, () => { });
        }, ViewManager.adNotReady)

    }
}


