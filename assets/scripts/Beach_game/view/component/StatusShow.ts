import { Sprite } from 'cc';
import { RichText } from 'cc';
import { Label } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { FormatUtil } from '../../../Beach_common/utils/FormatUtil';
import { GameStorage } from '../../GameStorage';
import { MoneyManger } from '../../manager/MoneyManger';
import { view } from 'cc';
import { GameManger } from '../../manager/GameManager';
const { ccclass, property } = _decorator;

@ccclass('StatusShow')
export class StatusShow extends Component {
    @property(Label)
    moneyNum: Label = null;
    @property(Label)
    jdNum: Label = null;
    @property(Sprite)
    jd: Sprite = null;
    @property(RichText)
    tips: RichText = null;

    protected onLoad(): void {
        this.moneyNum.string = MoneyManger.instance.getMoneyString();

        const y = this.node.y;
        const h = view.getVisibleSize().y - 1920;
        this.node.y = y - h * 0.3;

        const n = GameManger.instance.getCollectNum();
        this.tips.string = `Matching <color=#ee521f>${n.all}</color> items this level`;
        this.jdNum.string = n.clear + "/" + n.all;
        this.jd.fillRange = n.clear / n.all;
    }
}


