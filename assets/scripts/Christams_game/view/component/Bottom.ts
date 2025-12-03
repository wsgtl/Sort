import { _decorator, Component, Node } from 'cc';
import { AudioManager } from '../../manager/AudioManager';
import { ViewManager } from '../../manager/ViewManger';
import { ActionEffect } from '../../../Christams_common/effects/ActionEffect';
import { delay } from '../../../Christams_common/utils/TimeUtil';
const { ccclass, property } = _decorator;

@ccclass('Bottom')
export class Bottom extends Component {
    @property(Node)
    btnHome: Node = null;
    @property(Node)
    btnShop: Node = null;
    @property(Node)
    btnTask: Node = null;
    @property(Node)
    di: Node = null;

    private curDi: number = 0;
    private isAni: boolean = false;
    onLoad() {
        this.btnHome.on(Node.EventType.TOUCH_START, () => { this.onBtn(0); })
        this.btnShop.on(Node.EventType.TOUCH_START, () => { this.onBtn(-1); })
        this.btnTask.on(Node.EventType.TOUCH_START, () => { this.onBtn(1); })


        this.showBtns(false);
    }
    async onBtn(index:number){
        if (this.isAni) return; 
        this.curDi = index; 
        this.showBtns(true);
        await ViewManager.clearDialog(true);
        if(index==-1){
            ViewManager.showShop();
        }else if(index==1){
            ViewManager.showTask();
        }
    }
    private async showBtns(isAni: boolean) {
        const btns = [this.btnShop, this.btnHome, this.btnTask];
        const time = 0.2;
        this.isAni = true;
        btns.forEach((v, i) => {
            const active = i == this.curDi + 1;
            const str = v.getChildByName("str");
            const icon = v.getChildByName("icon");
            str.active = active;
            const x = this.curDi * 200;
            const y = active ? 30 : 0
            if (isAni) {
                active ? ActionEffect.fadeIn(str, time) : ActionEffect.fadeOut(str, time);
                ActionEffect.moveTo(icon, time, icon.x, y);
                ActionEffect.moveTo(this.di, time, x, this.di.y);
            } else {
                this.di.x = x;
                icon.y = y;
            }
        })
        if (isAni) {
            AudioManager.playEffect("switch");
            await delay(time);
        }
        this.isAni = false;
    }
}


