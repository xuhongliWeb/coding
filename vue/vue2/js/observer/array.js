import { def } from "../utils/index.js";


// 取原生数组的原型 

const arrayProto = Array.prototype;
console.log(arrayProto, 'arrayProto')
// 创建个新的对象，修改该对象上的7个数组方法，防止污染原生数组

export const arrayMethods = Object.create(arrayProto);


console.log(arrayMethods, 'arrayMethods')

// 截获数组成员的变化，执行原生数组操作的同时通知 dep 更新关联的watcher, 进行响应式处理
