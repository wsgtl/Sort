import { _decorator, Component, Node } from 'cc';
import { AudioManager } from '../../manager/AudioManager';
import { sp } from 'cc';
import { ActionEffect } from '../../../Dress_common/effects/ActionEffect';
import { DialogComponent } from '../../../Dress_common/ui/DialogComtnet';
import { NumFont } from '../../../Dress_common/ui/NumFont';
import { delay, tweenPromise } from '../../../Dress_common/utils/TimeUtil';
import { Label } from 'cc';
import { v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LevelDialog')
export class LevelDialog extends DialogComponent {
    @property(NumFont)
    level: NumFont = null;
    @property(sp.Skeleton)
    sp: sp.Skeleton = null;

    show(parent: Node, args?: any): void {
        parent.addChild(this.node);
        this.level.num = args.level;
        delay(2).then(async () => {
            await this.closeAni();
            args.cb?.();
        })
    }


    /**开始动画 */
    async startAni() {
        AudioManager.playEffect("darts");
        ActionEffect.fadeIn(this.bg, 0.3);
        // ActionEffect.scale(this.sp.node,0.3,1,0,"bounceOut");
        const sn = this.sp.node.parent;
        sn.scale = v3();
        sn.angle = 90;
        tweenPromise(sn,t=>t.to(0.3,{scale:v3(1,1,1),angle:0},{easing:"backOut"}))
        // await ActionEffect.skAniOnce(this.sp,"idle",true);
        // ActionEffect.skAni(this.sp,"loop");
    }
}


