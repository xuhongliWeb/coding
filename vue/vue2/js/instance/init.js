

import { initLifecycle } from "./liftcycle.js";
import { initState } from "./state.js";
import { query,getOuterHTML } from "../utils/index.js";
import { compileToFunctions } from "../compiler/index.js";
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

        // 挂载组件，带模板编译

        if (vm.$options.el) {
            vm.$mount(vm.$options.el);
        }

    }
 
    // 挂载$mount

    /**
     * vue1的时候采用模板引擎，也就是每次数据发生改变，就把整个模板（template）进行替换。
     * vue2 引入了虚拟dom , 每一次数据更新， 会比较虚拟dom 的差异，然后更新有差异的部分。 核心方法就是将template变成js ast，然后将js 转换为虚拟dom
     * 
     * 在vue 被挂载的时候， 会检测是否有render 方法，如果有，就直接使用render方法，如果没有，就使用template，在检测template，如果template没有，就使用el，最后complilToFunction 把模板转化成render方法（1.template -> 2.ast -> 3.render 返回的结果就是虚拟dom）, 最终都是要把模板变成render 方法
     * 
     * 将 template 转换为ast 语法树 的过程是比较复杂的，需要利用正则来判断标签的开始和结束以及文本内容，利用栈来判断是谁的爸爸，谁是谁的儿子， 最后构建ast 树
     * 然后将ast 树转换为render 函数， 字符拼接， 字符串变函数
     * 调用render 函数，得到vnode 虚拟dom, 根据虚拟dom 生成真实dom,插入到el 元素中
     */


    Vue.prototype.$mount = function (el) {
        console.log(el,'mount')
        // 挂载操作

        const vm = this

        const options = vm.$options

        el = query(el)

        // 判断选项中是否传入 render 方法

        if (!options.render) {
            // 没render 将 template 转换为 render 方法
            let template = options.template;

            if (!template && el) {
                template = getOuterHTML(el);
            }

            // 转 render

            const render = compileToFunctions(template);
        }
        // 有 render 


    }
}