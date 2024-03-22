/**
 * @Author: xuhl
 * @description 两数之和
 * @date 2024、03、22
 */

// 给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target  的那 两个 整数，并返回它们的数组下标。

// 你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。

// 你可以按任意顺序返回答案。

let nums = [2, 7, 11, 15];
let target = 9;

/**
 *  双层循环解法
 * @param {*} nums
 * @param {*} target
 * @returns []
 */
function twoSum(nums, target) {
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
    return [];
}

function twoSum2(nums, target) {
    let map = new Map(); // 使用Map把遍历过的数据存储起来
    for (let index = 0; index < nums.length; index++) {
        // 如果map里有target-nums[index]的值，说明找到了，返回两个下标
        if (map.has(target - nums[index])) {
            return [map.get(target - nums[index]), index];
        } else {
            // 否则，把当前的值和下标存入map里
            map.set(nums[index], index);
        }
    }
    return [];
}

twoSum2(nums, target);
