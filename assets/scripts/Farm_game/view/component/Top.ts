import { _decorator, Component, Node } from 'cc';
import { ConfigConst } from '../../manager/ConfigConstManager';
const { ccclass, property } = _decorator;

@ccclass('Top')
export class Top extends Component {
    @property(Node)
    moneyNode:Node=null;
    @property(Node)
    coinNode:Node=null;

    protected onLoad(): void {
        if(ConfigConst.isShowA){
            this.moneyNode.active = false;
            this.coinNode.x = -240;
        }
    }
}


