import { SpriteFrame } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { CabinetData, CellData, ColletType, GameUtil } from '../../GameUtil';
import { Sprite } from 'cc';
import { Cabinet } from './Cabinet';
import { Vec3 } from 'cc';
import { tween } from 'cc';
import { UIUtils } from '../../../Beach_common/utils/UIUtils';
import { ActionEffect } from '../../../Beach_common/effects/ActionEffect';
import { GameManger } from '../../manager/GameManager';
import { AudioManager } from '../../manager/AudioManager';
const { ccclass, property } = _decorator;
/**收集品 */
@ccclass('Colletion')
export class Colletion extends Component {
    @property(Node)
    collection: Node = null;
    @property(Sprite)
    effect: Sprite = null;
    @property([SpriteFrame])
    sf: SpriteFrame[] = [];

    data: CellData;
    cabinet: Cabinet;
    /**是否在柜子中 */
    inCabinet: boolean = true;
    /**第几个被点击的 */
    step: number = 0;
    cabinetData: CabinetData;
    init(data: CellData) {
        this.data = data;
        this.setType(data.type);
    }
    setType(type: ColletType) {
        this.data.type = type;
        this.collection.getComponent(Sprite).spriteFrame = this.sf[type - 1];
    }
    setParent(parent: Cabinet) {
        this.cabinet = parent;
    }
    /**切换父节点，位置不变 */
    changeParent(n: Node) {
        const p = UIUtils.transformOtherNodePos2localNode(this.node, n);
        this.node.position = p;
        n.addChild(this.node);
    }
    moveTo(pos: Vec3, duration: number = 0.1): Promise<void> {
        return new Promise<void>(res => {
            tween(this.node)
                .to(duration, { position: pos })
                .call(() => { res(); })
                .start();
        })
    }
    async shuffleMoveEnd() {
        const con = this.cabinet.content
        const p = this.cabinet.getPos(this.data.index);
        const toP = UIUtils.transformOtherPos2localNode(p, con, this.node);
        ActionEffect.scale(this.collection, 0.2, 1);
        await ActionEffect.moveTo(this.node, 0.3, toP.x, toP.y);
        con.addChild(this.node);
        this.node.position = p;
    }
    async moveToCells(pos: Vec3) {
        AudioManager.playEffect("drop");
        this.cabinetData = this.cabinet.data;
        this.inCabinet = false;
        this.cabinet.checkClear();
        ActionEffect.scale(this.collection, 0.2, 0.8);
        await this.moveTo(pos, 0.3);
    }
    async moveBack(cabinet: Cabinet) {
        this.cabinet = cabinet;
        const con = this.cabinet.content
        const p = this.cabinet.getPos(this.data.index);
        const toP = UIUtils.transformOtherPos2localNode(p, con, this.node);
        ActionEffect.scale(this.collection, 0.2, 1);
        await ActionEffect.moveTo(this.node, 0.2, toP.x, toP.y);
        con.addChild(this.node);
        this.node.position = p;
        this.inCabinet = true;
    }
    async clearAni() {
        this.effect.node.active = true;
        ActionEffect.fadeOut(this.collection, 0.5);
        await ActionEffect.playAni(this.effect, 6, 0.1);
        this.node.destroy();
    }
}


