import { _decorator, Component, Node } from 'cc';
import { GameManger } from '../../manager/GameManager';
import { UIUtils } from '../../../Beach_common/utils/UIUtils';
import { Vec3 } from 'cc';
import { GameUtil } from '../../GameUtil';
import { v3 } from 'cc';
import { EventTouch } from 'cc';
import { Colletion } from './Colletion';
const { ccclass, property } = _decorator;

@ccclass('CleanArea')
/**扫把道具清扫后放入该区域 */
export class CleanArea extends Component {
    public collects: Colletion[] = [];
    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
    }
    private onTouchStart(e: EventTouch) {
        if (GameManger.instance.isAni || GameManger.instance.isGameOver) return;
        const pos = UIUtils.touchNodeChildLocation(this.node, e);
        const cw = GameUtil.DownW;
        const index = Math.floor(pos.x / cw);
        // console.log("点击x:" + (index + this.data.x), "y:" + this.data.y);
        const co = this.collects[index];
        if (co) {
            this.collects.splice(index, 1);
            this.moveAfterCollet(index + 1);
            GameManger.instance.moveToCell(co);
        }
    }

    /**根据收集物的排序计算位置 */
    public getPos(x: number): Vec3 {
        const cw = GameUtil.DownW;
        return v3(cw * (x + 0.5), 0);
    }
    /**移动到该区域 */
    public cleanTo(cos: Colletion[]) {
        cos.forEach((v, i) => {
            const index = this.collects.length;
            this.collects.push(v);
            v.changeParent(this.node);
            v.dropTo(this.getPos(index));
        })
    }
    private async moveAfterCollet(index: number) {
        const pro: Promise<void>[] = [];
        for (let i = index; i < this.collects.length; i++) {//后面的收集品往后移动
            const c = this.collects[i];
            if (c) {
                pro.push(c.cellMoveTo(this.getPos(i)));
            }
        }
        if (pro.length)
            await Promise.any(pro);
    }
}


