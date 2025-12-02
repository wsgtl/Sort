import { _decorator, Component, Node } from 'cc';
import { TipsAni } from './TipsAni';
import { SpriteFrame } from 'cc';
import { Sprite } from 'cc';
import { ActionEffect } from '../../../Beach_common/effects/ActionEffect';
import { Tween } from 'cc';
import { i18n } from '../../../Beach_common/i18n/I18nManager';
import { sprites } from '../../../Beach_common/recycle/AssetUtils';
const { ccclass, property } = _decorator;

@ccclass('DialogBox')
export class DialogBox extends Component {
    @property(TipsAni)
    tips:TipsAni = null;

    init(strIndex:number){
        sprites.setTo(this.tips.node, i18n.curLangPath("str_guide"+(strIndex)));
        this.tips.init();
        this.tips.stopAni();
        Tween.stopAllByTarget(this.node);
    }
    async ani(){
        await ActionEffect.scale(this.node,0.4,1,0,"backOut");
        this.tips.startAni();
    }
}


