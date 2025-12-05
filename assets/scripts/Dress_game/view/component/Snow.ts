import { instantiate } from 'cc';
import { SpriteFrame } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { MathUtil } from '../../../Dress_common/utils/MathUtil';
import { tweenPromise } from '../../../Dress_common/utils/TimeUtil';
import { isVaild } from '../../../Dress_common/utils/ViewUtil';
import { Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Snow')
/**雪花飘落动画 */
export class Snow extends Component {
    @property(Node)
    snow: Node = null;
    @property([SpriteFrame])
    sp: SpriteFrame[] = [];

    protected onLoad(): void {
        for (let i = 0; i < 6; i++) {
            this.createSnow(MathUtil.random(-800, 300));
        }
    }
    private t=0;
    protected update(dt: number): void {
        this.t+=dt;
        if(this.t>0.7){
            this.t = 0;
            this.createSnow(100);
        }
    }
    createSnow(y: number) {
        const s = instantiate(this.snow);
        s.active = true;
        if(MathUtil.probability(0.6))s.getComponent(Sprite).spriteFrame = this.sp.getRandomItem();
        this.node.addChild(s);
        s.x = MathUtil.random(-500, 500);
        s.y = y;
        const time = MathUtil.random(5, 10);
        const mx = MathUtil.random(-1,1)*MathUtil.random(0,500);
        tweenPromise(s, t => t
            .by(time, { y: MathUtil.random(-3000, -2400),x: mx,angle: MathUtil.randomOne() * MathUtil.random(100, 1000) })
            .call(() => {
                if (isVaild(s)) {
                    s.destroy()
                }
            }))
    }
}


