import { _decorator, Component, Node } from 'cc';
import { NumFont } from '../../../Beach_common/ui/NumFont';
import { GameStorage } from '../../GameStorage';
import { ButtonLock } from '../../../Beach_common/Decorator';
import { CoinManger } from '../../manager/CoinManger';
import { v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Coin')
export class Coin extends Component {
    @property(NumFont)
    num: NumFont = null;

    protected onLoad(): void {
        this.showCurCoin();
        this.node.on(Node.EventType.TOUCH_START, this.touch, this); 
    }
    protected start(): void {
        CoinManger.instance.setCoinNode(this);
    }
    showNum(num: number) {
        const str = num.toString();
        this.num.num = str;
        const sc = str.length>5?(5/str.length):1;
        this.num.node.scale = v3(sc,sc);
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


