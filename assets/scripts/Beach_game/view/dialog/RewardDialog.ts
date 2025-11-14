import { _decorator, Component, Node } from 'cc';
import { DialogComponent } from '../../../Beach_common/ui/DialogComtnet';
import { SpriteFrame } from 'cc';
import { NumFont } from '../../../Beach_common/ui/NumFont';
import { Sprite } from 'cc';
import { RewardType } from '../../GameUtil';
import { MathUtil } from '../../../Beach_common/utils/MathUtil';
import { Button } from 'cc';
import { adHelper } from '../../../Beach_common/native/AdHelper';
import { GameStorage } from '../../GameStorage';
import { CoinManger } from '../../manager/CoinManger';
import { MoneyManger } from '../../manager/MoneyManger';
import { ViewManager } from '../../manager/ViewManger';
import { AudioManager } from '../../manager/AudioManager';
import { delay } from '../../../Beach_common/utils/TimeUtil';
import { ActionEffect } from '../../../Beach_common/effects/ActionEffect';
import { isVaild } from '../../../Beach_common/utils/ViewUtil';
import { Vec3 } from 'cc';
import { UIUtils } from '../../../Beach_common/utils/UIUtils';
import { GuideManger } from '../../manager/GuideManager';
import { Money } from '../component/Money';
import { LangStorage } from '../../../Beach_common/localStorage/LangStorage';
const { ccclass, property } = _decorator;

@ccclass('RewardDialog')
export class RewardDialog extends DialogComponent {
    @property(Node)
    btnReceive: Node = null;
    @property(Node)
    btnNo: Node = null;
    @property(Node)
    iconNode: Node = null;
    @property([Node])
    titleNode: Node[] = [];
    @property(NumFont)
    num: NumFont = null;


    type: RewardType;
    cb: Function;
    private rewardNum: number = 1;//奖励数量
    private reciveNum: number = 1;//看广告领取倍率
    show(parent: Node, args?: any) {
        parent.addChild(this.node);
        this.init(args.type);
        this.cb = args.cb;
    }
    init(type: RewardType) {
        AudioManager.playEffect("reward", 2);
        this.type = type;
        for (let i = 1; i <= 3; i++) {
            this.iconNode.getChildByName("icon" + i).active = type == i;
        }
        this.titleNode.forEach((v, i) => {
            v.active = i == type - 1;
        })
        if (type == RewardType.money) {
            this.showReciveNum(2);
            const data = LangStorage.getData();
            this.rewardNum = Math.floor(MathUtil.random(5, 20) * data.rate);
            this.num.num = data.symbol + this.rewardNum;
            this.showMoneyNode();
        } else if (type == RewardType.coin) {
            this.showReciveNum(2);
            this.rewardNum = MathUtil.random(3, 10);
            this.num.num = "x" + this.rewardNum;
        } else {
            this.showReciveNum(1);
            this.rewardNum = 1;
            this.num.num = "x" + this.rewardNum;
        }
        this.btnNo.once(Button.EventType.CLICK, this.onBtnNo, this);
        this.btnReceive.on(Button.EventType.CLICK, this.onBtnReceive, this);

        this.btnNo.active = false;
        delay(1.5, this.btnNo).then(() => {
            if (!isVaild(this.btnNo)) return;
            this.btnNo.active = true;
            ActionEffect.fadeIn(this.btnNo, 0.5);
        })

    }
    private showReciveNum(n: number) {
        this.reciveNum = n;
        this.btnReceive.getChildByName("r1").active = n == 1;
        this.btnReceive.getChildByName("r2").active = n == 2;
    }
    onBtnNo() {
        this.closeAni();
        if (!this.addCash(0))
            this.addReward(this.rewardNum);
        if (GameStorage.getCurLevel() > 1) {//第二局后有概率弹插屏广告
            adHelper.timesToShowInterstitial();
        }
    }
    onBtnReceive() {
        adHelper.showRewardVideo(() => {
            this.closeAni();
            if (!this.addCash(this.rewardNum))
                this.addReward(this.rewardNum * this.reciveNum);
        }, ViewManager.adNotReady)
    }
    private addReward(num: number) {
        const type = this.type;
        if (type == RewardType.money) {
            MoneyManger.instance.addMoney(num, false);
        } else if (type == RewardType.coin) {
            CoinManger.instance.addCoin(num, false);
        } else {
            GameStorage.addCash(num);
        }
        ViewManager.showRewardAni(type, num, this.cb);
    }

    addCash(addNum: number) {
        if (this.type != RewardType.cash) return false;
        if (!GameStorage.getIsCash() || addNum > 0) {
            GameStorage.setIsCash();
            ViewManager.showCash(null, addNum, this.cb);
        }
        return true;
    }

    protected onDestroy(): void {
        this.mnBack();
    }


    private mn: Node;
    private mnParent: Node;
    private mnPos: Vec3;
    private mnIndex: number;
    showMoneyNode() {
        const money = MoneyManger.instance.getMoneyNode();
        money.showTips();
        const mn = money.node;
        this.mnPos = mn.position.clone();
        this.mn = mn;
        this.mnParent = mn.parent;
        this.mnIndex = mn.getSiblingIndex();
        UIUtils.changeParent(mn, this.node.parent);
        this.mn.getComponent(Money).setBtnInter(false);
    }
    mnBack() {
        if (isVaild(this.mn) && isVaild(this.mnParent)) {
            this.mn.position = this.mnPos;
            this.mnParent.insertChild(this.mn, this.mnIndex);
            this.mn.getComponent(Money).setBtnInter(true);
        } else {
            this.mn?.destroy();
        }
    }
}


