import { _decorator, Component, Node } from 'cc';
import ViewComponent from './ViewComponent';
import { ActionEffect } from '../effects/ActionEffect';
import { Button } from 'cc';
import { delay, tweenPromise } from '../utils/TimeUtil';
import { NativeFun } from '../native/NativeFun';
import { v3 } from 'cc';
const { ccclass, property } = _decorator;

export class DialogComponent extends ViewComponent {
    @property(Node)
    content: Node = null;
    @property(Node)
    bg: Node = null;
    @property(Node)
    btnClose: Node = null;

    isAni: boolean = false;
    closeCb: Function = null;
    start() {
        this.startAni();
        this.node.on(Node.EventType.TOUCH_START, () => { });
        this.btnClose && this.btnClose.on(Button.EventType.CLICK, this.closeAni, this);
    }
    /**开始动画 */
    async startAni() {
        const time = 0.3;
        if (this.bg) ActionEffect.fadeIn(this.bg, 0.3);
        if (this.content){ 
        //    ActionEffect.scale(this.content, 0.3, 1, 0, "backOut").then(()=>{

        //    })
           this.content.scale = v3();
           tweenPromise(this.content,t=>t
            .to(0.25,{scale:v3(1,1,1)})
            .to(0.1,{scale:v3(1,1.05,1)})
            .to(0.1,{scale:v3(1,0.97,1)})
            .to(0.1,{scale:v3(1,1.02,1)})
            .to(0.1,{scale:v3(1,1,1)})
           )
        }
        if (this.bg || this.content) {
            this.isAni = true;
            await delay(time);
            this.isAni = false;
        }
    }
    /**关闭动画 */
    async closeAni() {
        if (this.isAni) return;
        const time = 0.3;
        // AudioManager.vibrate(1,155);
        this.isAni = true;
        if (this.bg) ActionEffect.fadeOut(this.bg, time);
        if (this.content) ActionEffect.scale(this.content, time, 0, 1, "backIn");
        if (!this.bg && !this.content) ActionEffect.fadeOut(this.node, time);
        await delay(time, this.node);
        this.node.destroy();
        this.closeCb?.();
    }

}


