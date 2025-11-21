import { _decorator, Component, Node } from 'cc';
import { Colletion } from './Colletion';
import { Vec3 } from 'cc';
import { v3 } from 'cc';
import { GameManger } from '../../manager/GameManager';
import { delay } from '../../../Beach_common/utils/TimeUtil';
import { Cabinet } from './Cabinet';
import { CabinetData, CellData, ColletType, GameUtil, RewardType } from '../../GameUtil';
import { AudioManager } from '../../manager/AudioManager';
import { GameStorage } from '../../GameStorage';
import { ViewManager } from '../../manager/ViewManger';
import { GuideManger } from '../../manager/GuideManager';
import { CleanArea } from './CleanArea';
import { v2 } from 'cc';
import { CoinManger } from '../../manager/CoinManger';
import { Prefab } from 'cc';
import { instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CellContent')
export class CellContent extends Component {
    @property(Node)
    btnCell: Node = null;
    @property(CleanArea)
    cleanArea: CleanArea = null;
    public collects: Colletion[] = [];

    onLoad() {
        this.showBtnCell();
        this.btnCell.on(Node.EventType.TOUCH_START, () => {
            if (GuideManger.isGuide()) return;
            ViewManager.showAddCell(() => { this.showBtnCell(); })
        }, this);
    }
    private showBtnCell() {
        this.btnCell.active = !GameStorage.isCellLock(GameStorage.getCurLevel());
    }

    public async toCells(collet: Colletion) {
        GameManger.instance.isAni = true;
        let index = 0;
        const type = collet.data.type;
        const clear: number[] = [];
        const num = this.cellNum;
        let someI = -1;
        for (let i = 0; i < num; i++) {
            const cur = this.collects[i];
            if (cur) {
                if (cur.data.type == type) {//一样的物品会插队
                    clear.push(i);
                    someI = i + 1;//记录相同的物品下一个位置
                }
                // if (cur.data.type > type) {//排序在前的收集品会插到中间
                //     index = i;
                //     break;
                // }
            } else {
                index = i;
                break;
            }
        }
        if (someI >= 0) {
            index = someI;
        }
        this.collects.splice(index, 0, collet);
        this.moveAfterCollet(index + 1);

        //切换坐标
        collet.changeParent(this.node);
        await collet.moveToCells(this.getPos(index));
        if (clear.length >= 2) {//消除三连收集品
            AudioManager.playEffect("clear");
            const start = clear[0];
            for (let i = start; i <= index; i++) {//清除三个相连的收集品
                const co = this.collects[i];
                if (co) {
                    GameManger.instance.recordClearCollet(co.data.type);
                    if (i != start + 1) {
                        const pos = this.getPos(start + 1);
                        co.moveTo(pos)
                    } else {
                        if (type != ColletType.money) {//非钱
                            delay(0.2, this.node).then(() => {
                                 AudioManager.playEffect("getCoin");
                                CoinManger.instance.addCoin(GameUtil.CollectionClearCoins, false, false);
                                ViewManager.showRewardAni3(RewardType.coin, GameUtil.CollectionClearCoins, co.node, v2(0, 100), () => { });
                            })
                        }
                    }
                    co.clearAni();

                }
            }
            GameManger.instance.showProgress();
            this.collects.splice(start, (index - start + 1));
            await delay(0.6, this.node);
            await this.moveAfterCollet(start);
            GameManger.instance.checkWin(type);
        } else {
            if (this.collects.length >= num) {
                GameManger.instance.gameOver();//失败
            }
        }
        GameManger.instance.isAni = false;
        GameManger.instance.saveBoard();
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
    public getPos(x: number): Vec3 {
        const w = GameUtil.DownW;
        return v3((x - 3.5) * w, -40);
    }
    /**回退操作 */
    public getBackCollect() {
        if (this.collects.length == 0) return null;
        let index = 0;
        let max = 0;
        this.collects.forEach((v, i) => {
            if (v.step > max) {
                index = i;
                max = v.step;
            }
        })
        const co = this.collects.splice(index, 1)[0];
        this.moveAfterCollet(index);
        return co;
    }
    private get cellNum() {
        return GameStorage.isCellLock(GameStorage.getCurLevel()) ? 8 : 7;
    }
    public canCleanUp() {
        return this.collects.length > 0;
    }
    /**清理三个物品到空区域 */
    public async cleanUp() {
        AudioManager.vibrate(100,100);
        GameManger.instance.isAni = true;
        let times = Math.min(3, this.collects.length);
        const cos: Colletion[] = [];
        for (let i = 0; i < times; i++) {
            cos.push(this.collects.shift());
        }
        this.moveAfterCollet(0);
        this.cleanArea.cleanTo(cos);
        await delay(0.2);
        GameManger.instance.isAni = false;
        GameManger.instance.saveBoard();
    }

    public getCellDatas() {
        const cells: CellData[] = [];
        this.collects.forEach(v => { cells.push(v.data) });
        const cleanCells = this.cleanArea.getCellDatas();
        return { cells, cleanCells };
    }
    /**恢复 */
    public recoverCells(colletionPrefab: Prefab, cells: CellData[], cleanCells: CellData[]) {
        cells.forEach((v, i) => {
            const pos = this.getPos(i);
            const c = instantiate(colletionPrefab);
            this.node.addChild(c);
            c.position = pos;
            const colletion = c.getComponent(Colletion);
            colletion.init(v, true);
            // colletion.setParent(this.node);
            this.collects[i] = colletion;
        })
        this.cleanArea.recoverCells(colletionPrefab, cleanCells);
    }
}


