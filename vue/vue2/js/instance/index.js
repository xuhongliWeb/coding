
import { query,getOuterHTML } from '../utils/index.js';
import {initMixin} from './init.js';
import { compile,compileToFunctions } from '../compiler/index.js';
function Vue(options) {
    if (!this instanceof Vue) { 
        // Vue是一个构造函数，应该用' new '关键字调用。
        throw new Error('Vue is a constructor and should be called with the `new` keyword');
    }
    this._init(options);
}

// vue1的时候采用模板引擎，也就是每次数据发生改变，就把整个模板（template）进行替换。

// vue2 引入了虚拟dom , 每一次数据更新， 会比较虚拟dom 的差异，然后更新有差异的部分。 核心方法就是将template变成js ast，然后将js 转换为虚拟dom

// 在vue 被挂载的时候， 会检测是否有render 方法，如果有，就直接使用render方法，如果没有，就使用template，在检测template，如果template没有，就使用el，最后complilToFunction 把模板转化成render方法（1.template -> 2.ast -> 3.render 返回的结果就是虚拟dom）, 最终都是要把模板变成render 方法

// 将 template 转换为ast 语法树 的过程是比较复杂的，需要利用正则来判断标签的开始和结束以及文本内容，利用栈来判断是谁的爸爸，谁是谁的儿子， 最后构建ast 树

// 然后将ast 树转换为render 函数， 字符拼接， 字符串变函数

// 调用render 函数，得到vnode 虚拟dom, 根据虚拟dom 生成真实dom,插入到el 元素中

Vue.prototype.$mount = function (el) {
    el =el && query(el)

    let options = this.$options;
    let template = getOuterHTML(el)

    compile(template, {})
    // 把模板的template =》=>ast => render= 渲染到页面
    //  * compileToFunctions => compile => baseCompile



}

console.log('Vue',Vue.prototype)
initMixin(Vue)

export default Vue;