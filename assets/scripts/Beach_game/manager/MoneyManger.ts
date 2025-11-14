import { Node } from "cc";
import { ViewManager } from "./ViewManger";
import { GameStorage } from "../GameStorage";
import { isVaild } from "../../Beach_common/utils/ViewUtil";
import { Money } from "../view/component/Money";
import { EventTracking } from "../../Beach_common/native/EventTracking";

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
    public getMoneyNode(){
        return this._curMoney;
    }
    /**显示弹窗 */
    public showDialog() {
        if (!this._curDialog) {//已经有弹窗不显示
            ViewManager.showPurse();
        }
    }
    /**增加钱 */
    public addMoney(num: number, isShow: boolean = true) {
        const curMoney = GameStorage.addMoney(num);
        EventTracking.sendEventCoin(curMoney);
        if (isShow) {//立即显示
            if (isVaild(this._curMoney)) {
                this._curMoney.showCurMoney();
            }
        }
    }
    public showNum(num:number){
        if (isVaild(this._curMoney)) {
            this._curMoney.showNum(num);
        }
    }
    public showCurNum(){
        if (isVaild(this._curMoney)) {
            this._curMoney.showCurMoney();
        }
    }
}