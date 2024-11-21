/**
 * 防抖原理
 * 你尽管触发事件，但是我一定在事件触发后的n 秒后才执行，
 * 如果你在一个事件触发的n秒内又触发了这个事件，
 * 那我就以新的事件的时间为准，n秒后才执行。
 */

// 第一版

function debounce(fn, delay) {
    let timer = null;
    return function () {
        let context = this;
        let args = arguments;

        clearTimeout(timer);
        timer = null;
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay);
    };
}

// 第二版 增加立即执行参数

function debounce2(fn, delay, immediate) {
    let timer = null;
    return function () {
        let context = this;
        let args = arguments;
        if (timer) clearTimeout(timer);
        if (immediate) {
            let isImmediate = !timer;
            timer = setTimeout(function () {
                timer = null;
            }, delay);
            isImmediate && fn.apply(context, args);
        } else {
            clearTimeout(timer);
            timer = null;
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        }
    };
}

// 第三版 增加返回值 和取消

function debounce3(fn, delay, immediate) {
    let timer = null,
        result;

    const debounced = function () {
        let context = this;
        let args = arguments;
        let result;

        // 如果定时器存在，则清除定时器 ， 不然hui会重复执行 立即执行的函数会像节流一样重复执行
        if (timer) clearTimeout(timer);

        if (immediate) {
            let isImmediate = !timer;  // 第一次触发事件时，timer不存在，所以立即执行，然后设置timer，而后续的触发事件，timer存在，不执行
            timer = setTimeout(function () { // 延迟执行函数，清除timer，这样就可以再次触发
                timer = null;
            }, delay);
            if (isImmediate) result = fn.apply(context, args);
        }else {
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        }
    }

    debounced.cancel = function () {
        clearTimeout(timer);
        timer = null;
    }
    
    return debounced;
}
