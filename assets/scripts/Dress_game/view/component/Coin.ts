import { _decorator, Component, Node } from 'cc';
import { GameStorage } from '../../GameStorage';
import { CoinManger } from '../../manager/CoinManger';
import { v3 } from 'cc';
import { Label } from 'cc';
import { Tween } from 'cc';
import { ButtonLock } from '../../../Dress_common/Decorator';
import { ActionEffect } from '../../../Dress_common/effects/ActionEffect';
import { FormatUtil } from '../../../Dress_common/utils/FormatUtil';
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


