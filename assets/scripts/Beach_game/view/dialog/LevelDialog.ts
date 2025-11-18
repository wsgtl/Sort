import { _decorator, Component, Node } from 'cc';
import { DialogComponent } from '../../../Beach_common/ui/DialogComtnet';
import { NumFont } from '../../../Beach_common/ui/NumFont';
import { tween } from 'cc';
import { ActionEffect } from '../../../Beach_common/effects/ActionEffect';
import { delay } from '../../../Beach_common/utils/TimeUtil';
import { AudioManager } from '../../manager/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('LevelDialog')
export class LevelDialog extends DialogComponent {
    @property(NumFont)
    level: NumFont = null;

    private isWin: boolean = false;
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
        ActionEffect.fadeIn(this.bg, 0.3);
        this.content.x = -300;
        tween(this.content)
            .to(0.5, { x: 0 }, { easing: "backOut" })
            .start();
    }
}


