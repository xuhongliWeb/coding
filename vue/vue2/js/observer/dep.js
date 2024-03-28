import { remove } from "../utils/index.js";

let uid = 0;

export default class Dep {
    constructor() {
        this.id = uid++;
        this.subs = [];
    }

    // 添加一个观察者
    /**
     *
     * @param {Watcher} sub
     */

    addSub(sub) {
        this.subs.push(sub);
    }

    // 移除一个观察者
    /**
     *
     * @param {Watcher} sub
     */
    removeSub(sub) {
        remove(this.subs, sub);
    }
    // 依赖收集 当存在 Dep.target 的时候，将 Dep.target 添加到 subs 中
    depend() {
        if (Dep.target) {
            Dep.target.addDep(this);
        }
    }

    // 通知所有订阅者
    notify() {
        const subs = this.subs.slice();
        // 变量 l 的好处是 1.性能方面， 不用每次都计算subs.length, 2. 代码可读性
        for (let i = 0, l = subs.length; i < l; i++) {
            subs[i].update();
        }
    }
}

Dep.target = null;
const targetStack = [];

export function pushTarget(_target) {
    if (Dep.target) {
        targetStack.push(Dep.target);
    }

    Dep.target = _target;
}



/*将观察者实例从target栈中取出并设置给Dep.target*/
export function popTarget () {
    Dep.target = targetStack.pop()
  }