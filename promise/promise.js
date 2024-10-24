function isunc(fn) {
    return typeof fn === "function";
}

// 判断值是否为可迭代对象

function isIterator(obj) {
    return obj != null && typeof obj[Symbol.iterator] === "function";
}
function resolvePromise(promise, x, resolve, reject) {
    if (promise === x) {
        return reject(new TypeError("循环引用了"));
    }

    if (typeof x === "object" || typeof x === "function") {
        try {
            const then = x.then;
            if (typeof then === "function") {
                then.call(
                    x,
                    (y) => {
                        resolvePromise(promise, y, resolve, reject);
                    },
                    (error) => {
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
                const bindResolve = resolve.bind(this); // 保存this 上下文 ， 传入箭头函数的话访问不到
                const bindReject = reject.bind(this);
                setTimeout(() => {
                    resolvePromise(promise, x, bindResolve, bindReject);
                }, 0);
            }

            if (this.status === "rejected") {
                x = onRejected(this.reason);
                setTimeout(
                    () => resolvePromise(promise, x, resolve, reject),
                    0
                );
            }
            //pending 状态，就是连微任务队列都没进，先暂存进入回调数组，
            //待pending状态改变后再进入微任务队列中排队
            //! 这里应用了发布订阅的设计模式
            if (this.status === "pending") {
                this.onFulfilled.push(() => {
                    x = onFulfilled(this.value);
                    setTimeout(
                        () => resolvePromise(promise, x, resolve, reject),
                        0
                    );
                });

                this.onRejected.push(() => {
                    x = onRejected(this.reason);
                    setTimeout(
                        () => resolvePromise(promise, x, resolve, reject),
                        0
                    );
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
    /**
     * 该方法返回一个新的proMise 传入的value 有三中情况
     * 1.value 是一个promise对象，直接返回value
     * 2.value 是一个thenable对象，返回一个promise对象，状态为fulfilled，值为value.then()
     * 3.value 不是thenable对象，返回一个promise对象，状态为fulfilled，值为value
     * @param {*} value
     * @returns
     */
    static resolve(value) {
        if (value instanceof MyPromise) return value;
        return new MyPromise((resolve, reject) => {
            resolve(value);
        });
    }
    /**
     * 返回一个已拒绝（rejected）的 Promise 对象
     * 与Promise.resolve()不同，即使reason也是一个promise，也会将其视为被rejected的原因
     * @param {any} reason
     * @return {}
     */
    static reject(reason) {
        return new MyPromise((resolve, reject) => {
            reject(reason);
        });
    }

    /**
     * 返回一个promise对象，只有当所有promise都成功时才返回成功，否则返回失败
     * @param {Array} promiseArr
     * @return {Promise}
     */

    static all(promiseArr) {
        // 判断传入的值是否为可迭代对象
        if (!isIterator(promiseArr)) {
            return MyPromise.reject(new TypeError("argument is not iterable"));
        }

        return new MyPromise((resolve, reject) => {
            let index = 0;
            let count = 0;
            let result = [];
            try {
                for (let value of promiseArr) {
                    let resultIndex = index;
                    index++;
                    MyPromise.resolve(value).then(
                        (res) => {
                            result[resultIndex] = res; // 确认顺序
                            count++;
                            if (count === promiseArr.length) {
                                resolve(result);
                            }
                        },
                        (reason) => {
                            reject(reason);
                        }
                    );
                }
                if (index === 0) {
                    resolve(result);
                }
            } catch (error) {
                reject(error);
            }
        });
    }
    /**
     * )方法同样是将多个 Promise 实例，包装成一个新的 Promise 实例。
     * @param {*} promiseArr
     * @returns
     */
    static race(promiseArr) {
        // 判断传入的值是否为可迭代对象
        if (!isIterator(promiseArr)) {
            return MyPromise.reject(new TypeError("argument is not iterable"));
        }

        return new MyPromise((resolve, reject) => {
            try {
                for (let value of promiseArr) {
                    MyPromise.resolve(value).then((res) => {});
                }
            } catch (error) {
                reject(error);
            }
        });
    }
    /**
     * allSettled 来确定一组异步操作是否都结束了（不管成功或失败）但是每个对象都有一个status属性，表示状态
     */
    allSettled(promiseArr) {
        if (!isIterator(promiseArr)) {
            return MyPromise.reject(new TypeError("argument is not iterable"));
        }

        try {
            return new MyPromise((resolve, reject) => {
                let index = 0;
                let result = [];
                for (const value of promiseArr) {
                    let resultIndex = index;
                    index++;
                    MyPromise.resolve(value).then(
                        (res) => {
                            result[resultIndex] = {
                                status: "fulfilled",
                                value: res,
                            };
                        },
                        (reason) => {
                            result[resultIndex] = {
                                status: "rejected",
                                reason: reason,
                            };
                        }
                    );
                }
            });
        } catch (error) {}
    }
}

// new MyPromise((resolve, reject) => {
//     resolve(1);
// }).then((res) => {
//     console.log("resolve", res);
// });

// # 异步 源码中使用 发布订阅模式
// new MyPromise((resolve, reject) => {
//     setTimeout(() => {
//         resolve(2);
//     }, 2000);
// }).then((res) => {
//     console.log("resolve222", res);
// });

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

// # 静态方法 resolve
// MyPromise.resolve(1).then((res) => {
//     console.log(res);
// });

// MyPromise.resolve(new MyPromise((resolve, reject) => {
//     resolve(2);
// })).then((res) => {
//     console.log(res);
// });
// // # 静态方法 reject

// MyPromise.reject(1).then(null, (err) => {
//     console.log(err);
// });

const p1 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(1);
    }, 1000);
});
const p2 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(2);
    }, 2000);
});

MyPromise.all([p1, p2]).then((res) => {
    console.log(res, "all");
});
// new Promise((resolve, reject) => {
//     console.log('Promise--resolve: ', resolve);
//     resolve(1)
// }).then(res => {
//     console.log(res)
// })
