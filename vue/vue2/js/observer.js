import Dep from "./dep.js";
import { def, hasOwn, isObject, isPlainObject } from "./utils.js";



const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto);
const arrayKeys = Object.getOwnPropertyNames(arrayMethods)
export class Observer {
    constructor(value) {
        console.log('Observer',value);
        this.dep = new Dep();
        this.vmCount = 0;
        //  将 Observer 的实例保存到 data 的 __ob__ 属性上， 用于 observer 的时候检测
        def(value, "__ob__", this);
        if (Array.isArray(value)) {
            console.log('数组');
            // 重写数组方法
            protoAugment(value, arrayMethods,arrayKeys);
        }else {
            this.walk(value);
        }
    }
    walk(data) {
        let keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
            defineReactive(data, keys[i], data[keys[i]]);
        }
    }
}

// 给每个数据上定义属性
function defineReactive(data, key, val) {
    // 保存一下 this
    const self = this;
    // 创建 Dep 对象
    let dep = new Dep();

    Object.defineProperty(data, key, {
        // 可枚举
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
            // 依赖收集
            // 在获取值的时候， 如果有watcher 的依赖，则将这个依赖添加到dep中
            if (Dep.target) {
                dep.addSub(Dep.target);
            }
            return val;
        },
        set: function reactiveSetter(newVal) {
            if (newVal === val) {
                return;
            }
            val = newVal;
            // 赋值的话如果是newValue是对象，对象里面的属性也应该设置为响应式的
            self.walk(newValue);
            // 触发通知 更新视图
            dep.notify();
        },
    });
}
export function observe(value, asRootData) {
    // 判断是否是对象
    if (!isObject(value)) {
        return;
    }

    let ob;

    // 对象上是否有__ob__属性
    if (hasOwn(value, "__ob__")) {
        console.log("对象上是否有__ob__属性", value);
    } else if (Array.isArray(value) || isPlainObject(value)) {
        ob = new Observer(value);
    }
    if (asRootData && ob) {
        ob.vmCount++;
    }
    return ob; // 创建一个观察者对象
}
