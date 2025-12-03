import { sp } from 'cc';
import { SpriteFrame } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { PropType } from '../../GameUtil';
import { Sprite } from 'cc';
import { AudioManager } from '../../manager/AudioManager';
import { v3 } from 'cc';
import { ActionEffect } from '../../../Christams_common/effects/ActionEffect';
import { delay, tweenPromise } from '../../../Christams_common/utils/TimeUtil';
import { UIUtils } from '../../../Christams_common/utils/UIUtils';
const { ccclass, property } = _decorator;

@ccclass('PropAni')
export class PropAni extends Component {
    @property(sp.Skeleton)
    sk: sp.Skeleton = null;
    @property(Node)
    prop: Node = null;
    @property(Node)
    click: Node = null;
    @property([Node])
    btns: Node[] = [];
    @property([SpriteFrame])
    sfs: SpriteFrame[] = [];

    type: PropType;
    private curBtn: Node;
    protected onLoad(): void {
        // this.node.active = false;
    }
    /**道具领取动画 */
    async showAni(type: PropType) {
        this.node.active = true;
        this.prop.active = false;
        this.click.active = true;
        await delay(0.3);
        this.prop.active = true;
        this.type = type;
        this.curBtn = this.btns[type - 1];
        this.prop.getComponent(Sprite).spriteFrame = this.sfs[type - 1];

        const toP = UIUtils.transformOtherNodePos2localNode(this.curBtn, this.prop);
        this.prop.position = v3();
        tweenPromise(this.prop, t => t.to(0.5, { position: toP }))
        await delay(0.3);

        AudioManager.playEffect("clear");
        this.sk.node.position = v3(toP.x + 15, toP.y);
        this.sk.node.scale = v3(1.5, 1.5);
        ActionEffect.skAniOnce(this.sk, "animation", false, 1).then(() => {
            this.node.active = false;
        })
        await delay(0.2);
        this.prop.active = false;
        this.click.active = false;
    }
}



