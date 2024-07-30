
import { query,getOuterHTML } from '../utils/index.js';
import {initMixin} from './init.js';
import { compileToFunctions } from '../compiler/index.js';
import { liftcycleMixin } from './liftcycle.js';
import { renderMixin } from '../vdom/index.js';
import { initGlobalApi } from '../global-api/index.js';
function Vue(options) {
    if (!this instanceof Vue) { 
        // Vue是一个构造函数，应该用' new '关键字调用。
        throw new Error('Vue is a constructor and should be called with the `new` keyword');
    }
    this._init(options);
}

initMixin(Vue)
liftcycleMixin(Vue) // 绑定 _update 等
renderMixin(Vue) // 绑定 _render 方法

// 静态方法 vue.component vue.directive vue.extend vue.mixin ...

initGlobalApi(Vue)


export default Vue;