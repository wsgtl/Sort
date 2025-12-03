import { Button } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { SettingManger } from '../../manager/SettingManger';
import { ButtonLock } from '../../../Christams_common/Decorator';
const { ccclass, property } = _decorator;

@ccclass('Setting')
export class Setting extends Component {
    protected onLoad(): void {
        
        this.node.on(Button.EventType.CLICK,this.click,this);
    }
    @ButtonLock(1)
    click(){
        SettingManger.instance.showDialog();
    }
}


