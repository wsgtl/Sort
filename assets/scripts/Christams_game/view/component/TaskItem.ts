import { _decorator, Component, Node } from 'cc';
import { Progress2 } from './Progress2';
import { GameUtil, RewardType } from '../../GameUtil';
import { Button } from 'cc';
import { GameStorage } from '../../GameStorage';
import { ViewManager } from '../../manager/ViewManger';
import { ReddotManager } from '../../manager/ReddotManager';
import { Label } from 'cc';
import { ConfigConst } from '../../manager/ConfigConstManager';
import { i18n } from '../../../Christams_common/i18n/I18nManager';
import { LangStorage } from '../../../Christams_common/localStorage/LangStorage';
import { delay } from '../../../Christams_common/utils/TimeUtil';
import { isVaild } from '../../../Christams_common/utils/ViewUtil';
const { ccclass, property } = _decorator;

@ccclass('TaskItem')
export class TaskItem extends Component {
    @property(Progress2)
    progress: Progress2 = null;
    @property(Label)
    jd: Label = null;
    @property(Label)
    taskminutes: Label = null;
    @property(Node)
    btnReceive: Node = null;
    @property(Node)
    btnClaim: Node = null;
    @property(Node)
    onmission: Node = null;

    private levelNum: number = 0;
    private addMoney: number = 0;
    init(level: number, curTime: number, isCanClaim: boolean) {
        this.levelNum = level;
        const time = GameUtil.TaskMinutes[level];
        this.taskminutes.string = i18n.string("str_task_minutes", time.toString());
        this.addMoney = ConfigConst.Other.TaskMoney * LangStorage.getData().rate;
        const cur = Math.min(curTime,time);
        this.jd.string = cur + "/" + time;
        this.progress.progress = cur / time;
        const status = isCanClaim ? 1 : 3;
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
        ViewManager.showReward(this.addMoney, true, async () => {
            await delay(1.5)
            if (isVaild(this.node)) {
                this.node.destroy();
            }
        })
        // ViewManager.showRewardAni1(RewardType.money, this.addMoney, () => { });
        // MoneyManger.instance.addMoney(this.addMoney);
        GameStorage.receiveTask(this.levelNum);
        ReddotManager.instance.showTaskDot();
    }
}


