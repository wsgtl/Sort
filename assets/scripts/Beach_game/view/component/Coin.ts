import { _decorator, Component, Node } from 'cc';
import { NumFont } from '../../../Beach_common/ui/NumFont';
import { GameStorage } from '../../GameStorage';
import { ButtonLock } from '../../../Beach_common/Decorator';
import { CoinManger } from '../../manager/CoinManger';
import { v3 } from 'cc';
import { Label } from 'cc';
import { FormatUtil } from '../../../Beach_common/utils/FormatUtil';
const { ccclass, property } = _decorator;

@ccclass('Coin')
export class Coin extends Component {
    @property(Label)
    num: Label = null;

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
    showCurCoin() {
        this.showNum(GameStorage.getCoin());
    }
    @ButtonLock(1)
    touch() {
        CoinManger.instance.showDialog();
    }
    protected onDestroy(): void {
        CoinManger.instance.setCoinNode(null);
    }
}


