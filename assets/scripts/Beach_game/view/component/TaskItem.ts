import { _decorator, Component, Node } from 'cc';
import { NumFont } from '../../../Beach_common/ui/NumFont';
import { Progress2 } from './Progress2';
import { GameUtil, RewardType } from '../../GameUtil';
import { Button } from 'cc';
import { CoinManger } from '../../manager/CoinManger';
import { GameStorage } from '../../GameStorage';
import { ViewManager } from '../../manager/ViewManger';
import { ReddotManager } from '../../manager/ReddotManager';
const { ccclass, property } = _decorator;

@ccclass('TaskItem')
export class TaskItem extends Component {
    @property(NumFont)
    level: NumFont = null;
    @property(Progress2)
    progress: Progress2 = null;
    @property(NumFont)
    jd: NumFont = null;
    @property(NumFont)
    coins: NumFont = null;
    @property(Node)
    btnReceive: Node = null;
    @property(Node)
    btnClaim: Node = null;
    @property(Node)
    onmission: Node = null;

    private levelNum: number = 0;
    private coinNum: number = 0;
    init(level: number, curLevel: number, isReceive: boolean) {
        this.levelNum = level;
        this.level.num = level;
        const cur = curLevel - 1;
        this.jd.num = cur + "_" + level;
        this.progress.progress = cur / level;
        const coin = GameUtil.TaskCoin[level - 1];
        this.coinNum = coin;
        this.coins.num = coin;
        const isCanClaim: boolean = curLevel > level;
        const status = isCanClaim ? (isReceive ? 2 : 1) : 3;
        this.btnShow(status);
        this.btnClaim.once(Button.EventType.CLICK, this.onClaim, this);
    }
    private btnShow(status: number) {
        this.btnClaim.active = status == 1;
        this.btnReceive.active = status == 2;
        this.onmission.active = status == 3;
    }
    private onClaim() {
        this.btnShow(2);
        CoinManger.instance.addCoin(this.coinNum, false);
        ViewManager.showRewardAni(RewardType.coin, this.coinNum, () => { });
        GameStorage.receiveTask(this.levelNum);
        ReddotManager.instance.showTaskDot();
    }
}


