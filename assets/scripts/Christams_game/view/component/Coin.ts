import { _decorator, Component, Node } from 'cc';
import { NumFont } from '../../../Beach_common/ui/NumFont';
import { GameStorage } from '../../GameStorage';
import { ButtonLock } from '../../../Beach_common/Decorator';
import { CoinManger } from '../../manager/CoinManger';
import { v3 } from 'cc';
import { Label } from 'cc';
import { FormatUtil } from '../../../Beach_common/utils/FormatUtil';
import { ActionEffect } from '../../../Beach_common/effects/ActionEffect';
import { tweenPromise } from '../../../Beach_common/utils/TimeUtil';
import { Tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Coin')
export class Coin extends Component {
    @property(Label)
    num: Label = null;
    @property(Label)
    addNum: Label = null;

    protected onLoad(): void {
        this.showCurCoin();
        this.node.on(Node.EventType.TOUCH_START, this.touch, this);
    }
    protected start(): void {
        CoinManger.instance.setCoinNode(this);
    }
    showNum(num: number) {
        this.num.string = FormatUtil.toCoin(num);
    }
    async showAddNum(num: number) {
        this.addNum.string = "+" + FormatUtil.toCoin(num);
        const an = this.addNum.node;
        ActionEffect.addRewardLabelAni(an);
        // Tween.stopAllByTarget(an);
        // an.active = true;
        // an.y = 0;
        // ActionEffect.fadeIn(an);
        // await tweenPromise(an, t => t.to(0.1, { y: 50 }).delay(.5));
        // an.active = false;
    }
    showCurCoin() {
        this.showNum(GameStorage.getCoin());
    }
    @ButtonLock(1)
    touch() {
        CoinManger.instance.showDialog();
    }
    protected onDestroy(): void {
        // CoinManger.instance.setCoinNode(null);
    }
}


