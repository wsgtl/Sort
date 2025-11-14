import { _decorator, Component, Node } from 'cc';
import { DialogComponent } from '../../../Beach_common/ui/DialogComtnet';
import { NumFont } from '../../../Beach_common/ui/NumFont';
import { tween } from 'cc';
import { ActionEffect } from '../../../Beach_common/effects/ActionEffect';
import { delay } from '../../../Beach_common/utils/TimeUtil';
import { AudioManager } from '../../manager/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('LevelDialog')
export class LevelDialog extends DialogComponent {
    @property(NumFont)
    level:NumFont = null;
    @property(Node)
    titleWin:Node = null;
    @property(Node)
    titleLevel:Node = null;
    @property(Node)
    trumpet:Node = null;
    @property(Node)
    shine:Node = null;
    @property(Node)
    cd:Node = null;

    private isWin:boolean = false;
    show(parent: Node, args?: any): void {
        parent.addChild(this.node);
        this.isWin = args.isWin;
        if(args.isWin){
            this.showTitle(true);
            this.showTrumpet();
            delay(2.5).then(async ()=>{
                this.node.destroy();
                args.cb?.();
            })
        }else{
            this.showTitle(false);
            this.trumpet.active = false;
            this.shine.active = false;
            this.cd.active = false;
            this.node.y = 0;
            delay(1.5).then(async ()=>{
                await this.closeAni();
                args.cb?.();
            })
        }
        this.level.num = args.level;
        
    }
    private showTitle(isWin:boolean){
        this.titleWin.active = isWin;
        this.titleLevel.active = !isWin;
    }
    private showTrumpet(){
        this.trumpet.children.forEach(v=>{
            ActionEffect.scale(v,0.3,1,0,"backOut");
        })
    }
     /**开始动画 */
     async startAni() {
        if(this.isWin){
            super.startAni();
        }else{
            AudioManager.playEffect("darts");
            ActionEffect.fadeIn(this.bg, 0.3);
            this.content.x = -300;
            tween(this.content)
            .to(0.5,{x:0},{easing:"backOut"})
            .start();
        }
    }
}


