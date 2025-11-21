import { prefabs } from "../../Beach_common/recycle/AssetUtils";
import ViewComponent from "../../Beach_common/ui/ViewComponent";
import { isVaild } from '../../Beach_common/utils/ViewUtil';
import { Node } from 'cc';
import { PropType, RewardType } from "../GameUtil";
import { ActionEffect } from "../../Beach_common/effects/ActionEffect";
import { delay } from "../../Beach_common/utils/TimeUtil";
import { i18n } from "../../Beach_common/i18n/I18nManager";
import { Vec2 } from "cc";


export enum ViewType {
    loading = 0,
    home,
    gameview,
}
export namespace ViewManager {
    /**主要页面显示层级 */
    let mainSceneNode: Node = null;
    let upperNode: Node = null;
    let lowerNode: Node = null;
    let toperNode: Node = null;//最高层级

    let curViewType: ViewType;
    let curView: Node = null;
    export function getCurViewType() {
        return curViewType;
    }
    export function setMainSceneNode(n: Node, upper: Node, lower: Node, toper: Node) {
        mainSceneNode = n;
        upperNode = upper;
        lowerNode = lower;
        toperNode = toper;
    }
    let dialogNode: Node = null;
    let updialogNode: Node = null;
    /**设置弹窗父节点 */
    export function setDialogNode(n: Node) {
        dialogNode = n;
    }
    /**设置上层弹窗父节点 */
    export function setUpDialogNode(n: Node) {
        updialogNode = n;
    }

    /** 加载界面 */
    export function showLoading() {
        prefabs.instantiate("prefabs/loading").then((view) => {
            if (isVaild(view)) {
                const script = view.getComponent(ViewComponent);
                script.show(mainSceneNode);
                if (curView) {
                    curView.destroy();
                    curViewType = ViewType.loading;
                }
                curView = view;
            }
        });
    }
    /** 大厅主界面 */
    export function showHome() {
        prefabs.instantiate("prefabs/home").then((view) => {
            if (isVaild(view)) {
                const script = view.getComponent(ViewComponent);
                script.show(mainSceneNode);
                if (curView) {
                    curView.destroy();
                    curViewType = ViewType.home;
                }
                curView = view;
            }
        });
    }
    /** 新手引导大厅主界面 */
    export function showGuideHome() {
        prefabs.instantiate("prefabs/guide/guideHome").then((view) => {
            if (isVaild(view)) {
                const script = view.getComponent(ViewComponent);
                script.show(mainSceneNode);
                if (curView) {
                    curView.destroy();
                    curViewType = ViewType.home;
                }
                curView = view;
            }
        });
    }
    /** 游戏界面 */
    export function showGameView(isShowWin: boolean = false) {
        prefabs.instantiate("prefabs/gameView").then((view) => {
            if (isVaild(view)) {
                const args = { isShowWin }
                const script = view.getComponent(ViewComponent);
                script.show(mainSceneNode, args);
                if (curView) {
                    curView.destroy();
                    curViewType = ViewType.gameview;
                }
                curView = view;
            }
        });
    }

    /** 结束界面 */
    export function showGameOver(parent: Node, isWin: boolean, restartCb: CallableFunction, continueCb: CallableFunction) {
        prefabs.instantiate("prefabs/dialog/gameOver").then((dialog) => {
            if (isVaild(dialog)) {
                const script = dialog.getComponent(ViewComponent);
                script.show(parent, { isWin, restartCb, continueCb });
            }
        })
    }


    /** 询问弹窗 */
    export function showAskTips(parent: Node, confirmCb: CallableFunction, cancelCb?: CallableFunction) {
        prefabs.instantiate("prefabs/askTips").then((dialog) => {
            if (isVaild(dialog)) {
                const script = dialog.getComponent(ViewComponent);
                script.show(parent, { confirmCb, cancelCb });
            }
        });
    }

    let curTips: Node = null;
    /**提示条 */
    export async function showTips(tips: string, duration: number = 2.5) {
        if (!curTips) {
            curTips = await prefabs.instantiate("prefabs/tips");
        }
        if (isVaild(curTips)) {
            const script = curTips.getComponent(ViewComponent);
            script.show(upperNode, { tips, duration });
        }
    }


    /**清除弹窗 */
    export async function clearDialog(isAni: boolean = false, duration: number = 0.3) {
        if (dialogNode) {
            if (isAni) {
                dialogNode.children.forEach(async v => {
                    await ActionEffect.fadeOut(v, duration);
                    v.destroy();
                })
                if (dialogNode.children.length > 0)
                    await delay(duration);
            } else {
                dialogNode.destroyAllChildren();
            }

        }
    }

    /** 商城界面 */
    export function showShop() {
        prefabs.instantiate("prefabs/dialog/shop").then((dialog) => {
            if (isVaild(dialog)) {
                const script = dialog.getComponent(ViewComponent);
                script.show(dialogNode ?? mainSceneNode);
            }
        })
    }
    /** 任务界面 */
    export function showTask() {
        prefabs.instantiate("prefabs/dialog/task").then((dialog) => {
            if (isVaild(dialog)) {
                const script = dialog.getComponent(ViewComponent);
                script.show(dialogNode ?? mainSceneNode);
            }
        })
    }
    /** 签到界面 */
    export function showDaily(parent: Node) {
        prefabs.instantiate("prefabs/dialog/daily").then((dialog) => {
            if (isVaild(dialog)) {
                const script = dialog.getComponent(ViewComponent);
                script.show(parent);
            }
        })
    }

    /** 钱包提现界面 */
    export function showPurse() {
        prefabs.instantiate("prefabs/dialog/purse").then((dialog) => {
            if (isVaild(dialog)) {
                const script = dialog.getComponent(ViewComponent);
                script.show(upperNode ?? mainSceneNode);
            }
        })
    }
    /** 获取金币界面 */
    export function showGold() {
        prefabs.instantiate("prefabs/dialog/gold").then((dialog) => {
            if (isVaild(dialog)) {
                const script = dialog.getComponent(ViewComponent);
                script.show(upperNode ?? mainSceneNode);
            }
        })
    }
    /** 设置界面 */
    export function showSettings() {
        prefabs.instantiate("prefabs/dialog/settings").then((dialog) => {
            if (isVaild(dialog)) {
                const script = dialog.getComponent(ViewComponent);
                script.show(upperNode ?? mainSceneNode);
            }
        })
    }
    /** 语言设置界面 */
    export function showLangSettings(cb: Function) {
        prefabs.instantiate("prefabs/dialog/langSettings").then((dialog) => {
            if (isVaild(dialog)) {
                const script = dialog.getComponent(ViewComponent);
                script.show(upperNode ?? mainSceneNode, { cb });
            }
        })
    }
    /** 奖励界面 */
    export function showReward(rewardNum: number, isAd: boolean, cb: Function) {
        prefabs.instantiate("prefabs/dialog/reward").then((dialog) => {
            if (isVaild(dialog)) {
                const script = dialog.getComponent(ViewComponent);
                script.show(upperNode, { isAd, cb, rewardNum });
            }
        })
    }
    /** 金币奖励界面 */
    export function showRewardCoin(num: number, cb: Function) {
        prefabs.instantiate("prefabs/dialog/rewardCoin").then((dialog) => {
            if (isVaild(dialog)) {
                const script = dialog.getComponent(ViewComponent);
                script.show(upperNode, { num, cb });
            }
        })
    }
    /** 道具购买界面 */
    export function showProp(type: PropType, cb: Function) {
        prefabs.instantiate("prefabs/dialog/prop").then((dialog) => {
            if (isVaild(dialog)) {
                const script = dialog.getComponent(ViewComponent);
                script.show(upperNode, { type, cb, isResurrect: false });
            }
        })
    }
    /** 复活界面 */
    export function showResurrect(cb: Function, closeCb: Function) {
        prefabs.instantiate("prefabs/dialog/prop").then((dialog) => {
            if (isVaild(dialog)) {
                const script = dialog.getComponent(ViewComponent);
                script.show(upperNode, { type: PropType.resurrection, cb, isResurrect: true, closeCb });
            }
        })
    }
    /** 奖励动画界面 */
    export function showRewardAni1(type: RewardType, num: number, cb: Function,from: Node=null) {
        prefabs.instantiate("prefabs/dialog/rewardAni").then((dialog) => {
            if (isVaild(dialog)) {
                const script = dialog.getComponent(ViewComponent);
                script.show(upperNode, { type, num, cb, ani: 1 ,from});
            }
        })
    }
    /** 奖励动画2 */
    export function showRewardAni2(type: RewardType, from: Node, to: Node, cb: Function) {
        prefabs.instantiate("prefabs/dialog/rewardAni").then((dialog) => {
            if (isVaild(dialog)) {
                const script = dialog.getComponent(ViewComponent);
                script.show(upperNode, { type, from, to, cb, ani: 2 });
            }
        })
    }
    /** 奖励动画3 */
    export function showRewardAni3(type: RewardType, num: number, from: Node,py:Vec2, cb: Function) {
        prefabs.instantiate("prefabs/dialog/rewardAni").then((dialog) => {
            if (isVaild(dialog)) {
                const script = dialog.getComponent(ViewComponent);
                script.show(upperNode, { type, from, num, cb, ani: 3 ,py});
            }
        })
    }
    /** 增加格子界面 */
    export function showAddCell(cb: Function) {
        prefabs.instantiate("prefabs/dialog/addCell").then((dialog) => {
            if (isVaild(dialog)) {
                const script = dialog.getComponent(ViewComponent);
                script.show(upperNode ?? mainSceneNode, { cb });
            }
        })
    }
    /**广告没准备好 */
    export const adNotReady = () => {
        // ViewManager.showTips("The ad is not ready yet,please try again later");
        ViewManager.showTips(i18n.string("str_thead"));
    }

    /** 新手引导遮罩界面 */
    export function showGuideMask(cb: (n: Node) => void) {
        prefabs.instantiate("prefabs/guide/guideMask").then((dialog) => {
            if (isVaild(dialog)) {
                const script = dialog.getComponent(ViewComponent);
                script.show(upperNode, {});
                cb(dialog);
            }
        })
    }
    /** 胜利和当前关卡界面 */
    export function showLevelDialog(isWin: boolean, level: number, cb: () => void) {
        prefabs.instantiate("prefabs/dialog/level").then((dialog) => {
            if (isVaild(dialog)) {
                const script = dialog.getComponent(ViewComponent);
                script.show(upperNode, { isWin, level, cb });
            }
        })
    }
    /** 胜利和当前关卡界面 */
    export function showBigWinDialog(isAd: boolean) {
        prefabs.instantiate("prefabs/dialog/bigWin").then((dialog) => {
            if (isVaild(dialog)) {
                const script = dialog.getComponent(ViewComponent);
                script.show(upperNode, { isAd });
            }
        })
    }
}