import { Node } from "cc";
import { ViewManager } from "./ViewManger";
import { GameStorage } from "../GameStorage";
import { Coin } from "../view/component/Coin";
import { isVaild } from "../../Beach_common/utils/ViewUtil";

export class CoinManger {
    public static _instance: CoinManger = null;
    public static get instance(): CoinManger {
        if (!this._instance) {
            this._instance = new CoinManger();
        }
        return this._instance;
    }
    private _curDialog: Node = null;
    private _curCoin:Coin = null;
    /**记录当前弹窗，防止显示多个 */
    public setDialog(cur: Node) {
        this._curDialog = cur;
    }
    /**记录当前金币节点 */
    public setCoinNode(cur: Coin) {
        this._curCoin = cur;
    }
    /**获取当前金币节点 */
    public getCoinNode() {
        return this._curCoin;
    }
    /**显示弹窗 */
    public showDialog() {
        if (!this._curDialog) {//已经有弹窗不显示
            ViewManager.showGold();
        }
    }
    /**增加金币 */
    public addCoin(num:number,isShow: boolean = true) {
        GameStorage.addCoin(num);
        if(isShow){//立即显示
            if(isVaild(this._curCoin)){
                this._curCoin.showCurCoin();
            }
        }   
    }
    public showNum(num:number){
        if (isVaild(this._curCoin)) {
            this._curCoin.showNum(num);
        }
    }
    public showCurNum(){
        if (isVaild(this._curCoin)) {
            this._curCoin.showCurCoin();
        }
    }
}