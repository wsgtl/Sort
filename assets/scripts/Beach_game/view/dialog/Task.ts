import { _decorator, Component, Node } from 'cc';
import ViewComponent from '../../../Beach_common/ui/ViewComponent';
import { view } from 'cc';
import { UIUtils } from '../../../Beach_common/utils/UIUtils';
import { GameStorage } from '../../GameStorage';
import { instantiate } from 'cc';
import { TaskItem } from '../component/TaskItem';
import { Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Task')
export class Task extends ViewComponent {
    @property(Node)
    viewNode: Node = null;
    @property(Prefab)
    item: Prefab = null;
    @property(Node)
    content: Node = null;

    protected start(): void {
        const h = view.getVisibleSize().y;
        const cha = h - 1138;
        UIUtils.setHeight(this.viewNode, cha + 750);
        this.initItems();
    }
    private initItems() {
        const tasks = GameStorage.getTask();
        const curLevel = GameStorage.getCurLevel();
        for (let i = 0; i < 10; i++) {
            const item = instantiate(this.item);
            this.content.addChild(item);
            const level: number = i + 1;
            item.getComponent(TaskItem).init(level, curLevel, tasks[level]);
        }
    }

}


