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
const { ccclass, property } = _decorator;

@ccclass('GuideHome')
export class GuideHome extends ViewComponent {
    @property(Node)
    guideNode: Node = null;
    @property(Node)
    btnPlay: Node = null;
    @property(DialogBox)
    box: DialogBox = null;
    @property(Hand)
    handNode: Hand = null;
    onLoad() {
        this.btnPlay.on(Button.EventType.CLICK, () => {
            ViewManager.showGameView();
            GuideManger.passHomeStep();
        }, this);
        this.box.init(0);
        this.setp1();
    }
    private async setp1() {
        this.guideNode.active = true;
        this.btnPlay.active = false; 
        ActionEffect.fadeIn(this.guideNode,0.3);
        this.box.ani();
        await delay(1.5);
        this.guideNode.once(Node.EventType.TOUCH_START,this.setp2,this);
    }
    private async setp2() {
        this.guideNode.active = false;
        this.btnPlay.active = true;
        this.btnPlay.getComponent(Widget).updateAlignment();
        this.handNode.node.position = this.btnPlay.position;
        this.handNode.node.x += 50;
        this.handNode.play(true, true);
    }
}


