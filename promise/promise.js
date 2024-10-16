function isunc(fn) {
    return typeof fn === "function";
}

function resolvePromise(promise, x, resolve, reject) {
    debugger
    if (promise === x) {
        return reject(new TypeError("循环引用了"));
    }

    if (typeof x === "object" || typeof x === "function") {
        try {
            const then = x.then;
            console.log("then: ", then);
            if (typeof then === "function") {
                then.call(
                    x,
                    (y) => {
                        resolvePromise(promise, y, resolve, reject);
                    },
                    error => {
                        reject(error);
                    }
                );
            } else {
                resolve(x);
            }
        } catch (error) {}
    } else {
        resolve(x);
    }
}

/**
 *
 * Promise A+ 规范
 * 规定了一个promise 实例的状态一共为三类：pending/fulfilled/rejected, 三种状态一经改变不可逆转。
 * 每次调用后都会返回一个新的Promise 实例
 */

const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

/**
 * executor: 执行器函数 参数是resolve 和 reject 会接收两个构造函数，分别用于更改Promise 状态
 */
class MyPromise {
    constructor(executor) {
        this.status = PENDING;
        this.value = undefined; // fulfilled状态的值
        this.reason = undefined; // rejected状态的值
        this.onFulfilled = []; // fulfilled状态的回调函数队列
        this.onRejected = []; // rejected状态的回调函数队列

        if (typeof executor !== "function") {
            throw new TypeError("Promise resolver undefined is not a function");
        }

        /**
         * resolve函数用于处理Promise对象的完成状态
         * 当Promise对象处于待决状态时，调用此函数会将其状态更改为完成，并执行所有注册的回调函数
         *
         * @param {any} value - 传递给下一个then方法或catch方法的结果值，可以是任意类型
         */
        function resolve(value) {
            // 状态改变后不可再次改变
            if (this.status !== PENDING) return;
            this.status = FULFILLED;
            this.value = value;
            this.onFulfilled.forEach((fn) => fn());
            this.onFulfilled = [];
        }

        /**
         * reject函数用于处理Promise对象的失败状态
         * 当Promise对象处于待决状态时，调用此函数会将其状态更改为失败，并执行所有注册的回调函数
         *
         * @param {any} reason - 传递给下一个then方法或catch方法的原因值，可以是任意类型
         */
        function reject(reason) {
            console.log("reason: ", reason);

            // 状态改变后不可再次改变
            if (this.status !== PENDING) return;
            this.status = REJECTED;
            this.reason = reason;
            this.onRejected.forEach((fn) => fn());
            this.onFulfilled = [];
        }
        // 执行executor 改变状态
        const bindResolve = resolve.bind(this); // 保存this 上下文 ， 传入箭头函数的话访问不到
        const bindReject = reject.bind(this);
        // try catch 捕获错误
        try {
            executor.call(this, bindResolve, bindReject);
        } catch (error) {
            reject(error);
        }
    }
    /**
     * then 方法返回 一个新的Promise实例 实现链式调用
     * @param {*} onFulfilled
     * @param {*} onRejected
     */
    then(onFulfilled, onRejected) {
        const promise = new MyPromise((resolve, reject) => {
            let x;

            if (this.status === "fulfilled") {
                x = onFulfilled(this.value); // 1. 获取返回值
                console.log(x, "x");
                const bindResolve = resolve.bind(this); // 保存this 上下文 ， 传入箭头函数的话访问不到
                const bindReject = reject.bind(this);
                setTimeout(() => {
                    resolvePromise(promise, x, bindResolve, bindReject);
                }, 0);
            }

            if (this.status === "rejected") {
                x = onRejected(this.reason);
                setTimeout(() => resolvePromise(promise, x, resolve, reject), 0);
            }
            //pending 状态，就是连微任务队列都没进，先暂存进入回调数组，
            //待pending状态改变后再进入微任务队列中排队
            //! 这里应用了发布订阅的设计模式
            if (this.status === "pending") {
                this.onFulfilled.push(() => {
                    x = onFulfilled(this.value);
                    setTimeout(() => resolvePromise(promise, x, resolve, reject), 0);
                });

                this.onRejected.push(() => {
                    x = onRejected(this.reason);
                    setTimeout(() => resolvePromise(promise, x, resolve, reject), 0);
                });
            }
        });

        return promise;
    }

    /**
     * catch方法其实是then方法的语法糖：then(null,onRejected)
     * @param onRejected
     * @return {TPromise}
     */
    catch(onRejected) {
        return this.then(null, onRejected);
    }
}

// new MyPromise((resolve, reject) => {
//     resolve(1);
// }).then((res) => {
//     console.log("resolve", res);
// });

// # 异步 源码中使用 发布订阅模式
new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(2);
    }, 2000);
}).then((res) => {
    console.log("resolve222", res);
});

// # 链式调用 源码中then返回的是一个promise

// const p1 = new MyPromise((resolve, reject) => {
//     resolve(1);
// })
//     .then((res) => {
//         console.log(res, "11111111111111");
//         return 2;
//     })
//     .then((res) => {
//         console.log(res, "22222222");
//     });

// # 链式调用 返回promise

// const p2 = new MyPromise((resolve, reject) => {
//     resolve(1);
// })
//     .then((res) => {
//         console.log(res, "11111111111111");
//         return new MyPromise((resolve, reject) => {
//             resolve(2);
//         });
//     })
//     .then((res) => {
//         console.log(res, "22222222");
//     });


    // # 链式调用 返回 thenable

// const p3 = new MyPromise((resolve, reject) => {
//     resolve(1);
// })
//     .then((res) => {
//         return {
//             then(resolve) {
//                 resolve(2);
//             }
//         }
//     })
//     .then((res) => {
//         console.log(res, "22222222");
//     });
// new Promise((resolve, reject) => {
//     console.log('Promise--resolve: ', resolve);
//     resolve(1)
// }).then(res => {
//     console.log(res)
// })
