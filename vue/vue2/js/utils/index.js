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


export function query(el) {
    if (typeof el === 'string') {
        // 字符串 id class 等
        const selector = document.querySelector(el);
        if (!selector) {
            console.warn('querySelector 未找到元素');
            return document.createElement('div');
        }
        return selector;
    }else {
        // 元素
        return el;
    }
}

export function getOuterHTML(el) {
    if (el.outerHTML) {
        return el.outerHTML;
    }else {
        const container = document.createElement('div');
        container.appendChild(el.cloneNode(true));
        return container.innerHTML; // 本身的html
    }
}