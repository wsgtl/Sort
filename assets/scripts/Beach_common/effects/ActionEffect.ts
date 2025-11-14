import { instantiate, Node, Tween, tween, UIOpacity, UITransform, v3, Vec2, Vec3 } from 'cc';
import { UIUtils } from '../utils/UIUtils';
import { awaitTween } from '../utils/TimeUtil';
import BezierCurve from './BezierCurve';
import { Sprite } from 'cc';
import { TweenEasing } from 'cc';

export namespace ActionEffect {

    export enum FlyDirection {
        LEFT,
        RIGHT
    }

    /**
     * 以节点中心为原点，进行比例缩放
     * @param node
     * @param duration
     * @param value
     * @param before
     */
    export function scale(node: Node, duration: number = 0.1, value: number = 1, before: number = -1, easing?: TweenEasing, tag?: number) {
        return new Promise<void>((resolve) => {
            if (before >= 0) {
                node.scale = v3(before, before, before);
            }
            let tw = tween(node);
            if (tag)
                tw = tw.tag(tag);
            tw.to(duration, { scale: v3(value, value, value) }, easing ? { easing: easing } : undefined).call(() => {
                resolve();
            }).start();
        });
    }

    export function scaleBy(node: Node, duration: number = 0.1, value: number = 1) {
        return new Promise<void>((resolve) => {
            tween(node).by(duration, { scale: v3(value, value, value) }).call(() => {
                resolve();
            }).start();
        });
    }

    /**
     * 以节点右边为原点，进行比例缩放
     * @param node
     * @param duration
     * @param value
     */
    export function scaleStayAtRight(node: Node, duration: number = 0.1, value: number = 1) {
        return new Promise<void>((resolve) => {
            const position = v3(node.position);
            if (value !== 1)
                position.x += UIUtils.getWidth(node) / 2 * (1 - value);
            else
                position.x -= UIUtils.getWidth(node) / 2 * (1 - node.scale.x);
            tween(node).to(duration, { scale: v3(value, value, value), position }).call(() => {
                resolve();
            }).start();
        });
    }

    /**
     * 以节点左边为原点，进行比例缩放
     * @param node
     * @param duration
     * @param value
     */
    export function scaleStayAtLeft(node: Node, duration: number = 0.1, value: number = 1) {
        return new Promise<void>((resolve) => {
            const position = v3(node.position);
            if (value !== 1)
                position.x -= UIUtils.getWidth(node) / 2 * (1 - value);
            else
                position.x += UIUtils.getWidth(node) / 2 * (1 - node.scale.x);
            tween(node).to(duration, { scale: v3(value, value, value), position }).call(() => {
                resolve();
            }).start();
        });
    }

    /**
     * 以节点顶部为原点，进行比例缩放
     * @param node
     * @param duration
     * @param value
     */
    export function scaleStayAtTop(node: Node, duration: number = 0.1, value: number = 1) {
        return new Promise<void>((resolve) => {
            const position = v3(node.position);
            if (value !== 1)
                position.y += UIUtils.getHeight(node) / 2 * (1 - value);
            else
                position.y -= UIUtils.getHeight(node) / 2 * (1 - node.scale.x);
            tween(node).to(duration, { scale: v3(value, value, value), position }).call(() => {
                resolve();
            }).start();
        });
    }

    /**
     * 以节点底部为原点，进行比例缩放
     * @param node
     * @param duration
     * @param value
     */
    export function scaleStayAtBottom(node: Node, duration: number = 0.1, value: number = 1) {
        return new Promise<void>((resolve) => {
            const position = v3(node.position);
            if (value !== 1)
                position.y -= UIUtils.getHeight(node) / 2 * (1 - value);
            else
                position.y += UIUtils.getHeight(node) / 2 * (1 - node.scale.x);
            tween(node).to(duration, { scale: v3(value, value, value), position }).call(() => {
                resolve();
            }).start();
        });
    }


    export function alpha(node: Node, duration: number = 0.12, alphaIn: number = 0, before: number = -1) {
        return new Promise<void>((resolve) => {
            const c: UIOpacity = UIUtils.needComponent(node, UIOpacity);
            if (!c) {
                resolve();
                return;
            }
            if (before >= 0) {
                c.opacity = 255 * before;
            }
            const opacity = 255 * alphaIn;
            tween(c)
                .to(duration, { opacity })
                .call(() => {
                    resolve();
                }).start();
        });
    }

    /**
     * 淡入效果
     *
     * @param node
     * @param duration
     */
    export function fadeIn(node: Node, duration: number = 0.12) {
        return alpha(node, duration, 1, 0);
    }

    /**
     * 淡出效果
     * @param node
     * @param duration
     * @param active
     */
    export function fadeOut(node: Node, duration: number = 0.12, active: boolean = false) {
        return alpha(node, duration, 0, 1).then(() => {
            if (node)
                node.active = active;
        });
    }

    export async function moveBy(node: Node, duration: number = 0.12, x: number, y: number = 0) {
        if (node && node.isValid) {
            const pos = v3(node.position);
            await awaitTween(tween(node).by(duration, { position: v3(x, y, 0) }), duration);
            if (node && node.isValid) {
                node.setPosition(pos.x + x, pos.y + y);
            }
        }
    }

    export async function moveFasterBy(node: Node, x: number, y: number = 0, duration: number = 0.25, a: number = 2) {
        if (node && node.isValid) {
            const pos = v3(node.position);
            await awaitTween(tween(node).by(duration, { position: v3(x, y, 0) }, { easing: 'sineOut' }), duration);
            if (node && node.isValid) {
                node.setPosition(pos.x + x, pos.y + y);
            }
        }
    }

    export function moveTo(node: Node, duration: number = 0.12, x: number, y: number) {
        if (!node || !node.isValid) {
            return Promise.resolve();
        }
        return new Promise<void>((resolve) => {
            const position = v3(node.position);
            position.x = x;
            position.y = y;
            tween(node)
                .to(duration, { position })
                .call(() => {
                    resolve();
                }).start();
        });
    }

    export function fingerLoop(node: Node) {
        if (node && node.isValid)
            tween(node).to(0.4, { position: v3(0, 148), scale: v3(1.2, 1.2) }).call(() => {
                if (node && node.isValid)
                    tween(node).to(0.5, { position: v3(0, 74), scale: v3(1, 1) }).call(() => {
                        fingerLoop(node);
                    }).delay(0.2).start();
            }).start();
    }

    export function breathingLight(node: Node, duration: number = 0.6, startTo: number = 0.4, endTo: number = 1, delay: number = 0.4) {
        if (node && node.isValid) {
            const c: UIOpacity = UIUtils.needComponent(node, UIOpacity);
            c.scheduleOnce(() => {
                ActionEffect.alpha(node, duration, startTo).then(() => {
                    if (node && node.isValid) {
                        ActionEffect.alpha(node, duration, endTo).then(() => {
                            breathingLight(node, duration, startTo, endTo, delay);
                        });
                    }
                });
            }, delay);
        }
    }

    export function bezierTo(node: Node, endPoint: Vec3, controlPoint: Vec3, duration: number, uniform: boolean = true, updateCall?: (lt: number, st: number, target: Node) => void) {
        return new Promise<void>((resolve) => {
            if (!node || !node.isValid) {
                resolve();
                return;
            }
            const startPoint = node.position;
            const curve = new BezierCurve(startPoint, endPoint, controlPoint);
            let tw = tween(new Vec3());
            tw.to(duration, { x: 1 }, {
                onUpdate: (target: object, t: number) => {
                    // let pos: Vec2;
                    // // if (uniform) {
                    // //     pos = curve.getUniformPoint(t);
                    // // } else {
                    // pos = curve.getPoint(t);
                    // // }
                    // node.setPosition(v3(pos.x, pos.y));

                    if (!node || !node.isValid) {
                        resolve();
                        tw?.stop();
                        tw = null;
                        return;
                    }
                    const pos: Vec2 = curve.getPoint(t);
                    node.setPosition(v3(pos.x, pos.y));
                    if (updateCall) {
                        const st = curve.invertL(t, curve.getLength());
                        updateCall(t, st, node);
                    }
                },
            }).call(() => {
                resolve();
            }).start();
        });
    }


    export function hitColloid(node: Node, height: number) {
        return new Promise<void>((resolve) => {
            const halfHeight = height / 2;
            tween(node).by(0.1, { scale: v3(0.18, -0.1, 0), position: v3(0, -halfHeight * 0.1) }).call(() => {
                tween(node).by(0.054, { scale: v3(-0.18, 0.25, 0), position: v3(0, halfHeight * 0.25) }).call(() => {
                    tween(node).by(0.066, { scale: v3(0, -0.15, 0), position: v3(0, -halfHeight * 0.15) }).call(() => {
                        resolve();
                    }).start();
                }).start();
            }).start();
        });
    }

    /**
     * 弹簧
     * @param node
     */
    export function spring(node: Node, callback?: Function) {
        if (!node || !node.isValid) {
            if (callback)
                callback();
            return;
        }
        const springMaxY = 20;      // 弹簧在Y轴最大弹跳距离
        const springMaxAngle = 8;   // 弹簧左右摆动最大幅度
        tween(node)
            .by(0.1334, { angle: springMaxAngle, position: v3(0, springMaxY) })
            .by(0.1334, { angle: -springMaxAngle, position: v3(0, -springMaxY) })
            .by(0.0667, { angle: springMaxAngle / 2, position: v3(0, springMaxY / 2) })
            .by(0.1, { angle: -springMaxAngle / 2, position: v3(0, -springMaxY * 3 / 4) })
            .by(0.0334, { position: v3(0, springMaxY / 4) })
            .call(() => {
                if (callback)
                    callback();
            })
            .start();
    }

    /**
     * 弹跳easing
     * @param r 时间进度 0~1
     * @param t 弹跳次数 n
     * @param d 衰减系数 0~1
     */
    export function bounceOut(r: number, t: number = 4, d: number = 0.25) {
        const c = d * 2;
        let p = -1;
        for (let i = 0; i < t; i++) {
            p += Math.pow(c, i) * 2;
        }
        let ns = -1;
        const g = p * p;
        for (let i = 0; i < t; i++) {
            const ls = Math.pow(c, i) * 2;
            ns += ls;
            if (r < (ns / p) || i === t - 1) {
                const d = ns - ls / 2;
                return g * (r -= (d / p)) * r + 1 - (ns - d) * (ns - d);
            }
        }
    }

    export function done(tw: Tween<any>) {
        return new Promise<void>((resolve) => {
            tw.call(resolve).start();
        });
    }
    /**播放图集动画 */
    export function playAni(sp: Sprite, num: number, t: number) {
        return new Promise<void>(res => {
            for (let i = 0; i <= num; i++) {
                sp.scheduleOnce(() => {
                    if (i == num) {
                        sp.node.active = false;
                        res();
                    } else {
                        sp.spriteFrame = sp.spriteAtlas.getSpriteFrame((i + 1).toString());
                    }
                }, t * i)
            }
        })
    }
}