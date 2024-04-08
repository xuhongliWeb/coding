/**
 * 整数反转
 * 给你一个 32 位的有符号整数 x ，返回将 x 中的数字部分反转后的结果。

如果反转后整数超过 32 位的有符号整数的范围 [−231,  231 − 1] ，就返回 0。

假设环境不允许存储 64 位整数（有符号或无符号）。

示例 1：

输入：x = 123
输出：321
示例 2：

输入：x = -123
输出：-321
示例 3：

输入：x = 120
输出：21
示例 4：

输入：x = 0
输出：0
 * @param {*} s 
 */

var t = 123; // =>321
var t2 = -123; // =>-321
var t3 = 120; // => 21

var reverse = function (s) {

    let res = "";
    let arr = s.toString().split("");
    if (arr[arr.length - 1] === 0) {
        arr.pop();
    }
    let len = arr.length;

    for (let i = len; i--; i >= 0) {
        if (arr[i] === "-") {
            res = "-" + res;
        } else {
            res = Number(res + arr[i]);
        }
    }

    if (res >=Math.pow(2,31) ||res <Math.pow(-2,31) ) return 0;

    return res;
};
console.log(reverse(t2));
// console.log(reverse(t3));
