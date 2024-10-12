// 一个组件一个实例  用ID 来计数
// exprOrFn vm._update(vm._render())

/**
 *  在数据劫持的时候定义 defineProperty
 */

import { nextTick } from "../utils/index.js";
import { popTarget, pushTarget } from "./dep.js";

let id = 0;

class Watcher {
    constructor(vm, exprOrFn, cb, options) {
        this.vm = vm;
        this.exprOrFn = exprOrFn;
        this.cb = cb;
        this.user = options.user; // 用户 watch
        this.options = options;
        this.deps = []; // watcher 存放 dep
        this.depsId = new Set(); // dep id
        this.id = id++; // watcher id 唯一标识
        if (typeof exprOrFn === "function") {
            this.getter = exprOrFn;
        } else {
            // exprOrFn 是字符串 a.a.a || msg 等情况
            this.getter = function () {
                let path = exprOrFn.split(".");
                let obj = vm;
                for (let i = 0; i < path.length; i++) {
                    obj = obj[path[i]];
                }

                return obj;
            };
        }

        // 默认调用 get 方法, 进行取值将结果保留

        this.value = this.get();
    }

    get() {
        // debugger
        pushTarget(this); // 当前watcher 实例 添加到 Dep.target
        const result = this.getter(); // 调用 getter 方法 渲染页面 render 方法 with(vm){return _c('div',{id:'app'},_v('hello'))}
        popTarget();
        return result;
    }
    run() {
        const newValue = this.get();
        const oldValue = this.value;
        this.value = newValue; // 更新老值
        if (this.user) {
            this.cb.call(this.vm, newValue, oldValue);
        }
    }
    update() {
        // this.get()
        queusWatcher(this);
    }

    addDep(dep) {
        const id = dep.id;
        if (!this.depsId.has(id)) {
            this.deps.push(dep);
            this.depsId.add(id);
            dep.addSub(this);
        }
    }
}

let queus = [];
let has = {};
let pending = false;

function flushSchedulerQueue() {
    // 刷新队列
    queus.forEach((watcher) => {
        watcher.run();
        if (!watcher.user) {
            watcher.cb(); // 触发回调 更新页面
        }
    });
    pending = false;
    queus = [];
    has = {};
}
function queusWatcher(watcher) {
    if (has[watcher.id] === undefined) {
        queus.push(watcher);
        has[watcher.id] = true;
        if (!pending) {
            nextTick(flushSchedulerQueue);
            pending = true;
        }
    }
}
export default Watcher;
