import { _decorator, Component, Node } from 'cc';
import { DialogComponent } from '../../../Beach_common/ui/DialogComtnet';
import { Progress2 } from '../component/Progress2';
import { NumFont } from '../../../Beach_common/ui/NumFont';
import { GameStorage } from '../../GameStorage';
import { GameUtil } from '../../GameUtil';
import { tween } from 'cc';
import { Label } from 'cc';
import { ActionEffect } from '../../../Beach_common/effects/ActionEffect';
import { delay } from '../../../Beach_common/utils/TimeUtil';
import { AudioManager } from '../../manager/AudioManager';
import { v3 } from 'cc';
import { i18n } from '../../../Beach_common/i18n/I18nManager';
import { LangStorage } from '../../../Beach_common/localStorage/LangStorage';
const { ccclass, property } = _decorator;

@ccclass('Cash')
export class Cash extends DialogComponent {
    @property(Progress2)
    progress: Progress2 = null;
    @property(NumFont)
    num: NumFont = null;
    @property(Node)
    icon: Node = null;
    @property(Node)
    shine: Node = null;
    @property(Label)
    add: Label = null;
    @property(Label)
    tipsLabel: Label = null;

    cb: Function;
    show(parent: Node, args?: any): void {
        parent.addChild(this.node);
        this.showNum();
        if (args.addNum > 0) {
            delay(0.4).then(() => {
                this.addCashAni(args.addNum);
            })
        }
        const data = LangStorage.getData();
        const num = Math.floor(100 * data.rate);//根据汇率计算数值
        this.tipsLabel.string = i18n.string("str_citw", data.symbol + num);
    }
    private showNum() {
        const n = GameStorage.getCash();
        this.num.num = n + "_" + GameUtil.CashWithdrawNum;
        this.progress.progress = n / GameUtil.CashWithdrawNum;
    }
    /**增加兑换券动画 */
    private addCashAni(num: number) {
        AudioManager.playEffect("good");
        GameStorage.addCash(num);
        tween(this.icon)
            .to(0.2, { y: 30 })
            .to(0.2, { y: 0 })
            .start();
        tween(this.shine)
            .to(0.3, { scale: v3(1.5, 1.5) })
            .to(0.3, { scale: v3(1, 1) })
            .start();
        delay(0.1).then(() => {
            this.add.node.active = true;
            this.add.string = "+" + num;
            this.add.node.y = 0;
            tween(this.add.node)
                .to(0.5, { y: 150 })
                .start();
            ActionEffect.fadeOut(this.add.node, 0.7);
        })

        this.showNum();
    }
    protected onDestroy(): void {
        this.cb?.();
    }
}


