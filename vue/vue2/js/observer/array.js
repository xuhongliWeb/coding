import { def } from "../utils/index.js";


// 取原生数组的原型 


const arrayProto = Array.prototype;
// 创建个新的对象，修改该对象上的7个数组方法，防止污染原生数组

export const arrayMethods = Object.create(arrayProto);

;[
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
  ]
  .forEach(function (method) {
    // cache original method
    /*将数组的原生方法缓存起来，后面要调用*/
    const original = arrayProto[method]
    def(arrayMethods, method, function mutator () {
      // avoid leaking arguments:
      // http://jsperf.com/closure-with-arguments
      let i = arguments.length
      const args = new Array(i)
      while (i--) {
        args[i] = arguments[i]
      }

      /*调用原生的数组方法*/
      const result = original.apply(this, args)
  
      /*数组新插入的元素需要重新进行observe才能响应式*/
      const ob = this.__ob__
      let inserted
      switch (method) {
        case 'push':
          inserted = args
          break
        case 'unshift':
          inserted = args
          break
        case 'splice':
          inserted = args.slice(2)
          break
      }
      if (inserted) ob.observeArray(inserted)
        
      // notify change
      /*dep通知所有注册的观察者进行响应式处理*/
      ob.dep.notify()
      return result
    })
  })