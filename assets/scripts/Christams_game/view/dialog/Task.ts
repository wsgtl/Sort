import { _decorator, Component, Node } from 'cc';
import { GameStorage } from '../../GameStorage';
import { instantiate } from 'cc';
import { TaskItem } from '../component/TaskItem';
import { Prefab } from 'cc';
import { GameUtil } from '../../GameUtil';
import { DialogComponent } from '../../../Christams_common/ui/DialogComtnet';
const { ccclass, property } = _decorator;

@ccclass('Task')
export class Task extends DialogComponent {
    @property(Node)
    viewNode: Node = null;
    @property(Prefab)
    item: Prefab = null;
    @property(Node)
    content: Node = null;
    @property(Node)
    taskContent: Node = null;
    protected onLoad(): void {
        // const h = view.getVisibleSize().y;
        // const cha = h - 1138;
        // UIUtils.setHeight(this.viewNode, cha + 750);
        this.initItems();
    }

    private initItems() {
        const tasks = GameStorage.getTask();
        const minutes = GameUtil.getCurMinutes();
        const tm = GameUtil.TaskMinutes;
        tm.forEach((v, i) => {
            if (tasks[i] == 1) return;
            const item = instantiate(this.item);
            this.taskContent.addChild(item);
            item.getComponent(TaskItem).init(i, minutes, v <= minutes);
        })
    }

}


