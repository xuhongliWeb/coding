/*
 * @docs: https://github.com/mqyqingfeng/Blog/issues/26
 */

/**
 * throttle
 * 如果持续触发事件， 每隔一段时间，只执行一次事件
 */

function throttle(func, wait) {
    let context, args;
    let last = 0;
    return function () {
        context = this;
        args = arguments;
        let now = Date.now();
        if (now - last >= wait) {
            func.apply(context, args);
            last = now;
        }
    };
}


/**
 * 使用定时器实现
 */

function throttle2(func, wait) {
    let context, args;
    let timeout;
    return function () {
        if (!timeout) {
            context = this;
            args = arguments;
            timeout = setTimeout(() => {
                func.apply(context, args);
                timeout = null;
                clearTimeout(timeout);
            },wait);
        }
    }
}

/**
 * 时间戳和定时器结合
 * @param {*} func 
 * @param {*} wait 
 * @returns 
 */

function throttle3(func, wait) {
    var timeout, context, args, result;
    var previous = 0;
    var later = function() {
        previous = +new Date();
        timeout = null;
        console.log('后执行');
        func.apply(context, args)
    };

    var throttled = function() {
        var now = +new Date();
        //下次触发 func 剩余的时间
        var remaining = wait - (now - previous); // 等待时间减去已经过去的时间
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            console.log('等待时间以内');
            // console.log('remaining: ', remaining);
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;

            func.apply(context, args);
        } else if (!timeout) {
            // 等待时间以外，且没有等待中的定时器
            console.log('等待时间以外，且没有等待中的定时器');
            timeout = setTimeout(later, remaining);
        }
    };
    return throttled;
}


function throttle4(func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};

    var later = function() {
        previous = options.leading === false ? 0 : new Date().getTime();
        timeout = null;
        func.apply(context, args);
        if (!timeout) context = args = null;
    };

    var throttled = function() {
        var now = new Date().getTime();
        if (!previous && options.leading === false) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
    };

    throttled.cancel = function() {
        clearTimeout(timeout);
        previous = 0;
        timeout = null;
    };

    return throttled;
}