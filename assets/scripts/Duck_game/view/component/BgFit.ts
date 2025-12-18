import { _decorator, Component, Node, view } from 'cc';
import { UIUtils } from '../../../Duck_common/utils/UIUtils';
import { v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BgFit')
export class BgFit extends Component {
    onLoad() {
        const h = view.getVisibleSize().y;
        const bgH = UIUtils.getHeight(this.node);
        if (h > bgH)
            this.node.scale = v3(1,h/bgH);//超过该图片长度才进行缩放
            // UIUtils.setHeight(this.node, h);//超过该图片长度才进行缩放
    }
}

