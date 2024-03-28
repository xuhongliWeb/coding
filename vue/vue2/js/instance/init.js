

import { initLifecycle } from "./liftcycle.js";
import { initState } from "./state.js";
let uid = 0;
export function initMixin(Vue) {
    // 原型上添加 _init 方法
    Vue.prototype._init = function (options) {

        const vm = this;

        vm._uid = uid++;

        // 将 options 挂载到 vm 上

        vm.$options = options; // TODO 合并配置 

        // 初始化生命周期 $parent children refs root 等

        initLifecycle(vm);

        // 初始化数据状态

        // 1. data 生成响应式状态，对应的 dep对象
        // 2. watch 生成和watcher 对应， 并于数据data 的 dep 产生依赖关系
        // 3. computed 生成 getter setter 生成一个watcher ， 但不执行， 返回一个闭包
        // 4.methods 对象，生成闭包，先不执行
        initState(vm);
    }
 
}