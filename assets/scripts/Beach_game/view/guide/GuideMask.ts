import { _decorator, Component, Node } from 'cc';
import ViewComponent from '../../../Beach_common/ui/ViewComponent';
import { DialogBox } from './DialogBox';
import { Hand } from './Hand';
import { Colletion } from '../component/Colletion';
import { GameManger } from '../../manager/GameManager';
import { ActionEffect } from '../../../Beach_common/effects/ActionEffect';
import { UIUtils } from '../../../Beach_common/utils/UIUtils';
import { isVaild } from '../../../Beach_common/utils/ViewUtil';
import { Vec3 } from 'cc';
import { Money } from '../component/Money';
import { Button } from 'cc';
import { GuideManger } from '../../manager/GuideManager';
const { ccclass, property } = _decorator;

@ccclass('GuideMask')
export class GuideMask extends ViewComponent {
    @property(DialogBox)
    db: DialogBox = null;
    @property(Hand)
    hand: Hand = null;
    @property(Hand)
    bw: Hand = null;
    @property(Node)
    content: Node = null;
    @property(Node)
    mask: Node = null;
    show(parent: Node, args?: any): void {
        parent.addChild(this.node);
    }

    showMask() {
        this.mask.active = true;
        ActionEffect.fadeIn(this.mask, 0.3);
    }
    showTips(strIndex: number) {
        this.db.node.active = true;
        this.db.init(strIndex);
        this.db.ani();
    }

    showCollect(co: Colletion, next: Function) {
        co.changeParent(this.content);
        this.hand.node.active = true;
        this.hand.node.position = co.node.position.clone();
        this.hand.play(true, false);
        this.db.node.y = co.node.y + 150;
        co.node.once(Node.EventType.TOUCH_START, () => {
            GameManger.instance.moveToCell(co);
            this.bw.node.active = false;
            next();
        })
    }
    private cc: Node;
    private ccParent: Node;
    private ccPos: Vec3;
    private ccIndex: number;
    showCellContent(cc: Node) {
        this.ccPos = cc.position.clone();
        this.cc = cc;
        this.ccParent = cc.parent;
        this.ccIndex = cc.getSiblingIndex();
        UIUtils.changeParent(cc, this.content);
        this.bw.node.active = true;
        this.bw.node.y = cc.y;
        this.bw.node.x = -260;
        this.bw.play(false, true);
    }
    ccBack() {
        if (isVaild(this.cc) && isVaild(this.ccParent)) {
            this.cc.position = this.ccPos;
            this.ccParent.insertChild(this.cc, this.ccIndex);
        }
    }

    private mn: Node;
    private mnParent: Node;
    private mnPos: Vec3;
    private mnIndex: number;
    showMoneyNode(mn: Node) {
        this.mnPos = mn.position.clone();
        this.mn = mn;
        this.mnParent = mn.parent;
        this.mnIndex = mn.getSiblingIndex();
        UIUtils.changeParent(mn, this.content);
        mn.getComponent(Money).btnGet.once(Button.EventType.CLICK, () => {
            this.mnBack();
            this.node.destroy();
            GuideManger.passGameStep();
        })

        this.hand.node.active = true;
        this.hand.node.y = mn.position.y;
        this.hand.node.x = -30;
        this.hand.play(true, false);
        this.db.node.y = mn.y - 250;
    }
    mnBack() {
        if (isVaild(this.mn) && isVaild(this.mnParent)) {
            this.mn.position = this.mnPos;
            this.mnParent.insertChild(this.mn, this.mnIndex);
        }
    }
    hideHand(){
        this.hand.node.active = false;
    }
    hideAll() {
        this.node.active = false;
        this.db.node.active = false;
        this.hand.node.active = false;
    }
    

}


