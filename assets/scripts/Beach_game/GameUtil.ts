


/**游戏相关常量和方法 */

import { Vec3 } from "cc";
import { v3 } from "cc";
import { v2 } from "cc";
import { Vec2 } from "cc";
import { GameStorage } from "./GameStorage";

/**结算数据 */
export type GameOverData = {
   score: number,
   // isWin: boolean
}

/**格子数据 */
export type CellData = {
   type: ColletType,
   cellNum: number,//格子一组多少个
   index: number,//柜子中从左到右第几个
}
/**柜子数据 */
export type CabinetData = {
   x: number,
   y: number,
   len: number,
   index: number
}
/**收集物类别 */
export enum ColletType {
   none = 0,
   money = 1,//现金
   coin,//金币
   cash,//兑换卡
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
   cash,//兑换卡
}
/**道具类别 */
export enum PropType {
   none = 0,
   back = 1,//回退道具
   shuffle,//打乱道具
}

export namespace GameUtil {
   export const CellW: number = 103;//格子宽
   export const CellH: number = 122;//格子高
   export const AllRow: number = 9;//生成的行数
   /**登陆后是否弹签到 */
   export const Daily = {isShow:false};
   /**每一级收集物组数 */
   export const LevelCollectionNum: number[] = [20, 20, 30, 40, 200];

   /**兑换券收集到可提现数量 */
   export const CashWithdrawNum: number = 100;
   /**道具金币价格 */
   export const PropCoins: number = 100;
   /**看广告获得的金币 */
   export const ReceiveCoins: number = 30;
   /**签到金币数 */
   export const SigninCoins: number[] = [100, 200, 300, 400, 500, 600, 1000];
   /**任务奖励金币数 */
   export const TaskCoin: number[] = [3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
   /**提现界面提示词 */
   export const PurseTips: string[] = [
      `           Game Policies and Prize 
            Withdrawal Guidelines
1.Earning and Viewing Prizes
Tokens earned by playing games may result in winning prizes,which will be added to your balance.
To view your balance,navigate to the main page of the game.
2.Prize Fulfillment and Account
Requirements
All eligible cash prizes will be awarded using the specified method within the game.
If you do not have an account,you can create one for free on the official website.
Prize fulfillment is subject to the Terms of Service and Privacy Policy.`,
`3. Withdrawal Process
To withdraw funds, you must
Enter your transfer account nformation.
Follow the provided withdrawal instructions.
Withdrawal requests are processed within 7 days.,
4. withdrawal Limitsay
The maximum amount for a single withdrawal is $500.
All payments will be made in US Dollars (USD).
5.Balance and Account Management
If you delete the game from your device, your balance will be permanently deleted, and any unclaimed prizes without valid withdrawal requests will be forfeited.`,

`6. incorrect Withdrawal Information
Once funds are transferred to the specified account, we cannot redirect or recover funds due to incorrect account details or other errors.
The player is solely responsible for ensuring the accuracy of the provided account information.
7. Taxes and Fees
You are solely responsible for any applicable taxes or transfer fees.
The game reserves the right to withhold amounts from payments as required by government authorities.
8. Inability to Fulfill Prizes
If a prize cannot be fulfilled due to the winner's actions (e.g., failure to withdraw funds within the stipulateo timeframe, deletion of the winner's account), we reserve the right to forfeitthe prize.
The decision regarding unfulfilled prizes is made at our sole discretion.`
   ];


   /**柜子组合方式 */
   export const Cabinets: number[][] = [
      [2, 0, 2, 0, 2, 0],
      [0, 2, 0, 2, 0, 0],
      [2, 0, 0, 2, 0, 0],
      [2, 0, 0, 3, 0, 0],
      [2, 0, 3, 0, 0, 0],
      [0, 2, 0, 3, 0, 0],
      [3, 0, 0, 3, 0, 0],
      [3, 0, 0, 2, 0, 0],
      [3, 0, 0, 0, 2, 0],
      [0, 3, 0, 0, 2, 0],
      [4, 0, 0, 0, 2, 0],
      [2, 0, 4, 0, 0, 0],
      [0, 4, 0, 0, 0, 0],
      [5, 0, 0, 0, 0, 0],
      [0, 5, 0, 0, 0, 0],
   ];
   /**获取随机柜子方式 */
   export function getRadnomCabinets(n: number = 0) {
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
      const cashNum = GameStorage.getCash();

      for (let i = 2; i <= num; i++) {
         let type = i;
         if (i == ColletType.cash && cashNum > CashWithdrawNum - 10) //防止第一关玩一百局凑够一百个兑换券   
            type = 5;
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
         [2, 0, 0, 2, 0, 0],
         [0, 2, 0, 2, 0, 0],
         [2, 0, 4, 0, 0, 0],
         [3, 0, 0, 0, 2, 0],
         [2, 0, 0, 2, 0, 0],
         [0, 0, 3, 0, 0, 0],
         [0, 4, 0, 0, 0, 0],
      ]
   }


}



