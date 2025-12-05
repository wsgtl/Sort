

import { httpClient } from "../../Dress_common/web/HttpClient";
import { GameUtil } from "../GameUtil";
import { ConfigConst } from "./ConfigConstManager";
import { ViewManager } from "./ViewManger";

export namespace WebManger {
    /**正式域名 */
    const BaseUrl = "https://wyga.sdhgjdkjcmxfdd.com";
    /**接口url */
    const Url = "/nszx/kuz/ndxs/tag1/pska/sgsvaz";

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