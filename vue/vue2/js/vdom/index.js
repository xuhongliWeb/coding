export function renderMixin(Vue) {

    Vue.prototype._c = function (options) { // 创建虚拟dom 元素
        return createElement(...arguments)
    }

    Vue.prototype._s = function (val) { // 将数据变成字符串 函数会被调用来确保插值的内容是一个字符串。例如，如果插值的内容是一个数字或对象，_s 会将它们转换为字符串形式。
        return val === null ? '': (typeof val === 'object' ? JSON.stringify(val) : val)
    }

    Vue.prototype._v = function (text) { // 创建虚拟dom 文本
        return createTextVnode(text)
    }
    Vue.prototype._render = function () {
        const vm = this
        const { render } = vm.$options
        const vnode = render.call(vm)

        return vnode
    }
}



function createElement(tag,data={},...children) {
  
    return vnode(tag,data,data.key,children)
}

function createTextVnode(text) {
    return vnode(undefined,undefined,undefined,undefined,text)
}


function vnode(tag,data,key,children,text) {
    return {
        tag,
        data,
        key,
        children,
        text
    }
}