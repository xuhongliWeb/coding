// add(1).add(2).add(3).output()

// # 函数方式实现 利用闭包
// function add(...args) {
//     console.log(args, "1111");
//     let sum = args.reduce((a, b) => a + b);
//     const chain = {
//         add(...args) {
//             sum += args.reduce((a, b) => a + b);
//             return chain;
//         },
//         output() {
//             console.log(sum);
//         },
//     };

//     return chain;
// }
// add(1).add(2).output();

// # 类

class Add {
    constructor(...args) {
        this.sum = args.reduce((a, b) => a + b);
    }
    add(...args) {
        this.sum += args.reduce((a, b) => a + b);
        return this;
    }
    output() {
        console.log(this.sum);
    }
}

function add (...args) {
    console.log(args, "1111");
    return new Add(...args)
}
// 第二个add 调用的是 class 的
add(1).add(1).add(2).add(3).output();