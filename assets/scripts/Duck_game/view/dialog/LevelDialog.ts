import { _decorator, Component, Node } from 'cc';
import { DialogComponent } from '../../../Duck_common/ui/DialogComtnet';
import { NumFont } from '../../../Duck_common/ui/NumFont';
import { tween } from 'cc';
import { ActionEffect } from '../../../Duck_common/effects/ActionEffect';
import { delay } from '../../../Duck_common/utils/TimeUtil';
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
        delay(2).then(async () => {
            await this.closeAni();
            args.cb?.();
        })
    }


    /**开始动画 */
    async startAni() {
        AudioManager.playEffect("darts");
        delay(0.5).then(()=>{AudioManager.playEffect("duck",0.5)});//鸭子叫
        ActionEffect.fadeIn(this.bg, 0.3);
        await ActionEffect.skAniOnce(this.sp,"idle",true);
    }
}


