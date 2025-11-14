import { _decorator, Component, Node } from 'cc';
import ViewComponent from '../../../Beach_common/ui/ViewComponent';
import { Button } from 'cc';
import { DialogComponent } from '../../../Beach_common/ui/DialogComtnet';
import { GameStorage } from '../../GameStorage';
import { GameUtil, RewardType } from '../../GameUtil';
import { ViewManager } from '../../manager/ViewManger';
import { CoinManger } from '../../manager/CoinManger';
import { MoneyManger } from '../../manager/MoneyManger';
import { ReddotManager } from '../../manager/ReddotManager';
import { i18n } from '../../../Beach_common/i18n/I18nManager';
const { ccclass, property } = _decorator;

@ccclass('DailyDialog')
export class DailyDialog extends DialogComponent {
    @property([Node])
    days: Node[] = [];

    onLoad(): void {
        this.init();
        for (let i = 0; i < 7; i++) {
            const dayNode = this.days[i];
            dayNode.on(Button.EventType.CLICK, () => {
                this.touch(dayNode, i + 1);
            }, this);
        }
    }
    private touch(node: Node, day: number) {
        const daily = GameStorage.getDaily();

        if (daily.isReceive) {
            // ViewManager.showTips("Already received it today");
            ViewManager.showTips(i18n.string("str_aritoday"));
        } else {
            if (daily.weekDay == day) {
                const num = GameUtil.SigninCoins[day - 1];
               
                // CoinManger.instance.addCoin(num, false);
                // ViewManager.showRewardAni(RewardType.coin, num, () => { })
               
               
                ViewManager.showRewardCoin(num,()=>{ 
                    GameStorage.signin(GameUtil.getCurDay());
                    this.showReceive(node, true);
                    ReddotManager.instance.showSigninDot();
                });
            }
        }



    }
    onDestroy(): void {
        
    }
    private init() {
        const daily = GameStorage.getDaily();
        if (daily.isReceive) {
            const ld = daily.lastDay;
            const curDay = GameUtil.getCurDay();
            if (curDay - ld > 0) {//刷新新一天
                GameStorage.nextDay(curDay);
            }
        }
        this.showDaily();
    }
    private showDaily() {
        const daily = GameStorage.getDaily();
        for (let i = 0; i < 7; i++) {
            const dayNode = this.days[i];
            const active = (i + 1) < daily.weekDay || ((i + 1) == daily.weekDay && daily.isReceive);
            this.showReceive(dayNode, active);
        }
    }
    private showReceive(node: Node, v: boolean) {
        const mask = node.getChildByName("mask");
        const gou = node.getChildByName("gou");
        mask.active = v;
        gou.active = v;
    }
    private getCurDay() {
        const ct = Date.now();
        // 转换为天数（1天 = 24小时 × 60分钟 × 60秒 × 1000毫秒）
        return Math.floor(ct / (24 * 60 * 60 * 1000));
        // return GameStorage.getDaily().testDay;//测试
    }
}


