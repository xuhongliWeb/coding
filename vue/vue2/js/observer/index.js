// 针对数据进行观察
// 遍历每个需要观察的对象，并将其转换为响应式数据

import { hasOwn, isObject, isPlainObject, def } from "../utils/index.js";
import Dep from "./dep.js";
import { arrayMethods } from "./array.js";
const arrayKeys = Object.getOwnPropertyNames(arrayMethods);
class Observer {
    constructor(value) {
        this.dep = new Dep();
        this.vmCount = 0;
        //  将 Observer 的实例保存到 data 的 __ob__ 属性上， 用于 observer 的时候检测
        def(value, "__ob__", this);
        // defineReactive childOb 递归 进数组这里
        if (Array.isArray(value)) {
            // 增强、重写数组方法
            protoAugment(value, arrayMethods, arrayKeys);

            /*如果是数组则需要遍历数组的每一个成员进行observe*/
            this.observeArray(value);
        } else {
            this.walk(value);
        }
    }

    // 绑定数据
    walk(data) {
        let keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let val = data[key];
            defineReactive(data, key, val);
        }
    }
// 对数组的没个成员进行绑定
    observeArray(items) {
        for (let i = 0, l = items.length; i < l; i++) {
            observe(items[i]);
        }
    }
}

// 直接覆盖原型的方法来修改目标对象

function protoAugment(target, src) {
    target.__proto__ = src;
}


export function observe(value, assRootData) {
    if (!isObject(value)) {
        return;
    }

    let ob;

    // 检测是否已经进行过绑定

    if (hasOwn(value, "__ob__")) {
    } else if (Array.isArray(value) || isPlainObject(value)) {
        ob = new Observer(value);
    }

    if (assRootData && ob) {
        ob.vmCount++;
    }

    return ob;
}

// 给每个数据对象上定义属性
// 每个属性都有dep
export function defineReactive(obj, key, val) {
    let dep = new Dep();

    // 如果子元素是数组， 或 object 则进行观察
    let childOb = observe(val);
    // 获取 defineProperty 的 getter 和 setter
    // getOwnPropertyDescriptor 返回接存在于对象上而不在对象的原型链中的属性
    let property = Object.getOwnPropertyDescriptor(obj, key);

    const getter = property && property.get;
    const setter = property && property.set;

    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
            // 如果原本有 geeter 方法则执行
            const value = getter ? getter.call(obj) : val;
            // 进行依赖收集
            // 获取值的时候 有 watcher 依赖 把 watcher 对象加入到data 的 dep 中
            if (Dep.target) {
                dep.depend();
            }
            // 如果有子元素，则进行依赖收集
            if (childOb) {
                childOb.dep.depend();
            }
            return value;
        },
        set: function reactiveSetter(newVal) {
            // 通过getter 方法获取当前值, 与新值比较， 一致则不必执行操作

            const value = getter ? getter.call(obj) : val;

            if (newVal === value) {
                return;
            }
            if (setter) {
                /*如果原本对象拥有setter方法则执行setter*/
                setter.call(obj, newVal);
            } else {
                val = newVal;
            }

            /*dep对象通知所有的观察者*/
            dep.notify();
        },
    });
}
