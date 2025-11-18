import { Vec2 } from "cc";
import Debugger from "../../Beach_common/Debugger";
import { MathUtil } from "../../Beach_common/utils/MathUtil";
import { v2 } from "cc";
import { CellData, ColletType, GameUtil } from "../GameUtil";
import { GameStorage } from "../GameStorage";
import { GameView } from "../view/view/GameView";
import { Colletion } from "../view/component/Colletion";

const debug = Debugger("GameManger");
export class GameManger {
    public static _instance: GameManger = null;
    public static get instance(): GameManger {
        if (!this._instance) {
            this._instance = new GameManger();
        }
        return this._instance;
    }
    public static clearInstance() {
        this._instance = null;
    }
    private gv: GameView;
    public init(gv: GameView) {
        this.gv = gv;
        this.curLevel = GameStorage.getCurLevel();
        this.lastLevel = GameStorage.getLastLevel();
        GameStorage.setLastLevel(this.curLevel);
        this.initColletionArr();
        console.log(`第${this.curLevel}关,上一关是:${this.lastLevel}`);
        
    }
    private colletionArr: ColletType[] = [];
    /**消除的收集物 */
    private clearColletionArr: ColletType[] = [];
    private curLevel: number = 1;
    private lastLevel: number = 1;
    public groupNum: number = 0;
    private borad: CellData[][] = [];
    /**点击了几个 */
    private step: number = 1;

    isAni: boolean = false;
    isGameOver: boolean = false;
    /**初始化柜子数组 */
    public getInitBoard() {
        this.borad = [];
        if (this.curLevel == 1) {//第一关新手引导
            const cas = GameUtil.getLevel1Cabinet();
            cas.forEach(v => {
                const b = this.getRandomCell(v);
                this.borad.push(b);
            })
        } else {
            for (let i = 0; i < 9; i++) {
                const b = this.getRandomCell(GameUtil.getRadnomCabinets());
                this.borad.push(b);
            }
        }

        return this.borad;
    }
    /**每一行格子数据 */
    private getRandomCell(random: number[]): CellData[] {
        const cells: CellData[] = [];
        for (let i = 0; i < 6;) {
            const num = random[i];
            if (num > 0) {
                const to = i + num;
                for (let j = i; j < to; j++) {
                    cells[j] = { type: this.colletionArr.shift(), cellNum: num, index: j - i }
                }
                i = to;
            } else {
                i++;
            }
        }
        return cells;
    }
    /**剩余的收集品数量 */
    public getResidueCollet() {
        return this.colletionArr.length;
    }
    /**新生成一行数据 */
    public getNewRow() {
        const num = this.colletionArr.length;
        if (num <= 6) {
            return this.getRandomCell(GameUtil.getRadnomCabinets(num));
        } else if (num <= 10) {
            const x = Math.max(3, num - 4);
            return this.getRandomCell(GameUtil.getRadnomCabinets(x));
        }
        return this.getRandomCell(GameUtil.getRadnomCabinets());
    }
    /**初始化收集物数组 */
    private initColletionArr() {
        if (this.curLevel == 1) {//第一关新手引导
            const res = GameUtil.getLevel1Collect();
            this.colletionArr = res.arr;
            this.groupNum = res.num;
            return;
        }
        const carr = [];
        const num = GameUtil.LevelCollectionNum[this.curLevel - 1];
        // const num = 16;
        this.groupNum = num;

        const moneyNums=[2,3,4,5];
        const coinNums=[1,2,2,2];
        if (this.curLevel < 5) {
            carr.push(...Array(moneyNums[this.curLevel-1]).fill(ColletType.money));
            const n = num - carr.length;
            const kd = this.curLevel == 4 && this.lastLevel == 3;//在第四关卡下点
            for (let i = 0; i < n; i++) {
                carr.push(this.getRandomNormalCollection(kd ? 18 : 12));
            }
            carr.forEach(v => {
                this.colletionArr.push(v);
                this.colletionArr.push(v);
                this.colletionArr.push(v);
            })
            this.colletionArr.shuffle(3);
        } else {
            carr.push(...Array(MathUtil.random(15, 20)).fill(ColletType.money));
            const n = num - carr.length - 4;
            const p = Math.floor(n / 12);
            const yu = n % 12;
            for (let i = 0; i < p; i++) {
                for (let j = 4; j <= 15; j++) {//平均分配普通收集物
                    carr.push(j);
                }
            }

            for (let i = 0; i < yu; i++) {
                carr.push(MathUtil.random(4, 15));
            }
            carr.forEach(v => {
                this.colletionArr.push(v);
                this.colletionArr.push(v);
                this.colletionArr.push(v);
            })
            this.colletionArr.shuffle(3);
            const fz = num;
            for (let i = 16; i <= 20; i++) {//最后5个特殊收集品，只有一组，散落在各地。其中有三种收集品只有两个，使得完全无法通关
                const r1 = MathUtil.random(0, fz * 1);
                const r2 = MathUtil.random(0, fz * 1);

                this.colletionArr.splice(r1, 0, i);
                this.colletionArr.splice(r2, 0, i);
                if (i < 18) {
                    const r3 = MathUtil.random(fz * 2, fz * 2.7);
                    this.colletionArr.splice(r3, 0, i);
                }
            }
            console.log("第五关", this.colletionArr);
        }


    }
    /**随机普通收集物 */
    public getRandomNormalCollection(max: number = 12) {
        return MathUtil.random(4, max);
    }
    /**收集品移动到下面展示 */
    public moveToCell(collection: Colletion) {
        collection.step = this.step++;
        this.gv.cellContent.toCells(collection);
    }
    /**清理空柜子 */
    public clearCabinet() {
        this.gv.clearCabinet();
    }
    /**记录消除的收集物 */
    public recordClearCollet(type: ColletType) {
        this.clearColletionArr.push(type);
    }
    /**返回收集物 */
    public backCollet(type: ColletType) {
        this.colletionArr.unshift(type);
    }
    /**返回消除进度 */
    public getProgress() {
        return 1 - (this.clearColletionArr.length / (this.groupNum * 3));
    }
    /**显示进度 */
    public showProgress() {
        this.gv.showProgress();
    }
    /**检查是否胜利 */
    public checkWin(type: ColletType) {
        this.gv.checkWin(type);

    }
    public gameOver() {
        if (this.isGameOver) return;
        this.isGameOver = true;
        console.log("游戏失败");
        this.gv.gameOver();
    }
    public revive() {
        this.isAni = false;
        this.isGameOver = false;

    }
}
