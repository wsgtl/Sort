import { _decorator, Component, Node } from 'cc';
import { MoneyManger } from '../../manager/MoneyManger';
import { view } from 'cc';
import { v3 } from 'cc';
import { Label } from 'cc';
import { ActionEffect } from '../../../Dress_common/effects/ActionEffect';
import { i18n } from '../../../Dress_common/i18n/I18nManager';
import { EventTracking } from '../../../Dress_common/native/EventTracking';
import { DialogComponent } from '../../../Dress_common/ui/DialogComtnet';
import { delay } from '../../../Dress_common/utils/TimeUtil';
import { UIUtils } from '../../../Dress_common/utils/UIUtils';
const { ccclass, property } = _decorator;

@ccclass('PurseDialog')
export class PurseDialog extends DialogComponent {
    @property(Node)
    scorll: Node = null;
    @property(Node)
    numbg: Node = null;
    @property(Label)
    num: Label = null;
    @property([Label])
    tips: Label[] = [];
    onLoad() {
        this.fit();
        MoneyManger.instance.setDialog(this.node);
        // this.topAni();
        const str = MoneyManger.instance.getMoneyString();
        this.num.string = str;
        if (str.length > 8) {
            const sc = 8 / str.length;
            this.numbg.scale = v3(sc, sc);
        }
        this.tips.forEach((v, i) => {
            v.string = i18n.string("purse_tip_" + (i + 1));
        })
    }

    fit() {
        const h = view.getVisibleSize().y;
        const sh = 410 + (h - 1920) / 2;
        UIUtils.setHeight(this.scorll, sh);
        UIUtils.setHeight(this.scorll.children[0], sh);

    }

    protected onDestroy(): void {
        EventTracking.sendOneEvent("backHome");
        MoneyManger.instance.setDialog(null);//注销记录的弹窗
    }

    /**关闭动画 */
    async closeAni() {
        if (this.isAni) return;
        const time = 0.3;
        // AudioManager.vibrate(1,155);
        this.isAni = true;
        ActionEffect.fadeOut(this.bg, time);
        ActionEffect.fadeOut(this.scorll, time);
        ActionEffect.scale(this.content, time, 0, 1, "backIn");

        await delay(time, this.node);
        this.node.destroy();
        this.closeCb?.();
    }
}


