import { v3, tween, Tween } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { ActionEffect } from '../../../Beach_common/effects/ActionEffect';
import { LangStorage } from '../../../Beach_common/localStorage/LangStorage';
import { adHelper } from '../../../Beach_common/native/AdHelper';
import { FormatUtil } from '../../../Beach_common/utils/FormatUtil';
import { RewardType } from '../../GameUtil';
import { AudioManager } from '../../manager/AudioManager';
import { MoneyManger } from '../../manager/MoneyManger';
import { ViewManager } from '../../manager/ViewManger';
import { ConfigConst } from '../../manager/ConfigConstManager';
const { ccclass, property } = _decorator;

@ccclass('Bubble')
export class Bubble extends Component {
    @property(Node)
    content: Node = null;
    private readonly duration = 30;
    onLoad() {
        if(ConfigConst.isShowA){
            this.node.destroy();
            return;
        }
        this.init(false);
        this.content.on(Node.EventType.TOUCH_START, this.onClick, this);
    }

    private time = 5;
    private canMove: boolean = true;
    update(deltaTime: number) {
        if (!this.canMove) return;
        this.time -= deltaTime;
        if (this.time <= 0) {
            this.time = this.duration;//半分钟出气泡
            this.node.active = true;
            this.node.position = v3(700, 0);
            tween(this.node)
                .to(7, { position: v3(-450, 1200) })
                .to(7, { position: v3(700, 2400) })
                .call(() => {
                    this.init(false);

                })
                .start();
        }
    }
    private rewardTimes: number = 0;              
    private isAni: boolean = false;
    onClick() {
        if (this.isAni) return;
        this.isAni = true;
        AudioManager.playEffect("click");
        this.canMove = false;

        Tween.stopAllByTarget(this.node);
        ActionEffect.scale(this.content, 0.2, 0, 1);
        this.rewardTimes++;
        const isAd = this.rewardTimes >= ConfigConst.Other.RewardDoubleShowNum;
        if (isAd)
            this.rewardTimes = 0;
        ViewManager.showBigWinDialog(isAd);

    }
    private init(isWait: boolean = true) {
        this.isAni = false;
        this.canMove = true;
        this.node.y = -100;
        this.content.scale = v3(1, 1, 1);
        isWait && (this.time = this.duration);//半分钟出气泡

    }
}


