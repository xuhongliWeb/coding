// - target 要使用Proxy包装的目标对象（可以是任何类型的对象，数组，函数，另一个代理）
// - handle 一个通常以函数作为属性的对象， 用来定制拦截行为
// const proxy = new Proxy(target,handle)


const origin = {}

const obj = new Proxy(origin,{
    get: function(target) {
        console.log('target: ', target);
        return '100'
    }
})

// 代理只会对proxy对象生效，如上方的origin就没有任何效果
// console.log(obj.a); // 100

// console.log('origin: ', origin.a); // undefined


// # handle.get

const person = {
    age: 22
}

const obj2 = new Proxy(person,{
    get: function(target,key) {
        if ( key in target) { // in 操作符
            return target[key]
        } else {
            throw new ReferenceError("Prop name \"" + key + "\" does not exist.");
        }
    }
})

// console.log(obj2.age);
// console.log(obj2.xxx);


// # proxy 实现校验器

const target = {
    age: 18,
    name:'xhl'
}

const validators = {
    age(val) {
        return typeof val === 'number' && val<100
    },
    name(val) {
        return typeof val === 'string'
    }
}


// 创建

function createValidator (target,validators) {
    return new Proxy(target,{
        set(target,key,value) {
            // 拿到当前key 并把val 传给校验器
            const validator  = validators[key](value)
            if (validator ) {
                console.log('范围内');
                // Reflect.set(target, propertyKey, value, receiver)
                Reflect.set(target,key,value) // 静态方法 Reflect.set() 工作方式就像在一个对象上设置一个属性。
            }else {
                throw Error(`Cannot set ${key} to ${value}. Invalid type.`)
            }
        }
    })
}

const validator = createValidator(target,validators)
validator.age = 22
console.log(validator.age);
