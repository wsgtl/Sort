import { _decorator, Component, Node } from 'cc';
import { DialogComponent } from '../../../Beach_common/ui/DialogComtnet';
import { NumFont } from '../../../Beach_common/ui/NumFont';
import { tween } from 'cc';
import { ActionEffect } from '../../../Beach_common/effects/ActionEffect';
import { delay } from '../../../Beach_common/utils/TimeUtil';
import { AudioManager } from '../../manager/AudioManager';
import { sp } from 'cc';
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
        delay(1.5).then(async () => {
            await this.closeAni();
            args.cb?.();
        })
    }


    /**开始动画 */
    async startAni() {
        AudioManager.playEffect("darts");
        AudioManager.playEffect("dog");//狗叫
        ActionEffect.fadeIn(this.bg, 0.3);
        await ActionEffect.skAniOnce(this.sp,"animation",true);
        ActionEffect.skAni(this.sp,"loop");
    }
}


