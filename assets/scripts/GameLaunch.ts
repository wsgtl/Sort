import './Beach_common/Expand'
import { _decorator, Component, Node } from 'cc';
import { ViewManager } from './Beach_game/manager/ViewManger';
import { GameStorage } from './Beach_game/GameStorage';
import { AudioSource } from 'cc';
import { AudioManager } from './Beach_game/manager/AudioManager';
import { i18n } from './Beach_common/i18n/I18nManager';
import { AudioStorage } from './Beach_common/localStorage/AudioStorage';
import { LangStorage } from './Beach_common/localStorage/LangStorage';
const { ccclass, property } = _decorator;

@ccclass('GameLaunch')
export class GameLaunch extends Component {
    @property(Node)
    mainNode:Node = null;
    @property(Node)
    upper:Node = null;
    @property(Node)
    lower:Node = null;
    @property(Node)
    toper:Node = null;
    @property(AudioSource)
    bgmNode:AudioSource = null;
    private static Instance: GameLaunch = null;

    start(): void {
        ViewManager.setMainSceneNode(this.mainNode,this.upper,this.lower,this.toper);
        ViewManager.showLoading();
    }
    onLoad(): void {
        if (GameLaunch.Instance === null) {
            GameLaunch.Instance = this;
        } else {
            this.destroy();
            return;
        }

        GameStorage.init();
        LangStorage.init();
        AudioManager.setBgmNode(this.bgmNode);
        AudioStorage.init();
        i18n.loadLang();//加载多语言


    }

 


}


