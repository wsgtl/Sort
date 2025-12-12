import { sys } from "cc";

export enum ITEM_STORAGE {
    LANGUAGE = "Xmas_Lang",
    AUDIO = "Xmas_audio",
    EventTrackings = "Xmas_events",
    Game = "Xmas_game",
    GameData = "Xmas_gamedata",
    AbTest = "Xmas_ab_test",
    WebConfig = "Xmas_web_config",
    GameTime = "Xmas_gametime",
}

/**
 * 可以移除的缓存
 */
export enum REMOVE_ITEM_STORAGE {
    ACCOUNT_TOKEN = "account_token",
    USER_HAS_EXIT_GAME = "user_has_exit_game",
}

export namespace BaseStorageNS {
    /**
     * 获取缓存
     * @param itemName
     */
    export function getItem(itemName: ITEM_STORAGE | string): string | null {
        return sys.localStorage.getItem(itemName);
    }

    /**
     * 设置缓存
     * @param itemName
     * @param value
     */
    export function setItem(
        itemName: ITEM_STORAGE | string,
        value: string | number
    ): void {
        sys.localStorage.setItem(itemName, String(value));
    }

    /**
     * 移除缓存
     * @param item
     */
    export function removeLocalStorageItem(item: string) {
        sys.localStorage.removeItem(item);
    }

    /**
     * 批量清楚缓存
     */
    export function clear() { }
}
