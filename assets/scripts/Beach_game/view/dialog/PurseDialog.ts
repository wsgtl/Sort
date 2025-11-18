import { _decorator, Component, Node } from 'cc';
import { DialogComponent } from '../../../Beach_common/ui/DialogComtnet';
import { MoneyManger } from '../../manager/MoneyManger';
import { view } from 'cc';
import { UIUtils } from '../../../Beach_common/utils/UIUtils';
import { delay } from '../../../Beach_common/utils/TimeUtil';
import { ActionEffect } from '../../../Beach_common/effects/ActionEffect';
import { v3 } from 'cc';
import { NumFont } from '../../../Beach_common/ui/NumFont';
import { GameStorage } from '../../GameStorage';
import { Label } from 'cc';
import { GameUtil } from '../../GameUtil';
import { i18n } from '../../../Beach_common/i18n/I18nManager';
import { LangStorage } from '../../../Beach_common/localStorage/LangStorage';
import { FormatUtil } from '../../../Beach_common/utils/FormatUtil';
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
            // v.string = GameUtil.PurseTips[i];
            v.string = i18n.string("purse_tip_" + (i + 1));
        })
        MoneyManger.instance.getMoneyNode().showTips();
    }
    // private topAni() {
    //     ActionEffect.scale(this.top, 0.3, 1, 0, "backOut");
    //     delay(4, this.node).then(() => {
    //         ActionEffect.fadeOut(this.top);
    //     })
    // }
    fit() {
        const h = view.getVisibleSize().y;
        const sh = 410 + (h - 1920) / 2;
        UIUtils.setHeight(this.scorll, sh);
        UIUtils.setHeight(this.scorll.children[0], sh);

        const mn = MoneyManger.instance.getMoneyNode();
        // if (mn) {
        //     const p = UIUtils.transformOtherNodePos2localNode(mn.node, this.top);
        //     this.top.y = p.y - 50;
        // }

    }

    protected onDestroy(): void {
        MoneyManger.instance.setDialog(null);//注销记录的弹窗
    }
}


