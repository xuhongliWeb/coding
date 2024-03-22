// 给定一个字符串 s ，找到 它的第一个不重复的字符，并返回它的索引 。如果不存在，则返回 -1 。

// 示例 1：

// 输入: s = "leetcode"
// 输出: 0
// 示例 2:

// 输入: s = "loveleetcode"
// 输出: 2
// 示例 3:

// 输入: s = "aabb"
// 输出: -1
 

/**
 * @param {string} s
 * @return {number}
 */
var firstUniqChar = function(s) {
    var obj = {};
    for (let i = 0; i < s.length; i++) {
        if (obj[s[i]] === undefined) {
            obj[s[i]] = 1;
        } else {
            obj[s[i]]++;
        }
    }


    for (let i = 0; i < s.length; i++) {
        if (obj[s[i]] === 1) {
            return i;
        }
    }
};


// ###  思路2 遍历字符串， 当某个字符第一次出现和最后一次出现的索引相同，返回该索引
var s = 'leetcode'

firstUniqChar(s)