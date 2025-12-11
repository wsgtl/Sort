import { _decorator, Component, Node } from 'cc';
import { v3 } from 'cc';
import { ActionEffect } from '../../../Dress_common/effects/ActionEffect';
import { tweenPromise, delay } from '../../../Dress_common/utils/TimeUtil';
const { ccclass, property } = _decorator;

@ccclass('AddCellTips')
export class AddCellTips extends Component {
    @property(Node)
    tips: Node = null;

    protected onLoad(): void {
        this.tips.active = false;
    }
    private t = 0;
    private isAni: boolean = false;
    update(deltaTime: number) {
        this.t += deltaTime;
        if (this.t > 5) {
            this.showAni();
        }
    }
    public async showAni() {
        if (this.isAni || !this.node.active) return;
        this.t = 0;
        this.isAni = true;
        this.tips.active = true;
        this.tips.active = true;
        await ActionEffect.scale(this.tips,0.2,1,0,"backOut");
        await tweenPromise(this.tips, t => t
            .delay(0.3)
            .to(0.2, { scale: v3(1.1, 0.9) })
            .to(0.2, { scale: v3(0.9, 1.1) })
            .to(0.1, { scale: v3(1, 1) })
        )
        await tweenPromise(this.tips, t => t
            .delay(0.3)
            .to(0.2, { scale: v3(1.1, 0.9) })
            .to(0.2, { scale: v3(0.9, 1.1) })
            .to(0.1, { scale: v3(1, 1) })
        )
        await delay(1,this.node);
        this.tips.active = false;
        this.isAni = false;
    }
}


