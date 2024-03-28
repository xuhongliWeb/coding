import {initMixin} from './init.js';
function Vue(options) {
    if (!this instanceof Vue) { 
        // Vue是一个构造函数，应该用' new '关键字调用。
        throw new Error('Vue is a constructor and should be called with the `new` keyword');
    }
    this._init(options);
}

initMixin(Vue)
export default Vue;