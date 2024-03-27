import {observe} from './observer.js'
class Vue {
    constructor (options) {
        console.log(document.querySelector(options.el),'options')
        this.$options = options || {} // new Vue 传入的配置对象
        this.$el =typeof options.el === 'string'? document.querySelector(options.el): options.el

        // 数据保存在 ￥data 和 _data 中
        this.$data = this._data = options.data || {}
        this.$methods = options.methods || {}

        // 访问 this.msg = this.data.msg
        /*通过proxy函数将_data（或者_props等）上面的数据代理到vm上，这样就可以用app.text代替app._data.text了。*/
        let keys = Object.keys(this.$data)
        let i = keys.length
        while (i--) {
            proxy(this, '_data', keys[i])
        }
      
        // 将数据变成可观察的
        observe(this.$data)
    }
}


const sharedPropertyDefinition = {
    // 目标属性是否可被枚举（遍历）
   enumerable: true,
//    表示能否通过 delete 删除属性、能否修改属性的特性，或者将属性修改为访问器属性
   configurable: true,
   get: function() {},
   get: function() {},
}

function proxy(target, source, key) {
    sharedPropertyDefinition.get = function proxyGetter() {
        return this[source][key]
    }
    sharedPropertyDefinition.set = function proxySetter(val) {
        this[source][key] = val
    }

    Object.defineProperty(target, key, sharedPropertyDefinition)
}




export default Vue