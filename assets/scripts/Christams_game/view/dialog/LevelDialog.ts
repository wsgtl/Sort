import { _decorator, Component, Node } from 'cc';
import { AudioManager } from '../../manager/AudioManager';
import { sp } from 'cc';
import { ActionEffect } from '../../../Christams_common/effects/ActionEffect';
import { DialogComponent } from '../../../Christams_common/ui/DialogComtnet';
import { NumFont } from '../../../Christams_common/ui/NumFont';
import { delay } from '../../../Christams_common/utils/TimeUtil';
import { Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LevelDialog')
export class LevelDialog extends DialogComponent {
    @property(Label)
    level: Label = null;
    @property(sp.Skeleton)
    sp: sp.Skeleton = null;

    show(parent: Node, args?: any): void {
        parent.addChild(this.node);
        this.level.string = args.level;
        delay(2).then(async () => {
            await this.closeAni();
            args.cb?.();
        })
    }


    /**开始动画 */
    async startAni() {
        AudioManager.playEffect("darts");
        ActionEffect.fadeIn(this.bg, 0.3);
        await ActionEffect.skAniOnce(this.sp,"idle",true);
        // ActionEffect.skAni(this.sp,"loop");
    }
}


