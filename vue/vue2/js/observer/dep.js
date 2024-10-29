// 把属性和watcher关联起来
// 多对多关系 一个属性有一个dep是用来收集watcher 的
// dep 可以存放多个watcher
// 一个watcher 可以对应多个dep

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
        // dep 和 watcher 是多对多的关系 目的是收集所有依赖 避免重复收集
        Dep.target && Dep.target.addDep(this); // 双向记忆 避免重复收集
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
// 既要收集渲染Watcher 也要收集计算属性的watcher 还有 nextTick watcher 和 watch 等
// 所以改变target 都要放到栈里

Dep.target = null;
const targetStack = []; // 渲染 watcher 计算watcher 等

export function pushTarget(_target) {
    targetStack.push(_target);
    console.log('pushTarget: ', targetStack);
    Dep.target = _target;
}

export function popTarget() {
    targetStack.pop();
    console.log('popTarget: ', targetStack);
    Dep.target = targetStack[targetStack.length - 1];
}

/**
 * 1. 在数据劫持的时候 定义defineProperty 的时候已经给每个属性增加了一个 dep
 * 2. 把渲染watcher 放到 dep.target 属性上 (初始化会创建一个渲染watcher)
 * 3. 开始渲染 mountComponent 方法 调用 get 方法 需要让这个属性的dep 存储当前的watcher
 * 4. 当取值时检查dep.target, 如存在在存入对应watcher,发生变化的时候，让dep通知所有watcher
 */
