import { _decorator, Component, Node } from 'cc';
import { UIUtils } from '../../../Beach_common/utils/UIUtils';
import { CabinetAllData, CabinetData, CellData, ColletType, GameUtil } from '../../GameUtil';
import { EventTouch } from 'cc';
import { Vec3 } from 'cc';
import { v3 } from 'cc';
import { instantiate } from 'cc';
import { Prefab } from 'cc';
import { Colletion } from './Colletion';
import { CellContent } from './CellContent';
import { GameManger } from '../../manager/GameManager';
import { isVaild } from '../../../Beach_common/utils/ViewUtil';
import { ActionEffect } from '../../../Beach_common/effects/ActionEffect';
import { tween } from 'cc';
import { tweenPromise } from '../../../Beach_common/utils/TimeUtil';
import { AudioManager } from '../../manager/AudioManager';
const { ccclass, property } = _decorator;

/**柜子 */
@ccclass('Cabinet')
export class Cabinet extends Component {
    @property(Node)
    cabinet: Node = null;
    @property(Node)
    content: Node = null;
    @property(Prefab)
    colletionPrefab: Prefab = null;

    data: CabinetData;
    /**宽度 */
    private contentW: number;
    public isClear: boolean = false;
    public collects: Colletion[] = [];
    init(len: number, x: number, y: number, index: number) {
        this.data = { x, y, len: len, index };
        UIUtils.setWidth(this.cabinet, GameUtil.CellW * len);
        this.content.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        const cx = [50, 30, 40, 50, 50, 50][len - 1];
        this.content.x = cx;
        this.contentW = GameUtil.CellW * len - cx * 2;
        UIUtils.setWidth(this.content, this.contentW);
    }

    public createCollection(cd: CellData) {
        if (!cd) return;
        const pos = this.getPos(cd.index);
        const c = instantiate(this.colletionPrefab);
        this.content.addChild(c);
        c.position = pos;
        const colletion = c.getComponent(Colletion);
        colletion.init(cd);
        colletion.setParent(this);
        this.collects[cd.index] = colletion;
    }

    private onTouchStart(e: EventTouch) {
        if (GameManger.instance.isAni || GameManger.instance.isGameOver) return;
        const pos = UIUtils.touchNodeChildLocation(this.content, e);
        const cw = this.contentW / this.data.len;
        const index = Math.floor(pos.x / cw);
        // console.log("点击x:" + (index + this.data.x), "y:" + this.data.y);
        const co = this.collects[index];
        if (co && co.inCabinet) {
            AudioManager.playEffect("clickCollecion");
            GameManger.instance.moveToCell(co);
        }
    }
    /**根据收集物的排序计算位置 */
    public getPos(x: number): Vec3 {
        const cw = this.contentW / this.data.len;
        return v3(cw * (x + 0.5), 20);
    }
    /**检查柜子是否清空 */
    public async checkClear() {
        let num = 0;
        this.collects.forEach(v => {
            if (isVaild(v) && v.inCabinet) {
                num++;
            }
        })
        if (num > 0) {
            return false;
        } else {
            await this.clearAni();
        }
    }
    private async clearAni() {
        AudioManager.vibrate(50,200);
        this.isClear = true;
        await ActionEffect.fadeOut(this.node, 0.2);
        this.node.destroy();
        GameManger.instance.clearCabinet();
    }
    public setY(y: number) {
        this.data.y = y;
    }
    /**坠落 */
    public async dropTo(y: number, duration: number = 0.2) {
        this.data.y = y;
        const pos = GameUtil.getCabinetPos(this.data.x, y);
        await tweenPromise(this.node, t => t
            .to(0.2, { position: pos }, { easing: "bounceOut" })
        )
    }
    public backCollet(colletion: Colletion) {
        this.collects[colletion.data.index] = colletion;
    }
    /**返回所有还在的收集物 */
    public getShowCollet() {
        const re: Colletion[] = this.collects.filter(c => c?.inCabinet);
        return re;
    }
    public findCollet(type: ColletType) {
        for (let c of this.collects) {
            if (c && c.inCabinet && c.data.type == type) {
                return c;
            }
        }
    }
    /**返回格子所有数据 */
    public getCabinetAllData(): CabinetAllData {
        const cells: CellData[] = [];
        this.collects.forEach((v, i) => { if (v?.inCabinet) cells[i] = v.data })
        return { cabinet: this.data, cells };
    }
}


