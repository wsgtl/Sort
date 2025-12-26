
import { httpClient } from "../../Farm_common/web/HttpClient";
import { GameUtil } from "../GameUtil";
import { ConfigConst } from "./ConfigConstManager";
import { ViewManager } from "./ViewManger";

export namespace WebManger {
    /**正式域名 */
    const BaseUrl = "https://xipd.duckdkjklckcd.com";
    /**接口url */
    const Url = "/vojg/jbh/ucqw/version1/cuyry/zoxsco";
   
    export function init() {
        httpClient.setBaseURL(BaseUrl);
    }
    export async function getData() {
        ConfigConst.init();
        const res = await httpClient.get(Url);
        if (res.code == 200) {
            ConfigConst.calRes(res.data);
            console.log("获取配置成功");
            GameUtil.IsTest && ViewManager.showTips("获取配置成功")
        } else {
            GameUtil.IsTest && ViewManager.showTips("获取配置失败" + res.code)
            console.log("获取配置失败" + res.code);
        }

    }

}