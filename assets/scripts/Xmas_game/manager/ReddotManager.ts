
import Debugger from "../../Xmas_common/Debugger";
import { isVaild } from "../../Xmas_common/utils/ViewUtil";
import { GameStorage } from "../GameStorage";
import { GameUtil } from "../GameUtil";
import { Node } from 'cc'

const debug = Debugger("GameManger");
/**红点管理 */
export class ReddotManager {
    public static _instance: ReddotManager = null;
    public static get instance(): ReddotManager {
        if (!this._instance) {
            this._instance = new ReddotManager();
        }
        return this._instance;
    }

    private taskDot: Node;
    public init(taskDot: Node) {
        this.taskDot = taskDot;
    }
    /**显示签到红点 */
    // public showSigninDot() {
    //     const daily = GameStorage.getDaily();
    //     let isShow = false;
    //     if (daily.isReceive) {
    //         const ld = daily.lastDay;
    //         const curDay = GameUtil.getCurDay();
    //         if (curDay - ld > 0) {//可领取
    //             isShow = true;
    //         }
    //     } else {
    //         isShow = true;
    //     }
    //     if (isVaild(this.signinDot)) {
    //         this.signinDot.active = isShow;
    //     }
    //     return isShow;
    // }
    /**显示任务红点 */
    public showTaskDot() {    
        const minutes = GameUtil.getCurMinutes();
        const task = GameStorage.getTask();
        let isShow = false;
        for (let i in GameUtil.TaskMinutes) {
            if (task[i] != 1) {
                if (GameUtil.TaskMinutes[i] <= minutes) { isShow = true; break; }
            }
        }
        if (isVaild(this.taskDot)) {
            this.taskDot.active = isShow;
        }
    }

}
