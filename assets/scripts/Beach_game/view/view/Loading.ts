import { _decorator, Component, Node } from 'cc';
import ViewComponent from '../../../Beach_common/ui/ViewComponent';
import { ViewManager } from '../../manager/ViewManger';
import { NumFont } from '../../../Beach_common/ui/NumFont';
import { Progress } from '../component/Progress';
import { adHelper } from '../../../Beach_common/native/AdHelper';
import { Label } from 'cc';
import { delay, nextFrame } from '../../../Beach_common/utils/TimeUtil';
import { GuideManger } from '../../manager/GuideManager';
import { sys } from 'cc';
import { game } from 'cc';
import { Game } from 'cc';
import { ConfigConst } from '../../manager/ConfigConstManager';
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
        const all = sys.platform === sys.Platform.ANDROID ? 200 : 30;
        for (let i = 0; i <= all; i++) {
            this.progress.progress = i / all;
            const num = Math.floor(i / all * 100);
            if (this.qq) this.qq.angle -= 10;
            if (this.num) this.num.string = num + "%";
            if (this.loading) this.loading.string = "Loading... " + num + "%";
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


