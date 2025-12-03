import { native } from "cc";
import { sys } from "cc";
import { BaseStorageNS, ITEM_STORAGE } from "../localStorage/BaseStorage";
import { LocalRate } from "./LocalRate";
import { LangStorage } from "../localStorage/LangStorage";
import { ConfigConst } from "../../Christams_game/manager/ConfigConstManager";

export namespace EventTracking {
    /**上报事件 */
    export function sendEvent(data: Object) {
        data["ab_test"] = ConfigConst.getAbTest();
        const str = JSON.stringify(data);
        // console.log("上报",str);
        if (sys.platform === sys.Platform.ANDROID) {
            native.jsbBridgeWrapper.dispatchEventToNative("sendEvent", str);
        }
    }


    /**上报事件 */
    export function sendEventAdjust(data: Object) {
        const str = JSON.stringify(data);
        // console.log("上报",str);
        if (sys.platform === sys.Platform.ANDROID) {
            native.jsbBridgeWrapper.dispatchEventToNative("sendEvent", str);
        }
    }
     /**上报通过第几关 */
    export function sendEventLevelAdjust(level: number) {

        console.log("adjustEvent 上报关卡" + level);
        if (sys.platform === sys.Platform.ANDROID) {
            native.jsbBridgeWrapper.dispatchEventToNative("trackLevelEvent", level.toString());//adjust上报
        }

    }


    /**游戏信息 */
    const _eventData = {
        /**只上报一次事件*/
        one: {
            /**进入加载页 */
            loading: 0,
            /**进入提现指引 */
            guideHome: 0,
            /**提现指引页点击按钮 */
            guideHomeClick: 0,
            /**点击第一个现钞 */
            click1: 0,
            /**点击第二个现钞 */
            click2: 0,
            /**点击第三个现钞 */
            click3: 0,
            /**领取奖励 */
            clearPass1: 0,
            /**进入提现页 */
            toCashPage: 0,
            /**从提现页返回主页 */
            backHome: 0,
            /**消除第几次 */
            clear: 0,
            /**通过第几关 */
            level: 0,
            /**达到多少元 */
            toMoney: [],
        }

    }
    const key = ITEM_STORAGE.EventTrackings;
    /**
     * 保存游戏信息
     */
    export function saveLocal() {
        let tag = JSON.stringify(_eventData)
        BaseStorageNS.setItem(key, tag);
    }

    export function init() {
        let a = BaseStorageNS.getItem(key);
        let data = JSON.parse(a);
        for (let i in data) {
            if (_eventData[i] != undefined && data[i] != undefined)
                _eventData[i] = data[i];
        }
        saveLocal();
    }
    /**只上报一次的事件 */
    export function sendOneEvent(name: string) {
        if (_eventData.one[name] == 0) {
            _eventData.one[name] = 1;
            saveLocal();
            sendEvent({ event_type: "newhand_" + name })
        }
    }
    const moneys = [200, 300, 400, 450, 490];
    /**上报多少美元 */
    export function sendEventMoney(n: number) {
        const rate = LangStorage.getData().rate;
        const tm = _eventData.one.toMoney;
        moneys.forEach((v, i) => {
            if (v * rate <= n) {
                if (tm[i] != 1) {
                    tm[i] = 1;
                    saveLocal();
                    console.log("到达美元:" + v);
                    sendEvent({ event_type: "toMoney_" + v });
                }
            }
        })
    }
    const clears = [1, 10];
    /**上报消除多少次 */
    export function sendEventClear() {
        _eventData.one.clear++;
        const clear = _eventData.one.clear;
        saveLocal();
        if (clears.indexOf(clear) > -1) {
            sendEvent({ event_type: "clear_" + clear });
        }
    }

    /**上报通过第几关 */
    export function sendEventLevel(level: number) {
        const cur = _eventData.one.level;
        if (level > cur) {
            const data = { event_type: "level_x", level };
            _eventData.one.level = level;
            saveLocal();
            sendEvent(data);
            this.sendEventLevelAdjust(level);
        }
    }
}