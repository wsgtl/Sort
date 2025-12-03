import { Node } from "cc";
import { ViewManager } from "./ViewManger";
import { GameStorage } from "../GameStorage";
import { ConfigConst } from "./ConfigConstManager";
import { ActionEffect } from "../../Christams_common/effects/ActionEffect";
import { LangStorage } from "../../Christams_common/localStorage/LangStorage";
import { EventTracking } from "../../Christams_common/native/EventTracking";
import { FormatUtil } from "../../Christams_common/utils/FormatUtil";
import { MathUtil } from "../../Christams_common/utils/MathUtil";
import { isVaild } from "../../Christams_common/utils/ViewUtil";
import { Money } from "../view/component/Money";

export class MoneyManger {
    public static _instance: MoneyManger = null;
    public static get instance(): MoneyManger {
        if (!this._instance) {
            this._instance = new MoneyManger();
        }
        return this._instance;
    }
    private _curDialog: Node = null;
    private _curMoney: Money = null;
    /**记录当前弹窗，防止显示多个 */
    public setDialog(cur: Node) {
        this._curDialog = cur;
    }
    /**记录当前钱节点 */
    public setMoneyNode(cur: Money) {
        this._curMoney = cur;
    }
    public getMoneyNode() {
        return this._curMoney;
    }
    /**显示弹窗 */
    public showDialog() {
        if (!this._curDialog) {//已经有弹窗不显示
            ViewManager.showPurse();
        }
    }
    /**增加钱 */
    public addMoney(num: number, isShow: boolean = true, isAni: boolean = true) {
        const last = GameStorage.getMoney();
        const curMoney = GameStorage.addMoney(num);
        if (isShow) {//立即显示
            if (isVaild(this._curMoney)) {
                this._curMoney.showCurMoney();
            }
        } else {
            if (isAni) {
                ActionEffect.numAddAni(last, curMoney, (n: number) => { this.showNum(n) });
                this.scaleAni();
            }

        }
        EventTracking.sendEventMoney(curMoney);
    }
    public showNum(num: number) {
        if (isVaild(this._curMoney)) {
            this._curMoney.showNum(num);
        }
    }
    public showAddNum(num: number) {
        if (isVaild(this._curMoney)) {
            this._curMoney.showAddNum(num);
        }
    }
    public showCurNum() {
        if (isVaild(this._curMoney)) {
            this._curMoney.showCurMoney();
        }
    }

    /**获取奖励钱 */
    public getReward(bl: number = 1) {
        const other = ConfigConst.Other;
        const lbl = Math.pow(other.LevelMoneyAttenuation, GameStorage.getCurLevel() - 1);
        const left = (other.LevelOneMoney[0] ?? 12) * 100;
        const right = (other.LevelOneMoney[1] ?? 18) * 100;
        return LangStorage.getData().rate * lbl * bl * MathUtil.random(left, right) / 100;
    }
    public rate(money: number) {
        return LangStorage.getData().rate * money;
    }
    public scaleAni() {
        ActionEffect.rewardScaleAni(this._curMoney.node);
    }
    /**获取钱的显示 比如：$33.21 */
    public getMoneyString(point: string = ".") {
        return FormatUtil.toMoney(GameStorage.getMoney(), point, false);
    }
}