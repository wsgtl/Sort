import { _decorator, Component, Node } from 'cc';
import { ViewManager } from '../../manager/ViewManger';
import { GuideManger } from '../../manager/GuideManager';
import { sys } from 'cc';
import { game } from 'cc';
import { Game } from 'cc';
import { ConfigConst } from '../../manager/ConfigConstManager';
import { Label } from 'cc';
import { adHelper } from '../../../Xmas_common/native/AdHelper';
import { EventTracking } from '../../../Xmas_common/native/EventTracking';
import { Jsb } from '../../../Xmas_common/platform/Jsb';
import ViewComponent from '../../../Xmas_common/ui/ViewComponent';
import { delay } from '../../../Xmas_common/utils/TimeUtil';
import { WebManger } from '../../manager/WebManager';
import { Progress } from '../component/Progress';
const { ccclass, property } = _decorator;

@ccclass('Loading')
export class Loading extends ViewComponent {
    @property(Progress)
    progress: Progress = null;
    @property(Label)
    num: Label = null;
    @property(Label)
    loading: Label = null;
    @property(Node)
    qq: Node = null;

    async showProgress() {
        const pro = WebManger.getData();
        EventTracking.sendOneEvent("loading");
        const all = !Jsb.browser() ? 100 : 10;
        for (let i = 0; i <= all; i++) {
            this.progress.progress = i / all;
            const num = Math.floor(i / all * 100);
            if (this.qq) this.qq.angle -= 10;
            if (this.num) this.num.string = num + "%";
            if (this.loading) this.loading.string = "Loading... " + num + "%";
            if (i == all - 1) {
                await pro;
            }
            if (i == all) {
                this.scheduleOnce(() => {
                    if (GuideManger.isGuide() && !ConfigConst.isShowA)
                        ViewManager.showGuideHome();
                    else
                        ViewManager.showGameView();
                }, 0.2);
            }
            await delay(0.03);
        }
    }
    show(parent: Node, args?: any) {
        parent.addChild(this.node);
        this.showProgress();
        adHelper.init();
        // game.on(Game.EVENT_SHOW, () => { adHelper.showInterstitial(); console.log("回前台显示插屏广告") })
    }
}


