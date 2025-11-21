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
import { tweenPromise } from '../../../Beach_common/utils/TimeUtil';
import { v3 } from 'cc';
const { ccclass, property } = _decorator;
/**收集品 */
@ccclass('Colletion')
export class Colletion extends Component {
    @property(Node)
    collection: Node = null;
    @property(Node)
    streak: Node = null;
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
    /**到底部缩放比例 */
    sc: number = 0.8;
    init(data: CellData, isBottom: boolean = false) {
        this.data = data;
        this.setType(data.type);
        if (isBottom) this.collection.scale = v3(this.sc, this.sc, 1);
    }
    setType(type: ColletType) {
        this.data.type = type;
        this.collection.getComponent(Sprite).spriteFrame = this.sf[type - 1];
        let h = UIUtils.getHeight(this.collection);
        this.collection.y = h / 2;
    }
    setParent(parent: Cabinet) {
        this.cabinet = parent;
        this.data.cabinet = this.cabinet.data;
    }
    /**切换父节点，位置不变 */
    changeParent(n: Node) {
        const p = UIUtils.transformOtherNodePos2localNode(this.node, n);
        this.node.position = p;
        n.addChild(this.node);
    }
    /**普通移动 */
    async moveTo(pos: Vec3, duration: number = 0.1): Promise<void> {
        await tweenPromise(this.node, t => t
            .to(duration, { position: pos })
        )
    }
    /**移动到底部 */
    async dropTo(pos: Vec3, duration: number = 0.1): Promise<void> {
        this.streak.active = true;
        await tweenPromise(this.node, t => t
            .to(duration, { position: pos })
        )
        this.streak.active = false;
        this.aniDuang(1.2, 0.9);
    }
    /**在底部横移 */
    async cellMoveTo(pos: Vec3, duration: number = 0.2): Promise<void> {
        await tweenPromise(this.node, t => t
            .to(duration, { position: pos, scale: v3(0.85, 1.05, 1) }, { easing: "backOut" })
            .to(0.1, { scale: v3(1, 1, 1) })
        )

    }
    /**duang一下 */
    private aniDuang(x: number, y: number, time: number = 0.1) {
        tweenPromise(this.node, t => t
            .to(time, { scale: v3(x, y, 1) })
            .to(time, { scale: v3(1, 1, 1) })
        )
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
        let time = 0.1;
        if (this.inCabinet) {
        // this.cabinetData = this.cabinet.data;
            this.inCabinet = false;
            this.cabinet?.checkClear();
            time = 0.2;
        }
        ActionEffect.scale(this.collection, 0.2, this.sc);
        await this.dropTo(pos, time);
        AudioManager.vibrate(50,100);
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


