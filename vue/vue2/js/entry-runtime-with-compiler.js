// 运行时 $mount


import Vue from './runtime/index.js'

Vue.prototype.$moont = function (el) {
    console.log('mount')
}
