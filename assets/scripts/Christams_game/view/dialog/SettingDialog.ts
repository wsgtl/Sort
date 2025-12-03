import { _decorator, Component, Node } from 'cc';
import { SettingManger } from '../../manager/SettingManger';
import { ViewManager, ViewType } from '../../manager/ViewManger';
import { Button } from 'cc';
import { AudioManager } from '../../manager/AudioManager';
import { Label } from 'cc';
import { ConfigConst } from '../../manager/ConfigConstManager';
import { NativeFun } from '../../../Christams_common/native/NativeFun';
import { DialogComponent } from '../../../Christams_common/ui/DialogComtnet';
import { GameManger } from '../../manager/GameManager';
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
    @property(Node)
    btnRestart: Node = null;
    @property(Label)
    Id: Label = null;
    protected onLoad(): void {
        SettingManger.instance.setDialog(this.node);
        this.btnMusic.on(Button.EventType.CLICK, this.onBtnMusic, this);
        this.btnPrivacy.on(Button.EventType.CLICK, this.onBtnPrivacy, this);
        this.btnSound.on(Button.EventType.CLICK, this.onBtnSound, this);
        this.btnVibration.on(Button.EventType.CLICK, this.onBtnVibration, this);
        this.btnRestart.on(Button.EventType.CLICK, this.onBtnRestart, this);
        // this.btnLang.on(Button.EventType.CLICK, this.onBtnLang, this);
        this.showMute(this.btnMusic, AudioManager.getIsPlayBGM());
        this.showMute(this.btnSound, AudioManager.getIsPlay());
        this.showMute(this.btnVibration, AudioManager.getIsShock());
        this.Id.string = "ID:" + ConfigConst.getId();
    }
    onBtnHome() {
        ViewManager.showHome();
    }
    onBtnPrivacy() {//跳转隐私协议
        NativeFun.jumpWeb("https://sites.google.com/view/jjioui39881jxcfhjhdjfcxweueeee/home");

    }
    onBtnMusic() {
        const mute = !AudioManager.getIsPlayBGM();
        AudioManager.setIsPlayBGM(mute);
        mute ? AudioManager.resumeBgm() : AudioManager.pauseBgm();
        this.showMute(this.btnMusic, mute);
    }
    onBtnSound() {
        AudioManager.setIsPlay(!AudioManager.getIsPlay());
        this.showMute(this.btnSound, AudioManager.getIsPlay());
    }
    onBtnVibration() {
        AudioManager.setIsShock(!AudioManager.getIsShock());
        this.showMute(this.btnVibration, AudioManager.getIsShock());
    }
    onBtnRestart() {
        if (this.isAni) return;
        GameManger.instance.replay();
        this.closeAni();
    }
    onBtnLang() {
        this.node.active = false;
        ViewManager.showLangSettings(() => { this.node.active = true; })
    }
    private showMute(node: Node, isHide: boolean) {
        node.getChildByName("close").active = !isHide;
    }
    protected onDestroy(): void {
        SettingManger.instance.setDialog(null);
    }

}


