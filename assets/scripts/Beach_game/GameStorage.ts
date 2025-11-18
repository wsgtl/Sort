import { BaseStorageNS, ITEM_STORAGE } from "../Beach_common/localStorage/BaseStorage";
import { PropType } from "./GameUtil";


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
        /**是否开启过兑换券奖励弹窗 */
        isCash: 0,
        /**剩余位置是否解锁 */
        cellLock: [],
        /**新手引导完成第几步 0：没完成 1：完成主页引导 2：完成游戏页引导 */
        guideStep: 0,
        /**签到 */
        daily: {
            /**测试天数 */
            testDay: 1,
            lastDay: 0,//上次签到时间戳，按天数计算
            weekDay: 1,//当前可签到星期几
            isReceive: false,//今天是否已经领取
        },
        prop: {
            back: 0,//回退道具数量
            shuffle: 0,//打乱道具数量
            besom: 0,//扫把道具数量
        },
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
        this.saveLocal();
    }

    /**获取金币数 */
    export function getCoin() {
        return _gameData.coin;
    }
    /**增加金币数 */
    export function addCoin(num: number) {
        _gameData.coin += num;
        saveLocal();
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

    /**当前签到信息 */
    export function getDaily() {
        // const day = _gameData.daily.weekDay;
        // const ld = _gameData.daily.lastDay;
        // const ct = Date.now();
        // // 转换为天数（1天 = 24小时 × 60分钟 × 60秒 × 1000毫秒）
        // const curDay = Math.floor(ct / (24 * 60 * 60 * 1000));
        // if (curDay - ld > 0) {
        //     _gameData.daily.lastDay = curDay;
        //     _gameData.daily.weekDay = day == 7 ? 1 : day + 1;
        //     saveLocal();
        // }
        return _gameData.daily;
    }
    /**签到 */
    export function signin(lastDay: number) {
        _gameData.daily.lastDay = lastDay;
        _gameData.daily.isReceive = true;
        saveLocal();
    }
    /**下一天 */
    export function nextDay(lastDay: number) {
        _gameData.daily.weekDay = _gameData.daily.weekDay == 7 ? 1 : _gameData.daily.weekDay + 1;
        _gameData.daily.isReceive = false;
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
    export function addPropNum(type: PropType, num: number) {
        if (type == PropType.back) {
            _gameData.prop.back += num;
        } else if (type == PropType.shuffle) {
            _gameData.prop.shuffle += num;
        } else {
            _gameData.prop.besom += num;
        }
        saveLocal();
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
    /**是否开启过兑换券奖励弹窗 */
    export function getIsCash() {
        return _gameData.isCash;
    }
    /**保存开启过兑换券奖励弹窗 */
    export function setIsCash() {
        if (_gameData.isCash == 1) return;
        _gameData.isCash = 1;
        saveLocal();
    }
}