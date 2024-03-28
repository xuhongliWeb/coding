export function noop() {}

export function isObject(val) {
    return val !== null && typeof val === "object";
}

const hasOwnProperty = Object.prototype.hasOwnProperty;
export function hasOwn(val, key) {
    return hasOwnProperty.call(val, key);
}

const _toString = Object.prototype.toString;
export function isPlainObject(x) {
    return _toString.call(x) === "[object Object]";
}

export function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
        writable: true,
        enumerable: !!enumerable,
        configurable: true,
        value: val,
    });
}

export function remove(arr, item) {
    if (arr.length) {
        const index = arr.indexOf(item);
        if (index > -1) {
            arr.splice(index, 1);
        }
    }
}
