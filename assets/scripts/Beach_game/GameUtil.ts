


/**游戏相关常量和方法 */

import { Vec3 } from "cc";
import { v3 } from "cc";
import { v2 } from "cc";
import { Vec2 } from "cc";
import { GameStorage } from "./GameStorage";
import { MathUtil } from "../Beach_common/utils/MathUtil";


/**格子数据 */
export type CellData = {
   type: ColletType,
   cellNum: number,//格子一组多少个
   index: number,//柜子中从左到右第几个
   cabinet?: CabinetData//柜子数据
}
/**柜子数据 */
export type CabinetData = {
   x: number,
   y: number,
   len: number,
   index: number
}
/**柜子所有数据 */
export type CabinetAllData = {
   cabinet: CabinetData,
   cells: CellData[]
}
/**收集物类别 */
export enum ColletType {
   none = 0,
   money = 1,//现金
   c1,
   c2,
   c3,
   c4,
   c5,
   c6,
   c7,
   c8,
   c9,
   c10,
   c11,
   c12,
   c13,
   c14,
   c15,
   c16,
   c17,
   c18,
   c19,
   c20,
}
/**奖励类别 */
export enum RewardType {
   none = 0,
   money = 1,//现金
   coin,//金币
}
/**道具类别 */
export enum PropType {
   none = 0,
   back = 1,//回退道具
   shuffle,//打乱道具
   besom,//扫把道具
   resurrection//复活
}

export namespace GameUtil {
   export const IsTest: boolean = true;
   export const CellW: number = 167;//格子宽
   export const CellH: number = 225;//格子高
   export const DownW: number = 132;//下方每个格子宽
   export const AllRow: number = 16;//生成的行数
   export const PropLimit: number = 3;//道具每回合限制数量
   export const CollectionClearCoins: number = 3;//物品每次消除增加金币数
   /**每一级收集物组数 */
   export const LevelCollectionNum: number[] = [10, 150, 250, 330, 400];
   /**道具金币价格 */
   export const PropCoins: number[] = [100, 300, 500];
   /**看广告获得的金币 */
   export const ReceiveCoins: number = 30;
   /**签到金币数 */
   export const SigninCoins: number[] = [100, 200, 300, 400, 500, 600, 1000];
   /**任务分钟 */
   export const TaskMinutes: number[] = [10, 30, 60, 90, 120];
   /**任务加的钱 美元 */
   export const TaskMoney: number = 5;
   /**收集品随机出现钱的概率 */
   export const ProMoney: number = 0.14;

   export function getMoneyNodeNums(num:number){
      return Math.ceil(num * GameUtil.ProMoney)
   }
   /**当前游戏时长 分钟 */
   export function getCurMinutes() {
      const time = GameStorage.getGameTime();
      return Math.floor(time / 60);
   }
   /**柜子组合方式 */
   export const Cabinets: number[][] = [
      [2, 0, 2, 0, 2, 0],
      [0, 2, 0, 2, 0, 0],
      // [2, 0, 0, 3, 0, 0],
      [2, 0, 3, 0, 0, 0],
      [0, 2, 0, 3, 0, 0],
      [3, 0, 0, 3, 0, 0],
      [3, 0, 0, 2, 0, 0],
      // [3, 0, 0, 0, 2, 0],
      [0, 3, 0, 0, 2, 0],
      [4, 0, 0, 0, 2, 0],
      [2, 0, 4, 0, 0, 0],
      [0, 4, 0, 0, 0, 0],
      [5, 0, 0, 0, 0, 0],
      [0, 5, 0, 0, 0, 0],
      [6, 0, 0, 0, 0, 0],
   ];
   /**获取随机柜子方式 */
   export function getRandomCabinets(n: number = 0) {
      let arr = Cabinets;
      if (n == 3) {
         arr = [[0, 3, 0, 0, 0, 0], [0, 0, 3, 0, 0, 0], [3, 0, 0, 0, 0, 0]];
      } else if (n == 4) {
         arr = [[0, 4, 0, 0, 0, 0], [0, 0, 4, 0, 0, 0], [4, 0, 0, 0, 0, 0]];
      } else if (n == 5) {
         arr = [[5, 0, 0, 0, 0, 0], [0, 5, 0, 0, 0, 0]];
      } else if (n == 6) {
         arr = [[3, 0, 0, 3, 0, 0], [2, 0, 4, 0, 0, 0], [4, 0, 0, 0, 2, 0]];
      }
      return arr.getRandomItem();

   }
   /**计算柜子坐标 */
   export function getCabinetPos(x: number, y: number): Vec3 {
      return v3((x - 3) * CellW, y * CellH);
   }
   /**计算收集品坐标 */
   export function getCellPos(x: number, y: number): Vec3 {
      return v3((x - 2.5) * CellW, y * CellH + 50);
   }
   /**计算点击坐标 */
   export function calIndex(pos: Vec3): Vec2 {
      const _x = Math.floor(pos.x / CellW + 3);
      const _y = Math.floor(pos.y / CellH);
      return v2(_x, _y);
   }

   export function getCurDay() {
      const ct = Date.now();
      // 转换为天数（1天 = 24小时 × 60分钟 × 60秒 × 1000毫秒）
      return Math.floor(ct / (24 * 60 * 60 * 1000));
      // return GameStorage.getDaily().testDay;//测试
   }
   /**第一关收集品 */
   export function getLevel1Collect() {
      const num = 10;
      let a: ColletType[] = [];

      for (let i = 2; i <= num; i++) {
         let type = i;
         a.push(type);
         a.push(type);
         a.push(type);
      }
      a.shuffle();
      //添加钱
      a.splice(6, 0, 1);
      a.splice(8, 0, 1);
      a.splice(11, 0, 1);
      return { num, arr: a };
   }
   /**第一关柜子排布 */
   export function getLevel1Cabinet() {
      return [
         [5, 0, 0, 0, 0, 0],
         [0, 2, 0, 2, 0, 0],
         [2, 0, 4, 0, 0, 0],
         [0, 3, 0, 0, 2, 0],
         [0, 2, 0, 2, 0, 0],
         [0, 0, 3, 0, 0, 0],
         [0, 3, 0, 0, 0, 0],
      ]
   }
   /**获取随机ID */
   export function gerRandomId() {
      return MathUtil.random(100000, 999999);
   }
   
}



