import { nextTick, noop } from "../utils/index.js";
import { observe } from "../observer/index.js";
import Watcher from "../observer/watcher.js";

const sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop,
};

/**
 * 把data 上的属性挂载到实例上
 *
 * @param {*} target
 * @param {*} sourceKey
 * @param {*} key
 */
function proxy(target, sourceKey, key) {
    sharedPropertyDefinition.get = function proxyGetter() {
        return this[sourceKey][key];
    };
    sharedPropertyDefinition.set = function proxySetter(val) {
        this[sourceKey][key] = val;
    };

    Object.defineProperty(target, key, sharedPropertyDefinition);
}
export function initState(vm) {
    const opts = vm.$options;
    // 初始化方法
    if (opts.methods) {
        initMethods(vm, opts.methods);
    }

    // 初始化数据
    // 建立data 数据的响应式
    if (opts.data) {
        initData(vm);
    }

    // watch

    if (opts.watch) {
        initWatch(vm, opts.watch);
    }
}

// 初始化方法

function initMethods(vm, methods) {
    for (var key in methods) {
        vm[key] = methods[key] == null ? noop : bind(methods[key], vm);
    }
}

// 初始化 data

function initData(vm) {
    let data = vm.$options.data;
    // 数据保存在 _data 中
    data = vm._data = typeof data === "function" ? data.call(vm) : data;
    // 响应式

    let keys = Object.keys(data);
    let i = keys.length;
    // 访问 this.msg 时 等同于 访问 this._data.msg
    while (i--) {
        proxy(vm, "_data", keys[i]);
    }
    observe(data);
}

// 初始化用户nextTick 的回调

export function stateMixin(vm) {
    vm.prototype.$nextTick = function (cb) {
        return nextTick(cb);
    };

    vm.prototype.$watch = function (exprOrFn, cb, options) {
        let watcher = new Watcher(this, exprOrFn, cb, {
            user: true,
            ...options,
        });

        if (options.immediate) {
            cb();
        }
    };
}

function initWatch(vm, watch) {
    for (let key in watch) {
        const handler = watch[key];
        if (Array.isArray(watch[key])) {
            handler.forEach((handler) => createWatcher(vm, key, handler));
        } else {
            createWatcher(vm, key, handler); // 字符串、 对象、 函数
        }
    }
}

/**
 * watch 也是一个watcher 会默认存一个老值，每次更新数据会再去拿到一个新值， 对比传入的回调，判断是否更新 触发回调， 取值之前， 会把用户watcher 存起来
 * @param {*} vm 
 * @param {*} key 字符串或Fn
 * @param {*} handler 
 * @returns 
 */
function createWatcher(vm, key, handler) {
    
    let options;
    // 'msg': vm的methods中的方法
    if (typeof handler === "string") {
        handler = vm[handler];
    }
    if (typeof handler === "object") {
        options = handler;
        handler = handler.handler;
    }
    return vm.$watch(key, handler,options);
}