import { Button } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { ViewManager } from '../../manager/ViewManger';
import ViewComponent from '../../../Christams_common/ui/ViewComponent';
import { ButtonLock } from '../../../Christams_common/Decorator';
import { NativeFun } from '../../../Christams_common/native/NativeFun';
const { ccclass, property } = _decorator;

@ccclass('Home')
export class Home extends ViewComponent {
    @property(Node)
    btnStart: Node = null;
    @property(Node)
    dialogNode: Node = null;
    @property(Node)
    upDialogNode: Node = null;
    @property(Node)
    btnSignin: Node = null;
    @property(Node)
    btnCash: Node = null;
    @property(Node)
    btnTask: Node = null;
    @property(Node)
    btnH5: Node = null;

    show(parent: Node, args?: any) {
        parent.addChild(this.node);

        // adHelper.init();
        ViewManager.setDialogNode(this.dialogNode);
        ViewManager.setUpDialogNode(this.upDialogNode);
    }
    onLoad() {
        this.btnStart.on(Button.EventType.CLICK, this.onStart,this);
        this.btnSignin.on(Button.EventType.CLICK, this.onSignin, this);
        this.btnH5.on(Button.EventType.CLICK, this.onH5, this);

        this.initReddot();
    }
    @ButtonLock(1)
    onStart(){
        ViewManager.showGameView()
    }
    onSignin() {
        ViewManager.showDaily(this.upDialogNode);
    }

    onH5() {
        NativeFun.showH5Game();
    }
    /**初始化红点显示 */
    initReddot() {
        // const signinDot = this.btnSignin.getChildByName("reddot");
        // const taskDot = this.btnTask.getChildByName("icon").getChildByName("reddot");
        // ReddotManager.instance.init(signinDot, taskDot);
        // const dailyShow = ReddotManager.instance.showSigninDot();
        // ReddotManager.instance.showTaskDot();
        // if (dailyShow && !GameUtil.Daily.isShow && !GuideManger.isGuide()) {//每日签到登陆弹一次
        //     this.onSignin();
        //     GameUtil.Daily.isShow = true;
        // }
    }
}


