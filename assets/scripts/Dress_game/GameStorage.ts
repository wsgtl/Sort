
import { ITEM_STORAGE, BaseStorageNS } from "../Dress_common/localStorage/BaseStorage";
import { GameUtil, PropType } from "./GameUtil";


/**
 * 系统设置类的缓存，不用加密p
 */
export namespace GameStorage {
    /**游戏信息 */
    const _gameData = {

        /**金币数 */
        coin: 0,
        /**钱数 */
        money: 0,
        /**当前关卡 */
        curLevel: 1,
        /**上一关卡 */
        lastLevel: 1,
        /**登录第几天 */
        day:0,
        /**剩余位置是否解锁 */
        cellLock: [],
        /**新手引导完成第几步 0：没完成 1：完成主页引导 2：完成游戏页引导 */
        guideStep: 0,
        prop: {
            back: 0,//回退道具数量
            shuffle: 0,//打乱道具数量
            besom: 0,//扫把道具数量
        },
        /**道具在当前关卡金币已领取数量 */
        propCurLevel: [0, 0, 0, 0],
        /**道具在当前关卡视频取数量 */
        propCurLevelAd: [0, 0, 0, 0],
        task: []//任务奖励领取情况
    }
    const key = ITEM_STORAGE.Game;
    /**
     * 保存游戏信息
     */
    export function saveLocal() {
        let tag = JSON.stringify(_gameData)
        BaseStorageNS.setItem(key, tag);
    }

    export function init() {
        let a = BaseStorageNS.getItem(key);
        let data = JSON.parse(a);
        for (let i in data) {
            if (_gameData[i] != undefined && data[i] != undefined)
                _gameData[i] = data[i];
        }
        saveLocal();
        checkNewDay();
    }

    /**获取金币数 */
    export function getCoin() {
        return _gameData.coin;
    }
    /**增加金币数 */
    export function addCoin(num: number) {
        _gameData.coin += num;
        saveLocal();
        return _gameData.coin;
    }
    /**设置金币数 */
    export function setCoin(num: number) {
        _gameData.coin = num;
        saveLocal();
    }

    /**获取钱数 */
    export function getMoney() {
        return _gameData.money;
    }
    /**增加钱数 */
    export function addMoney(num: number) {
        _gameData.money += num;
        saveLocal();
        return _gameData.money;
    }
    /**设置钱数 */
    export function setMoney(num: number) {
        _gameData.money = num;
        saveLocal();
    }

    /**当前关卡等级 */
    export function getCurLevel() {
        return _gameData.curLevel;
    }
    /**存储下一关 */
    export function nextLevel() {
        _gameData.curLevel += 1;
        saveLocal();
    }
    /**上一关卡等级 */
    export function getLastLevel() {
        return _gameData.lastLevel;
    }
    /**存储上一关 */
    export function setLastLevel(level: number) {
        _gameData.lastLevel = level;
        saveLocal();
    }


    /**获取道具数量 */
    export function getPropNum(type: PropType) {
        if (type == PropType.back) {
            return _gameData.prop.back;
        } else if (type == PropType.shuffle) {
            return _gameData.prop.shuffle;
        } else {
            return _gameData.prop.besom;
        }
    }
    /**增加道具数量 */
    export function addPropNum(type: PropType, num: number, isAd: boolean = false) {
        if (type == PropType.back) {
            _gameData.prop.back += num;
        } else if (type == PropType.shuffle) {
            _gameData.prop.shuffle += num;
        } else {
            _gameData.prop.besom += num;
        }
        if (num > 0)
            if (isAd)
                _gameData.propCurLevelAd[type - 1] += 1;
            else
                _gameData.propCurLevel[type - 1] += 1;
        saveLocal();
    }
    /**获取道具已领取状态 */
    export function getPropCurLevel(type: PropType) {
        const coin = _gameData.propCurLevel[type - 1];
        const ad = _gameData.propCurLevelAd[type - 1];
        return { coin, ad, all: coin + ad };
    }
    /**重开游戏，道具领取数量重置 */
    export function replayPropCurLevel() {
        _gameData.propCurLevel = [0, 0, 0, 0];
        _gameData.propCurLevelAd = [0, 0, 0, 0];
        saveLocal();
    }
    /**复活一次 */
    export function resurrection(isAd: boolean) {
        if (isAd)
            _gameData.propCurLevelAd[PropType.resurrection - 1] += 1;
        else
            _gameData.propCurLevel[PropType.resurrection - 1] += 1;
        saveLocal();
    }
    /**当前游戏时长 */
    export function getGameTime() {
        const t = BaseStorageNS.getItem(ITEM_STORAGE.GameTime);
        return t ? JSON.parse(t) : 0;
    }
    /**增加游戏时长 */
    export function addGameTime(t: number) {
        let cur = getGameTime();
        cur += t;
        BaseStorageNS.setItem(ITEM_STORAGE.GameTime, cur);
    }
    /**当前第几天，如果是新一天，重新刷新时间 */
    function checkNewDay(){
        const cur = GameUtil.getCurDay();
        if(cur>_gameData.day){
            _gameData.day = cur;
            _gameData.task=[];
            BaseStorageNS.setItem(ITEM_STORAGE.GameTime, 0);
            saveLocal();
        }
    }
    /**当前任务领取情况 */
    export function getTask() {
        return _gameData.task;
    }
    /**领取几关 */
    export function receiveTask(level: number) {
        _gameData.task[level] = 1;
        saveLocal();
    }
    /**当前剩余位置是否解锁 */
    export function isCellLock(level: number) {
        return _gameData.cellLock[level];
    }
    /**剩余位置解锁 */
    export function setCellUnlock(level: number) {
        _gameData.cellLock[level] = 1;
        saveLocal();
    }
    /**新手引导完成第几步 */
    export function getGuideStep() {
        return _gameData.guideStep;
    }
    /**设置新手引导完成第几步 */
    export function setGuideStep(step: number) {
        _gameData.guideStep = step;
        saveLocal();
    }

}