export const isObject = function (obj) {
    return obj !== null && typeof obj === 'object'
}

let hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = function (obj,key) {
    return hasOwnProperty.call(obj,key)
}


let _toString = Object.prototype.toString

export const isPlainObject = function (obj) {
    return _toString.call(obj) === '[object Object]'
}

export const def = function (obj,key,val,enumerable) {
    Object.defineProperty(obj,key, {
        value:val,
        enumerable:!!enumerable,
        writable:true,
        configurable:true
    })
}