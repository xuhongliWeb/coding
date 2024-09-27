import Watcher from "../observer/watcher.js";
import { path } from "../vdom/patch.js";

export function liftcycleMixin(Vue) {
    // 创建 update 函数
    Vue.prototype._update = function (vnode) {
     const vm = this;

    vm.$el = path(vm.$el, vnode);
    };
}

export function mountComponent(vm, el) {
    // 调用render 方法渲染 el 属性
    // debugger
    // 先调用render 方法创建出的 vnode 虚拟节点， 再将虚拟节点渲染到页面上
    callHook(vm, 'beforeMount')

    const updateComponent = () => {
        vm._update(vm._render());
    };
    let watcher = new Watcher(vm,updateComponent, () => {
        // console.log('更新视图');
        callHook(vm, 'beforeUpdate')
    }, true);
   

}

export function initLifecycle(vm) {
    const options = vm.$options;

    vm.$parent = parent;
    vm.$root = parent ? parent.$root : vm;

    vm.$children = [];
    vm.$refs = {};

    vm._watcher = null;
    vm._inactive = null;
    vm._directInactive = false;
    vm._isMounted = false;
    vm._isDestroyed = false;
    vm._isBeingDestroyed = false;
}



export function callHook(vm, hook) {
    const handlers = vm.$options[hook] // created:[fn1,fn2]  {created: Array(3), }
    if (handlers) {
        for (let i = 0; i < handlers.length; i++) {
            handlers[i].call(vm); // 更改this指向
        }
    }
}