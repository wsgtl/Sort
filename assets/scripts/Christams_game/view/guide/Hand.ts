import { _decorator, Component, Node } from 'cc';
import { Sprite } from 'cc';
import { Animation } from 'cc';
import { Tween } from 'cc';
import { ActionEffect } from '../../../Christams_common/effects/ActionEffect';
import { delay } from '../../../Christams_common/utils/TimeUtil';
import { isVaild } from '../../../Christams_common/utils/ViewUtil';
const { ccclass, property } = _decorator;

@ccclass('Hand')
export class Hand extends Component {
    @property(Node)
    hand:Node = null;
    @property(Node)
    bw:Node = null;
    @property(Animation)
    ani:Animation = null;

    onLoad(){
        this.hand.active = false;
        this.bw.active = false;
    }
    play(handShow:boolean,bwShow:boolean){
        Tween.stopAllByTarget(this.node);
        this.hand.active = handShow;
        // this.bw.active = bwShow;
        this.startAni(handShow,bwShow);
    }
    async startAni(handShow:boolean,bwShow:boolean){
        if(!isVaild(this))return;
        if(handShow){
            this.ani.play();
            await delay(0.5,this.node);
            if(!isVaild(this))return;
        }
        if(bwShow){
            this.bw.active = bwShow;
            await ActionEffect.playAni(this.bw.getComponent(Sprite),4,0.07);
        }
        await delay(0.4,this.node);
        this.startAni(handShow,bwShow);
    }
}


