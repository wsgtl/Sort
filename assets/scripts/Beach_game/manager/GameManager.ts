import { Vec2 } from "cc";
import Debugger from "../../Beach_common/Debugger";
import { MathUtil } from "../../Beach_common/utils/MathUtil";
import { v2 } from "cc";
import { CabinetAllData, CellData, ColletType, GameUtil } from "../GameUtil";
import { GameStorage } from "../GameStorage";
import { GameView } from "../view/view/GameView";
import { Colletion } from "../view/component/Colletion";
import { BaseStorageNS, ITEM_STORAGE } from "../../Beach_common/localStorage/BaseStorage";

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
            for (let i = cas.length; i < GameUtil.AllRow; i++) {//后面额外增加普通行
                const rc = this.getRandomCabinets();
                if (!rc) break;
                const b = this.getRandomCell(rc);
                this.borad.push(b);
            }
        } else {
            for (let i = 0; i < GameUtil.AllRow; i++) {
                const rc = this.getRandomCabinets();
                if (!rc) break;
                const b = this.getRandomCell(rc);
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
        // const num = this.colletionArr.length;
        // if (num <= 6) {
        //     return this.getRandomCell(GameUtil.getRadnomCabinets(num));
        // } else if (num <= 10) {
        //     const x = Math.max(3, num - 4);
        //     return this.getRandomCell(GameUtil.getRadnomCabinets(x));
        // }
        return this.getRandomCell(this.getRandomCabinets());
    }
    /**获取随机柜子 */
    public getRandomCabinets() {
        const num = this.colletionArr.length;
        if (num <= 0) return null;
        if (num <= 6) {
            return GameUtil.getRandomCabinets(num);
        } else if (num <= 10) {
            const x = Math.max(3, num - 4);
            return GameUtil.getRandomCabinets(x);
        }
        return GameUtil.getRandomCabinets();
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


        if (this.curLevel < 5) {
            this.normalLevel(num);
            // carr.push(...Array(moneyNums).fill(ColletType.money));
            // const n = num - carr.length;
            // // const kd = this.curLevel == 4 && this.lastLevel == 3;//在第四关卡下点
            // for (let i = 0; i < n; i++) {
            //     carr.push(this.getRandomNormalCollection(12));
            // }
            // carr.forEach(v => {
            //     this.colletionArr.push(v);
            //     this.colletionArr.push(v);
            //     this.colletionArr.push(v);
            // })
            // this.colletionArr.shuffle(3);
        } else {
            const after = 100;//后100个难
            const pre = num - after;//前面的简单
            this.normalLevel(pre);
            //后面100个控制难度
            const _ca: ColletType[] = [];
            carr.push(...Array(GameUtil.getMoneyNodeNums(after)).fill(ColletType.money));
            const n = after - carr.length - 4;
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
                _ca.push(v);
                _ca.push(v);
                _ca.push(v);
            })
            _ca.shuffle(3);
            const fz = after;
            for (let i = 16; i <= 20; i++) {//最后5个特殊收集品，只有一组，散落在各地。其中有三种收集品只有两个，使得完全无法通关
                const r1 = MathUtil.random(0, fz * 1);
                const r2 = MathUtil.random(0, fz * 1);

                _ca.splice(r1, 0, i);
                _ca.splice(r2, 0, i);
                if (i < 18) {
                    const r3 = MathUtil.random(fz * 2, fz * 2.7);
                    _ca.splice(r3, 0, i);
                }
            }
            this.colletionArr.push(..._ca);
            console.log("第五关", this.colletionArr);
        }
    }
    /**普通关生成 */
    public normalLevel(num: number) {
        const carr = [];
        const moneyNums = GameUtil.getMoneyNodeNums(num);
        carr.push(...Array(moneyNums).fill(ColletType.money));
        const n = num - carr.length;
        // const kd = this.curLevel == 4 && this.lastLevel == 3;//在第四关卡下点
        for (let i = 0; i < n; i++) {
            carr.push(this.getRandomNormalCollection(14));
        }
        carr.forEach(v => {
            this.colletionArr.push(v);
            this.colletionArr.push(v);
            this.colletionArr.push(v);
        })
        this.colletionArr.shuffle(3);
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
    /**返回物品数量和消除数 */
    public getCollectNum() {
        return { clear: this.clearColletionArr.length, all: this.groupNum * 3 }
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
        this.gv.failProcess();
    }
    public revive() {
        this.isAni = false;
        this.isGameOver = false;

    }

    /**恢复数据 */
    public recoverGameData() {
        const d = BaseStorageNS.getItem(ITEM_STORAGE.GameData);
        if (d) {
            const data = JSON.parse(d);
            if (data.curLevel != GameStorage.getCurLevel()) return null;//关卡不一样也不保存
            this.colletionArr = data.colletionArr;
            this.clearColletionArr = data.clearColletionArr;
            this.groupNum = data.groupNum;
            this.step = data.step;
            return {
                board: data.board,
                cells: data.cells,
                cleanCells: data.cleanCells
            }
        }
        return null;
    }
    /**保存盘面 */
    public saveBoard() {
        const dd = this.gv.getBoardData();
        const _data = {
            curLevel: this.curLevel,
            colletionArr: this.colletionArr,
            clearColletionArr: this.clearColletionArr,
            groupNum: this.groupNum,
            step: this.step,
            board: dd.board,
            cells: dd.cells,
            cleanCells: dd.cleanCells
        }
        BaseStorageNS.setItem(ITEM_STORAGE.GameData, JSON.stringify(_data));
    }
    /**重玩初始化盘面 */
    public replayBoard() {
        BaseStorageNS.setItem(ITEM_STORAGE.GameData, "");
    }

}
