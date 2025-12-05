import './Dress_common/Expand'
import { _decorator, Component, Node } from 'cc';
import { AudioSource } from 'cc';
import { i18n } from './Dress_common/i18n/I18nManager';
import { AudioStorage } from './Dress_common/localStorage/AudioStorage';
import { LangStorage } from './Dress_common/localStorage/LangStorage';
import { EventTracking } from './Dress_common/native/EventTracking';
import { GameStorage } from './Dress_game/GameStorage';
import { AudioManager } from './Dress_game/manager/AudioManager';
import { ViewManager } from './Dress_game/manager/ViewManger';
import { WebManger } from './Dress_game/manager/WebManager';
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

        AudioManager.setBgmNode(this.bgmNode);
        //初始化本地存储
        GameStorage.init();
        LangStorage.init();
        AudioStorage.init();
        WebManger.init();
        EventTracking.init();
        i18n.loadLang();//加载多语言


    }

 


}


