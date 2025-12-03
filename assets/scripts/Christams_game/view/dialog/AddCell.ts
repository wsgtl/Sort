import { _decorator, Component, Node } from 'cc';
import { Button } from 'cc';
import { ViewManager } from '../../manager/ViewManger';
import { GameStorage } from '../../GameStorage';
import { adHelper } from '../../../Christams_common/native/AdHelper';
import { DialogComponent } from '../../../Christams_common/ui/DialogComtnet';
const { ccclass, property } = _decorator;

@ccclass('AddCell')
export class AddCell extends DialogComponent {
    @property(Node)
    btnFree:Node =null;

    private cb:Function;
    show(parent: Node, args?: any): void {
        parent.addChild(this.node);
        this.cb = args.cb;
    }
    onLoad(){
        this.btnFree.on(Button.EventType.CLICK,this.onBtnFree,this);
    }
    onBtnFree(){
        this.btnFree.getComponent(Button).interactable = false;
        adHelper.showRewardVideo("增加拓展位",()=>{
            GameStorage.setCellUnlock(GameStorage.getCurLevel());
            this.closeAni();
            this.cb?.();
        },()=>{
            ViewManager.adNotReady();
            this.btnFree.getComponent(Button).interactable = true;
        })
    }
}


