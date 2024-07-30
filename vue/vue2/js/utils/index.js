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
    if (typeof el === "string") {
        // 字符串 id class 等
        const selector = document.querySelector(el);
        if (!selector) {
            console.warn("querySelector 未找到元素");
            return document.createElement("div");
        }
        return selector;
    } else {
        // 元素
        return el;
    }
}

export function getOuterHTML(el) {
    if (el.outerHTML) {
        return el.outerHTML;
    } else {
        const container = document.createElement("div");
        container.appendChild(el.cloneNode(true));
        return container.innerHTML; // 本身的html
    }
}

const LIFTCYCLE_HOOKS = [
    "beforeCreated",
    "created",
    "beforeMount",
    "mounted",
    "beforeUpdate",
    "updated",
    "beforeDestroy",
    "destroyed",
];
// 策略对象
const strats = {
    data: function (parentVal,childVal) {
        return childVal;
    },
    methods: {},
    computed: {},
    components: {},
    directives: {},
};

LIFTCYCLE_HOOKS.forEach((hook) => {
    strats[hook] = mergeHook;
});

// 合并生命周期
function mergeHook(parentVal, childVal) {
    if (childVal) {
        if (parentVal) {
            return parentVal.concat(childVal);
        } else {
            return [childVal];
        }
    } else {
        return parentVal;
    }
}
export function mergeOptions(parent, child) {
    let options = {};
    let key;

    for (key in parent) {
        mergeField(key);
    }

    for (key in child) {
        if (!parent.hasOwnProperty(key)) {
            mergeField(key);
        }
    }

    function mergeField(key) {
        if (strats[key]) {
            options[key] = strats[key](parent[key], child[key]);
        } else {
            console.log("默认合并");

            options[key] = child[key] || parent[key];
        }
    }

    return options;
}
