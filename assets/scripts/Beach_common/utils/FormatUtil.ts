export namespace FormatUtil {
    /**秒数转化为00:11这样的格式
     * @param colon 使用图集时，冒号:不能直接给图片取名，这里可以替换成其他字符
     */
    export function mColonS(time: number, colon: string = ":") {
        const minute = Math.floor(time / 60).toString().padStart(2, "0");
        const seconds = Math.floor(time % 60).toString().padStart(2, "0");
        return minute + colon + seconds;
    }

    /**秒数转化为20.113"这样的格式*/
    export function formatMs(time: number) {
        const seconds = Math.floor(time);
        const ms = Math.floor((time - seconds) * 1000).toString().padStart(3, "0");
        return seconds + "." + ms + "”";
    }
    /**将数字改为70.00这种格式 */
    export function toXX_XX(num: number) {
        const formattedNum = num.toFixed(2);
        // 将小数点的"."替换为"_"
        return formattedNum.replace('.', '_');
    }
}