import { _decorator, Node, SpriteFrame, Sprite } from 'cc';
import ViewComponent from '../../../Beach_common/ui/ViewComponent';
import { NumFont } from '../../../Beach_common/ui/NumFont';
import { Button } from 'cc';

import { AdHelper, adHelper } from '../../../Beach_common/native/AdHelper';
import Debugger from '../../../Beach_common/Debugger';
import { GameStorage } from '../../GameStorage';
import { Prefab } from 'cc';
import { instantiate } from 'cc';
import { ViewManager } from '../../manager/ViewManger';
import { AudioManager } from '../../manager/AudioManager';
import { tween } from 'cc';
import { Tween } from 'cc';
import { view } from 'cc';
import { EventTouch } from 'cc';
import { UIUtils } from '../../../Beach_common/utils/UIUtils';
import { CabinetAllData, CabinetData, CellData, ColletType, GameUtil, PropType, RewardType } from '../../GameUtil';
import { delay, nextFrame, tweenPromise } from '../../../Beach_common/utils/TimeUtil';
import { GameManger } from '../../manager/GameManager';
import { Progress2 } from '../component/Progress2';
import { Colletion } from '../component/Colletion';
import { Cabinet } from '../component/Cabinet';
import { CellContent } from '../component/CellContent';
import { ActionEffect } from '../../../Beach_common/effects/ActionEffect';
import { v3 } from 'cc';
import { MathUtil } from '../../../Beach_common/utils/MathUtil';
import { Label } from 'cc';
import { GuideManger } from '../../manager/GuideManager';
import { GuideMask } from '../guide/GuideMask';
import { i18n } from '../../../Beach_common/i18n/I18nManager';
import { Widget } from 'cc';
import { ConfigConst } from '../../manager/ConfigConstManager';
import { MoneyManger } from '../../manager/MoneyManger';
import { ReddotManager } from '../../manager/ReddotManager';
import { EventTracking } from '../../../Beach_common/native/EventTracking';
const { ccclass, property } = _decorator;

const debug = Debugger("GameView")
@ccclass('GameView')
export class GameView extends ViewComponent {
    @property(Node)
    content: Node = null;
    @property(Node)
    cabinetContent: Node = null;
    @property(Node)
    colletContent: Node = null;
    @property(CellContent)
    cellContent: CellContent = null;
    @property(Node)
    top: Node = null;
    @property(Node)
    topContent: Node = null;
    @property(Node)
    bottomContent: Node = null;
    @property(Node)
    dialogNode: Node = null;
    @property(Node)
    skills: Node = null;
    @property(Node)
    shuffleIcon: Node = null;
    @property(Node)
    btnBack: Node = null;
    @property(Node)
    btnShuffle: Node = null;
    @property(Node)
    btnBesom: Node = null;
    @property(Node)
    btnTask: Node = null;
    @property(Label)
    level: Label = null;
    @property(Progress2)
    progress: Progress2 = null;
    @property(Prefab)
    cabinetPrefab: Prefab = null;
    @property(Prefab)
    colletionPrefab: Prefab = null;


    /**显示的行数，短屏为6，长屏为7 */
    private showRowNum: number = 6;
    private board: Cabinet[][] = [];
    onLoad() {

        adHelper.showBanner();

        /**调试模式 */
        // PhysicsSystem2D.instance.debugDrawFlags = 1;

        this.fit();

        ViewManager.setUpDialogNode(this.dialogNode);

        this.btnBack.on(Button.EventType.CLICK, this.onBtnBack, this);
        this.btnShuffle.on(Button.EventType.CLICK, this.onBtnShuffle, this);
        this.btnBesom.on(Button.EventType.CLICK, this.onBtnBesom, this);
        this.btnTask.on(Button.EventType.CLICK, this.onTask, this);

        ReddotManager.instance.init(this.btnTask.getChildByName("dot"));
        this.addGameTime();
    }

    fit() {
        const h = view.getVisibleSize().y;
        const cha = h - 1920;
        const cellH = GameUtil.CellH + 100;

        if (cha > 150) {
            this.topContent.getComponent(Widget).top = -30;
            this.bottomContent.y = -860 - cha * .45;
            this.content.y = -490 - cha * 0.4;
            this.progress.node.scale = v3(1, 1, 1);
        } else {
            this.topContent.getComponent(Widget).top = -80;
            this.bottomContent.y = -860 - cha * .2;
            this.content.y = -490 - cha * 0.2;
            this.progress.node.scale = v3(1, 0.9, 1);

        }
        console.log("h", h);

        nextFrame().then(() => {
            const p = UIUtils.transformOtherNodePos2localNode(this.node, this.dialogNode);
            this.dialogNode.position = p;
        })
    }

    show(parent: Node, args?: any) {
        parent.addChild(this.node);
        this.init();
    }

    async init() {
        this.playBgm();
        GameManger.clearInstance();
        GameManger.instance.init(this);
        this.updateAllBtnStatus();
        this.showLevel();


        this.showProgress(1);
        this.startGame();
        if (!GuideManger.isGuide()) {
            ViewManager.showLevelDialog(false, GameStorage.getCurLevel(), () => { })
            await this.delay(1.5);
        }

    }
    private startGame() {

        if (!GuideManger.isGuide()) {
            const data = GameManger.instance.recoverGameData();//恢复数据
            if (data) {
                this.recoverBoard(data.board, data.cells, data.cleanCells);
            } else {
                this.initBoard();
            }
        } else {
            this.initBoard();
            this.initGuide();
        }
    }
    /**恢复盘面 */
    private recoverBoard(board: CabinetAllData[][], cells: CellData[], cleanCells: CellData[]) {
        let si = 0;
        board.forEach((b, i) => {
            this.board[i] = [];
            b.forEach((v, j) => {
                if (v) {
                    const pos = GameUtil.getCabinetPos(j, i);
                    const c = instantiate(this.cabinetPrefab);
                    this.cabinetContent.addChild(c);
                    let sb = c.getSiblingIndex();
                    c.setSiblingIndex(si++);
                    // this.cabinetContent.insertChild(c,si++);
                    c.position = pos;
                    const cabinet = c.getComponent(Cabinet);
                    cabinet.init(v.cabinet.len, j, i, v.cabinet.index);//创建柜子
                    this.board[i][j] = cabinet;
                    v.cells.forEach(ce => {
                        cabinet.createCollection(ce);//创建收集物
                    })

                }
            })
        })
        this.cellContent.recoverCells(this.colletionPrefab, cells, cleanCells);
        this.showProgress();
    }
    /**初始化盘面 */
    private initBoard() {
        const arr = GameManger.instance.getInitBoard();
        arr.forEach((v, i) => {
            this.board[i] = [];
            for (let j = 0; j < 6;) {
                const c = v[j];
                if (c && c.index == 0) {
                    this.createCabinet(c.cellNum, j, i, v);
                    j += c.cellNum;
                } else {
                    j++;
                }
            }
        })

        GameManger.instance.saveBoard();
    }

    // private cabinetIndex: number = 1;
    private createCabinet(len: number, x: number, y: number, cds: CellData[], cabinetIndex: number = -1) {
        // if (cabinetIndex == -1) cabinetIndex = this.cabinetIndex++
        if (cabinetIndex == -1) cabinetIndex = MathUtil.random(1000000000, 9999999999);
        const pos = GameUtil.getCabinetPos(x, y);
        const c = instantiate(this.cabinetPrefab);
        this.cabinetContent.addChild(c);
        c.position = pos;
        const cabinet = c.getComponent(Cabinet);
        cabinet.init(len, x, y, cabinetIndex);
        this.board[y][x] = cabinet;
        for (let i = x; i < x + len; i++) {
            if (cds[i])
                cabinet.createCollection(cds[i]);
        }
        return cabinet;
    }

    /**清理空柜子 */
    public clearCabinet() {
        let cy: number[] = [0, 0, 0, 0, 0, 0];
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < 6;) {
                const ca = this.board[i][j];
                if (ca && !ca.isClear) {
                    //先计算可不可以下坠
                    const end = j + ca.data.len;
                    let maxY = 0;
                    for (let x = j; x < end; x++) {
                        if (cy[x] > maxY) maxY = cy[x];
                    }
                    if (maxY < i) {//可坠落
                        ca.dropTo(maxY);
                        this.board[i][j] = null;
                        this.board[maxY][j] = ca;
                        for (let x = j; x < end; x++) {
                            cy[x] = maxY + 1;
                        }
                    } else {//不可坠落
                        for (let x = j; x < end; x++) {
                            cy[x] = i + 1;
                        }
                    }
                    j += ca.data.len;
                } else {
                    if (ca?.isClear) {
                        this.board[i][j] = null;//去除要消掉的柜子
                    }
                    j++;
                }
            }
        }
        this.nextRow();
    }
    /**生成新的柜子 */
    public nextRow() {
        const sy = GameManger.instance.getResidueCollet();
        if (sy <= 0) return;
        let num = 0;
        const len = Math.min(GameUtil.AllRow, this.board.length);
        const last = this.board[len - 1];
        last.forEach(v => {
            if (v) num++;
        })
        if (num == 0) {//最上面一行空了，新生成一行
            const arr = GameManger.instance.getNewRow();

            for (let j = 0; j < 6;) {
                const c = arr[j];
                if (c && c.index == 0) {
                    this.createCabinet(c.cellNum, j, len - 1, arr);
                    j += c.cellNum;
                } else {
                    j++;
                }
            }
        }
    }
    /**显示当前关卡 */
    private showLevel() {
        this.level.string = GameStorage.getCurLevel() + "";
    }

    /**结束流程，先弹复活弹窗，没复活则弹失败 */
    public failProcess() {
        const rn = GameStorage.getPropCurLevel(PropType.resurrection);
        if (rn.all >= ConfigConst.Other.PropLimit) {
            this.gameOver(false);
            return;
        }
        ViewManager.showResurrect(() => {
            this.resurrect();
        }, () => {
            this.gameOver(false);
        })
    }

    async gameOver(isWin: boolean) {
        Tween.stopAllByTarget(this.node);
        // Tween.stopAllByTarget(this.jd.getComponent(UITransform));
        AudioManager.stopBgm();
        await nextFrame();
        await delay(0.4);
        ViewManager.showGameOver(this.node, isWin, () => {
            this.replay();
        }, () => {
            this.continueGame();
        })
    }

    replay() {
        GameStorage.replayPropCurLevel();
        GameManger.instance.replayBoard();
        ViewManager.showGameView();
    }
    private rewardTimes: number = 0;
    async checkWin(type: ColletType) {
        if (type == ColletType.money) {
            this.rewardTimes++;
            const isAd = this.rewardTimes % ConfigConst.Other.RewardDoubleShowNum == 0;
            // const isAd = true;
            let bl = GameStorage.getMoney() < 10 ? 2 : 1;
            ViewManager.showReward(MoneyManger.instance.getReward(bl), isAd, () => {
                this.rewardCb?.();
            });
        }
        if (GameManger.instance.getProgress() == 0) {
            GameManger.instance.isGameOver = true;
            this.gameOver(true);
        }
    }
    continueGame() {
        GameStorage.replayPropCurLevel();
        GameManger.instance.replayBoard();
        EventTracking.sendEventLevel(GameStorage.getCurLevel());
        GameStorage.nextLevel();
        ViewManager.showGameView(true);
    }

    /**复活 */
    private async resurrect() {
        this.playBgm();
        AudioManager.playEffect("revive");
        GameManger.instance.revive();
        // this.backSkill();
        this.cleanUp();
    }

    private delay(time: number, node?: Node) {
        return new Promise<void>(resolve => {
            const n = node ? node : this.node;
            tween(n)
                .delay(time)
                .call(() => {
                    resolve();
                })
                .start();
        });
    }
    onDestroy() {
        // Tween.stopAllByTarget(this.node);
        Tween.stopAllByTarget(this.node);
        this.unscheduleAllCallbacks();
        AudioManager.stopBgm();
    }


    playBgm() {
        AudioManager.playBgm("bgm", 0.3);
    }
    showProgress(p: number = -1) {
        if (p >= 0) {
            this.progress.progress = p;
        } else {
            const _p = GameManger.instance.getProgress();
            tweenPromise(this.progress, t => t.to(0.15, { progress: _p }));
        }
    }

    /**回退一步 */
    onBtnBack() {
        if (GameManger.instance.isAni || GameManger.instance.isGameOver) return;
        const type = PropType.back;
        const num = GameStorage.getPropNum(type);
        if (num <= 0) {
            ViewManager.showProp(type, () => { this.updateAllBtnStatus(); });
            return;
        }
        if (this.backSkill()) {
            GameStorage.addPropNum(type, -1);
            this.showPropBtnStatus(this.btnBack, type);
        }


    }
    private backSkill() {
        const co = this.cellContent.getBackCollect();
        if (!co) {//没有收集物在展示台
            // ViewManager.showTips("There are currently no objects that can be withdrawn");
            ViewManager.showTips(i18n.string("str_tacurrently"));
            return false;
        }
        AudioManager.vibrate(50, 100);
        const ca = this.getCabinet(co.data.cabinet);
        ca.backCollet(co);
        co.moveBack(ca);
        GameManger.instance.isAni = true;
        this.delay(0.3).then(() => {
            GameManger.instance.isAni = false;
            GameManger.instance.saveBoard();
        })
        AudioManager.playEffect("back");
        return true;
    }
    private getCabinet(data: CabinetData): Cabinet {
        let ca: Cabinet;
        this.board.forEach(v => {
            for (let c of v) {
                if (c && c.data.index == data.index) {
                    ca = c;
                    break;
                }
            }
        })
        if (!ca) {//这个柜子已经不在了，重新造一个
            const sy = data.y;
            let cy: number[] = [0, 0, 0, 0, 0, 0];
            this.board.splice(sy, 0, []);
            let a = this.board;
            ca = this.createCabinet(data.len, data.x, data.y, [], data.index);
            //计算该柜子的在父节点的顺序
            let sx = data.x - 1;
            let si = 0;
            for (let y = data.y; y >= 0; y--) {
                const bo = this.board[y];
                for (let x = sx; x >= 0; x--) {
                    if (bo[x]) {
                        si++;
                    }
                }
                sx = 5;
            }
            ca.node.setSiblingIndex(si);//设置顺序
            for (let i = 0; i < this.board.length; i++) {
                for (let j = 0; j < 6;) {
                    const ca = this.board[i][j];
                    if (ca && !ca.isClear) {
                        // ca.setY(i);
                        //先计算可不可以下坠
                        const end = j + ca.data.len;
                        let maxY = 0;
                        for (let x = j; x < end; x++) {
                            if (cy[x] > maxY) maxY = cy[x];
                        }
                        if (maxY < i) {//可坠落
                            ca.dropTo(maxY, 0);
                            this.board[i][j] = null;
                            this.board[maxY][j] = ca;
                            for (let x = j; x < end; x++) {
                                cy[x] = maxY + 1;
                            }
                        } else {//不可坠落
                            ca.dropTo(i, 0);
                            for (let x = j; x < end; x++) {
                                cy[x] = i + 1;
                            }
                        }
                        j += ca.data.len;
                    } else {
                        j++;
                    }
                }
            }
            /**去除多余的空行 */
            for (let i = this.board.length - 1; i >= GameUtil.AllRow; i--) {
                let num = 0;
                this.board[i].forEach(v => { if (v) num++ });
                if (num == 0) {
                    this.board.pop();
                }
            }
        }
        return ca;
    }
    /**打乱已显示的收集物 */
    onBtnShuffle() {
        if (GameManger.instance.isAni || GameManger.instance.isGameOver) { return; }
        const tyep = PropType.shuffle;
        const num = GameStorage.getPropNum(tyep);
        if (num <= 0) {
            ViewManager.showProp(tyep, () => { this.updateAllBtnStatus(); });
            return;
        }
        this.shuffleCollets();
        GameStorage.addPropNum(tyep, -1);
        this.showPropBtnStatus(this.btnShuffle, tyep);
    }
    private async shuffleCollets() {
        AudioManager.vibrate(300, 50);
        AudioManager.playEffect("wind1");
        GameManger.instance.isAni = true;
        const collets: Colletion[] = [];
        const rowNum: number = GameUtil.AllRow;//交换的行数多出两行，做出有新东西的效果
        /**只打乱显示行数内的收集物 */
        for (let i = 0; i < rowNum; i++) {
            const v = this.board[i];
            if (!v) continue;
            //先获取所有可显示的收集物
            v.forEach(ca => {
                if (ca)
                    collets.push(...ca.getShowCollet());
            })
        }

        if (collets.length <= 0) {
            return;
        }
        const time1 = 0.4;
        //移动到中间
        collets.forEach(c => {
            c.changeParent(this.colletContent);
            c.moveTo(v3(0, 350), time1);
        })
        this.shuffleIcon.active = true;
        this.shuffleIcon.angle = 0;
        UIUtils.setAlpha(this.shuffleIcon, 1);
        tween(this.shuffleIcon)
            .to(0.6, { angle: 360 })
            // .call(()=>{})
            .start();
        await this.delay(time1);
        ActionEffect.fadeOut(this.shuffleIcon, 0.5);
        const len = collets.length;
        await this.delay(0.1);
        const ts = this.cellContent.getAllCollectType();//获取底部的类型
        let _type: ColletType = ts[0] ?? MathUtil.random(1, 12);//底部没有就随机
        //随机打乱类型
        for (let i = 0; i < len; i++) {
            const c1 = collets[i];
            const c2 = collets[MathUtil.random(0, len - 1)];
            const t1 = c1.data.type;
            const t2 = c2.data.type;
            c1.setType(t2);
            c2.setType(t1);

            c1.shuffleMoveEnd();//返回
        }
        let tn = 0;
        for (let i = 0; i < len; i++) {
            const c1 = collets[i];
            const t1 = c1.data.type;
            if (t1 == _type) {//将某个类型的收集物都放到最下方去,降低难度
                const c2 = collets[tn];
                const t2 = c2.data.type;
                c1.setType(t2);
                c2.setType(t1);
                tn++;
                if (tn >= 6) break;//超过个就不再下放了
            }
        }
        await this.delay(0.4);
        GameManger.instance.isAni = false;
        GameManger.instance.saveBoard();
    }
    onBtnBesom() {
        if (GameManger.instance.isAni || GameManger.instance.isGameOver) { return; }
        const type = PropType.besom;
        const num = GameStorage.getPropNum(type);
        if (num <= 0) {
            ViewManager.showProp(type, () => { this.updateAllBtnStatus(); });
            return;
        }
        if (this.cleanUp()) {
            GameStorage.addPropNum(type, -1);
            this.showPropBtnStatus(this.btnBesom, type);
        }

    }
    /**扫把道具，清理3个到空白区域 */
    private cleanUp() {
        if (!this.cellContent.canCleanUp()) { ViewManager.showTips(i18n.string("str_prop_unusable")); return false; }//没有物品时无法使用该道具
        this.cellContent.cleanUp();
        return true;
    }
    /**更新所有道具按钮状态 */
    private updateAllBtnStatus() {
        this.showPropBtnStatus(this.btnShuffle, PropType.shuffle);
        this.showPropBtnStatus(this.btnBack, PropType.back);
        this.showPropBtnStatus(this.btnBesom, PropType.besom);
    }
    /**显示道具按钮状态 */
    private showPropBtnStatus(btn: Node, type: PropType) {
        const num = GameStorage.getPropNum(type);
        const b = btn.getChildByName("btn");
        const add = b.getChildByName("add");
        const numbg = b.getChildByName("numbg");
        const propNum = numbg.getChildByName("num");
        const all = GameStorage.getPropCurLevel(type).all;
        if (all >= ConfigConst.Other.PropLimit && num <= 0) {
            add.active = false;
            numbg.active = false;
            btn.getComponent(Button).interactable = false;
            UIUtils.setAllGray(btn, true, true);
            return;
        }
        btn.getComponent(Button).interactable = true;
        UIUtils.setAllGray(btn, false, true);
        if (num <= 0) {
            add.active = true;
            numbg.active = false;
        } else {
            add.active = false;
            numbg.active = true;
            propNum.getComponent(Label).string = num.toString();
        }
    }

    onTask() {
        ViewManager.showTask();
    }

    async addGameTime() {
        ReddotManager.instance.showTaskDot();
        const t = 5;
        await delay(t);
        GameStorage.addGameTime(t);
        this.addGameTime();
    }

    private gm: GuideMask;
    /**新手引导 */
    private initGuide() {
        ViewManager.showGuideMask((n: Node) => {
            this.gm = n.getComponent(GuideMask);
            this.gm.showMask();
            this.gm.showTips(1);
            const co = this.findMoney();
            if (co) {
                this.gm.showCollect(co, () => {
                    this.guidStpe2();
                });
            }
            // this.gm.showCellContent(this.cellContent.node.parent);
        })
    }
    private guidStpe2() {
        this.gm.showTips(1);
        const co = this.findMoney();
        EventTracking.sendOneEvent("click1");
        if (co) {
            this.gm.showCollect(co, () => {
                this.guidStpe3();
            });
        }
    }
    private guidStpe3() {
        this.gm.showTips(1);
        const co = this.findMoney();
        EventTracking.sendOneEvent("click2");
        if (co) {
            this.gm.showCollect(co, async () => {
                this.rewardCb = () => {
                    this.guidStpe5();
                    this.rewardCb = null;
                }
                this.gm.hideHand();
                await this.delay(1);
                this.guidStpe4();
            });
        }
    }
    private guidStpe4() {
        EventTracking.sendOneEvent("click3");
        this.gm.ccBack();
        this.gm.hideAll();

    }
    private guidStpe5() {
        this.gm.node.active = true;
        // this.gm.showTips(4);
        this.gm.showMoneyNode(this.top.getChildByName("money"));
    }

    private rewardCb: Function;
    private findMoney() {
        for (let v of this.board) {
            for (let c of v) {
                if (c) {
                    const m = c.findCollet(ColletType.money);
                    if (m) return m;
                }
            }
        }
    }




    private onForeground() {
        console.log('应用回到前台');
        // 恢复游戏逻辑
    }

    /**保存游戏数据，下次回来复原 */
    public getBoardData() {
        const bd: CabinetAllData[][] = [];
        this.board.forEach((b, i) => {
            bd[i] = [];
            b.forEach((v, j) => {
                if (v)
                    bd[i][j] = v.getCabinetAllData();
            })
        })
        const cd = this.cellContent.getCellDatas();
        // GameManger.instance.saveBoard(bd, cd.cells, cd.cleanCells);
        return {
            board: bd,
            cells: cd.cells,
            cleanCells: cd.cleanCells
        }
    }

}


