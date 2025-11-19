import { _decorator, Component, Node } from 'cc';
import { SettingManger } from '../../manager/SettingManger';
import { ViewManager, ViewType } from '../../manager/ViewManger';
import { Button } from 'cc';
import { AudioManager } from '../../manager/AudioManager';
import { native } from 'cc';
import { sys } from 'cc';
import { NativeFun } from '../../../Beach_common/native/NativeFun';
import { DialogComponent } from '../../../Beach_common/ui/DialogComtnet';
const { ccclass, property } = _decorator;

@ccclass('SettingDialog')
export class SettingDialog extends DialogComponent {
    @property(Node)
    btnPrivacy: Node = null;
    @property(Node)
    btnMusic: Node = null;
    @property(Node)
    btnSound: Node = null;
    @property(Node)
    btnVibration: Node = null;
    @property(Node)
    btnLang: Node = null;
    protected onLoad(): void {
        SettingManger.instance.setDialog(this.node);
        this.btnMusic.on(Button.EventType.CLICK, this.onBtnMusic, this);
        this.btnPrivacy.on(Button.EventType.CLICK, this.onBtnPrivacy, this);
        this.btnSound.on(Button.EventType.CLICK, this.onBtnSound, this);
        this.btnVibration.on(Button.EventType.CLICK, this.onBtnVibration, this);
        // this.btnLang.on(Button.EventType.CLICK, this.onBtnLang, this);
        this.showMute(this.btnMusic, AudioManager.getIsPlayBGM());
        this.showMute(this.btnSound, AudioManager.getIsPlay());
        this.showMute(this.btnVibration, AudioManager.getIsShock());
    }
    onBtnHome() {
        ViewManager.showHome();
    }
    onBtnPrivacy() {//跳转隐私协议
        NativeFun.jumpWeb("https://sites.google.com/view/dkkfdkciuviuciviousii928907887/home");
        
    }
    onBtnMusic() {
        const mute = !AudioManager.getIsPlayBGM();
        AudioManager.setIsPlayBGM(mute);
        mute ? AudioManager.pauseBgm() : AudioManager.resumeBgm();
        this.showMute(this.btnMusic, mute);
    }
    onBtnSound() {
    AudioManager.setIsPlay(!AudioManager.getIsPlay());
        this.showMute(this.btnSound, AudioManager.getIsPlay());
    }
    onBtnVibration() {
        AudioManager.setIsPlay(!AudioManager.getIsPlay());
        this.showMute(this.btnVibration, AudioManager.getIsPlay());
    }
    onBtnLang(){
        this.node.active = false;
        ViewManager.showLangSettings(()=>{this.node.active = true;})
    }
    private showMute(node: Node, isHide: boolean) {
        node.getChildByName("close").active = !isHide;
    }
    protected onDestroy(): void {
        SettingManger.instance.setDialog(null);
    }

}


