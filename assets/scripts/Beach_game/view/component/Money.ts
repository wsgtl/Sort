import { _decorator, Component, Node } from 'cc';
import { NumFont } from '../../../Beach_common/ui/NumFont';
import { GameStorage } from '../../GameStorage';
import { Button } from 'cc';
import { FormatUtil } from '../../../Beach_common/utils/FormatUtil';
import { ButtonLock } from '../../../Beach_common/Decorator';
import { MoneyManger } from '../../manager/MoneyManger';
import { ActionEffect } from '../../../Beach_common/effects/ActionEffect';
import { delay } from '../../../Beach_common/utils/TimeUtil';
import { Tween } from 'cc';
import { UIUtils } from '../../../Beach_common/utils/UIUtils';
import { LangStorage } from '../../../Beach_common/localStorage/LangStorage';
import { v3 } from 'cc';
import { Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Money')
export class Money extends Component {
    @property(Label)
    num: Label = null;
    @property(Node)
    btnGet: Node = null;
    @property(Node)
    tip: Node = null;

    protected onLoad(): void {
        this.showCurMoney();
        this.btnGet.on(Button.EventType.CLICK, this.onGet, this);
        MoneyManger.instance.setMoneyNode(this);
    }
    showNum(num: number) {
        const str = FormatUtil.toMoneyLabel(num);
        this.num.string = str;
        const sc = str.length > 7 ? (7 / str.length) : 1;
        this.num.node.scale = v3(sc, sc);
    }
    showCurMoney() {
        this.showNum(GameStorage.getMoney());
    }
    @ButtonLock(1)
    onGet() {
        MoneyManger.instance.showDialog();
    }

    showTips() {
        Tween.stopAllByTarget(this.tip);
        UIUtils.setAlpha(this.tip, 1);
        this.tip.active = true;
        ActionEffect.scale(this.tip, 0.3, 1, 0, "backOut");
        delay(4, this.tip).then(() => {
            ActionEffect.fadeOut(this.tip);
        })
    }
    /**设置按钮是否可点击 */
    setBtnInter(v: boolean) {
        this.btnGet.getComponent(Button).interactable = v;
    }
}


