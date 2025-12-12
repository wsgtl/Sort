
import { ITEM_STORAGE, BaseStorageNS } from "../../Xmas_common/localStorage/BaseStorage";
import { Jsb } from "../../Xmas_common/platform/Jsb";
import { GameUtil } from "../GameUtil";


/**配置表常量管理 */
export class ConfigConstManager {
    public static _instance: ConfigConstManager = null;
    public static get instance(): ConfigConstManager {
        if (!this._instance) {
            this._instance = new ConfigConstManager();
        }
        return this._instance;
    }
    /**是否审核 */
    public isCheck: boolean = true;

    /**其他参数 */
    public Other = {
        /**每关关卡消除组数数量，第二关开始 */
        LevelCollectionNum: [167, 250, 330, 400],
        /**每关关卡元素种类，第二关开始到第四关 */
        LevelCollectionTypeNum: [14, 14, 14],
        /**每次消除获得金币数 */
        CollectionClearCoins: 3,
        /**每多少个元素中有一个现钞 */
        ProMoney: 7,
        /**每个道具限制使用次数 */
        PropLimit: 3,
        /**第一关现钞随机范围 */
        LevelOneMoney:[12,18],
        /**后续关卡衰减数值 */
        LevelMoneyAttenuation:0.7,
        /**插屏弹出间隔次数 */
        InterShowNum: 4,
        /**奖励多倍弹出间隔次数 */
        RewardDoubleShowNum: 4,
        /**任务基础奖励数额 */
        TaskMoney: 5,

    }
    /**初始化数值 */
    public init() {
        this.getData();
    }
    /**处理参数 */
    public calRes(data: any) {
        const arr: { mzjzc: string, crwkj: string }[] = data.gzlrpxbkxz[0].wvdgfjkdga.fnerq.rbh;
        const a = this.getAbTest();//ABtest的值
        const pre = "data_" + a;
        const handlers = {//对象映射赋值
            "isCheck": (d) => { if (this.isCheck) this.isCheck = d },//过了审核模式之后就不能重新变回审核模式
            [pre]: (d) => {
                this.setData(d);
            }
        };
        arr.forEach(v => {
            handlers[v.mzjzc]?.(JSON.parse(v.crwkj));
        })
        this.saveData();
    }
    private key = ITEM_STORAGE.WebConfig;
    /**保存常量数值，如果网络连接出错则使用上次保存的数值 */
    private saveData() {
        const data = {
            isCheck: this.isCheck,
            Other: this.Other
        }
        BaseStorageNS.setItem(this.key, JSON.stringify(data));
    }
    private getData() {
        let d = BaseStorageNS.getItem(this.key);
        if (d) {
            const data = JSON.parse(d);
            this.setData(data);
            // this.isCheck = data.isCheck;
        }
    }
    /**设置常量数值 */
    private setData(d) {
        if (d) {
            for (let i in d) {
                this[i] = d[i];
            }
        }
    }


    /**是否显示A面 */
    public get isShowA() {
        // return this.isCheck;
        return (Jsb.ios() || Jsb.browser()) && this.isCheck;
    }
    /**设置随机AB值 */
    public setAb() {
        const id = GameUtil.gerRandomId();
        let abTest = id % 2 == 1 ? "A" : "B";
        const d = { id, abTest };
        BaseStorageNS.setItem(ITEM_STORAGE.AbTest, JSON.stringify(d));
        return d;
    }
    /**AB测试 */
    public getAbTest() {
        return this.getAbTestData().abTest;
    }
    /**用户ID */
    public getId() {
        return this.getAbTestData().id;
    }
    public getAbTestData() {
        let d = BaseStorageNS.getItem(ITEM_STORAGE.AbTest);
        if (!d) return this.setAb();
        else return JSON.parse(d);
    }
}
/**配置表常量 */
export const ConfigConst = ConfigConstManager.instance;

let d=`{
  "gzlrpxbkxz": [
    {
      "cjcewefhmqta": "fxsqcrlshujh",
      "etlczg": "lempovmwblw",
      "wwjntsfnist": "mpfymrgutlqnsq",
      "wmitwqmweh": "kuhjuxstcebp",
      "wvdgfjkdga": {
        "mycif": 200,
        "fnerq": {
          "zkw": "",
          "esg": "",
          "appId": "65087367",
          "xoq": 0,
          "kyah": "",
          "rbh": [
            {
              "extensionDesc": "",
              "mzjzc": "isCheck",
              "crwkj": "false"
            },
            {
              "extensionDesc": "",
              "mzjzc": "data_A",
              "crwkj": "{\"Other\":{\"LevelCollectionNum\":[167,250,330,400],\"LevelCollectionTypeNum\":[14,14,14],\"CollectionClearCoins\":3,\"ProMoney\":7,\"PropLimit\":3,\"LevelOneMoney\":[12,18],\"LevelMoneyAttenuation\":0.7,\"InterShowNum\":3,\"RewardDoubleShowNum\":4,\"TaskMoney\":5}}"
            },
            {
              "extensionDesc": "",
              "mzjzc": "data_B",
              "crwkj": "{\"Other\":{\"LevelCollectionNum\":[167,250,330,400],\"LevelCollectionTypeNum\":[14,14,14],\"CollectionClearCoins\":3,\"ProMoney\":7,\"PropLimit\":3,\"LevelOneMoney\":[12,18],\"LevelMoneyAttenuation\":0.7,\"InterShowNum\":2,\"RewardDoubleShowNum\":4,\"TaskMoney\":5}}"
            }
          ],
          "yodazu": 0,
          "bktm": 0,
          "zyr": 0,
          "chzj": ""
        },
        "znc": "success",
        "success": true
      }
    }
  ],
  "mbcepvtfjhjqdy": "muldcydokhedxe",
  "ubzypo": "vexodcuizphd",
  "wlehiczj": "kuonmnkt"
}`