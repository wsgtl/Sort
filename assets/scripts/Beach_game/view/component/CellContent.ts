import { _decorator, Component, Node } from 'cc';
import { Colletion } from './Colletion';
import { Vec3 } from 'cc';
import { v3 } from 'cc';
import { GameManger } from '../../manager/GameManager';
import { delay } from '../../../Beach_common/utils/TimeUtil';
import { Cabinet } from './Cabinet';
import { CabinetData, GameUtil } from '../../GameUtil';
import { AudioManager } from '../../manager/AudioManager';
import { GameStorage } from '../../GameStorage';
import { ViewManager } from '../../manager/ViewManger';
import { GuideManger } from '../../manager/GuideManager';
import { CleanArea } from './CleanArea';
const { ccclass, property } = _decorator;

@ccclass('CellContent')
export class CellContent extends Component {
    @property(Node)
    btnCell:Node = null;
    @property(CleanArea)
    cleanArea:CleanArea = null;
    public collects: Colletion[] = [];

    onLoad(){
        this.showBtnCell();
        this.btnCell.on(Node.EventType.TOUCH_START,()=>{
            if(GuideManger.isGuide())return;
             ViewManager.showAddCell(()=>{this.showBtnCell();})},this);
    }
    private showBtnCell(){
        this.btnCell.active = !GameStorage.isCellLock(GameStorage.getCurLevel());
    }

    public async toCells(collet: Colletion) {
        GameManger.instance.isAni = true;
        let index = 0;
        const type = collet.data.type;
        const clear: number[] = [];
        const num = this.cellNum;
        for (let i = 0; i < num; i++) {
            const cur = this.collects[i];
            if (cur) {
                if (cur.data.type == collet.data.type) {
                    clear.push(i);
                }
                if (cur.data.type > collet.data.type) {//排序在前的收集品会插到中间
                    index = i;
                    break;
                }
            } else {
                index = i;
                break;
            }
        }
        this.collects.splice(index, 0, collet);
        this.moveAfterCollet(index + 1);

        //切换坐标
        collet.changeParent(this.node);
        await collet.moveToCells(this.getPos(index));
        if (clear.length >= 2) {//消除三连收集品
            AudioManager.playEffect("clear");
            const start = clear[0];
            for (let i = clear[0]; i <= index; i++) {//清除三个相连的收集品
                const co = this.collects[i];
                if (co) {
                    GameManger.instance.recordClearCollet(co.data.type);
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
        return v3((x - 3.5) * w, -30);
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
    private get cellNum(){
        return  GameStorage.isCellLock(GameStorage.getCurLevel())?8:7;
    }
    public canCleanUp(){
        return this.collects.length>0;
    }
    /**清理三个物品到空区域 */
    public cleanUp(){
        let times = Math.min(3,this.collects.length);
        const cos:Colletion[]=[];
        for(let i=0;i<times;i++){
            cos.push(this.collects.shift());
        }
        this.moveAfterCollet(0);
        this.cleanArea.cleanTo(cos);
    }
}


