import { _decorator, Component, Node } from 'cc';
import ViewComponent from '../../../Beach_common/ui/ViewComponent';
import { Button } from 'cc';
import { ViewManager } from '../../manager/ViewManger';
import { GuideManger } from '../../manager/GuideManager';
import { TipsAni } from './TipsAni';
import { delay, nextFrame } from '../../../Beach_common/utils/TimeUtil';
import { Hand } from './Hand';
import { Prefab } from 'cc';
import { instantiate } from 'cc';
import { Widget } from 'cc';
import { ActionEffect } from '../../../Beach_common/effects/ActionEffect';
import { DialogBox } from './DialogBox';
import { view, v3 } from 'cc';
import { EventTracking } from '../../../Beach_common/native/EventTracking';
import { UIUtils } from '../../../Beach_common/utils/UIUtils';
const { ccclass, property } = _decorator;

@ccclass('GuideHome')
export class GuideHome extends ViewComponent {
    @property(Node)
    bg:Node = null;
    @property(Node)
    btnStart:Node = null;
    @property(TipsAni)
    tips:TipsAni = null;

    private isAni:boolean = false;
    protected start(): void {
        // EventTracking.sendOneEvent("guideHome");
        const y = view.getVisibleSize().y;
        this.bg.scale=v3(1,y/UIUtils.getHeight(this.bg));
        this.tips.init();
        this.tips.startAni(3);
        this.btnStart.on(Button.EventType.CLICK,()=>{
            if(this.isAni)return;
            // EventTracking.sendOneEvent("guideHomeClick");
            this.isAni = true;
            ViewManager.showGameView();
            // GuideManger.passCashStep();
        })
    }

}


