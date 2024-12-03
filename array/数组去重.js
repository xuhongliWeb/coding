// 1. 双重循环
// let arr = [1, 2, 3, 4, 5, 4, 3, 2, 1];
/**
 * 第一次 i=0, j=1,2,3,4,5,6,7,8
 * 第二次 i=1, j=2,3,4,5,6,7,8
 * 第三次 i=2, j=3,4,5,6,7,8
 * 第四次 i=3, j=4,5,6,7,8
 * @param {*} arr
 * @returns
 * 对象 undefined 等不会去重
 */
function unique1(arr) {
    let res = [];

    for (let i = 0; i < arr.length; i++) {
        let flag = true;
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] === arr[j]) {
                flag = false;
                break;
            }
        }
        if (flag) {
            res.push(arr[i]);
        }
    }

    return res;
}

//  * 对象 undefined 等不会去重
// 2. indexOf

function unique2(arr) {
    let res = [];

    for (let i = 0; i < arr.length; i++) {
        if (res.indexOf(arr[i]) === -1) {
            res.push(arr[i]);
        }
    }

    return res;
}

// 3. Set

function unique3(arr) {
    return Array.from(new Set(arr));
}

// 4. filter

function unique4(arr) {
    return arr.filter((item, index, arr) => {
        return arr.indexOf(item) === index;
    });
}

// 5 indexof 去除对象

function unique5(arr) {
    var obj = {};
    return arr.filter(function (item, index, array) {
        return obj.hasOwnProperty(typeof item + item)
            ? false
            : (obj[typeof item + item] = true);
    });
}

// 6 map

function unique6(arr) {
    let map = new Map()
    return arr.filter((a) => !map.has(a) && map.set(a, 1))
}

// 结合

function unique7(array) {
    var obj = {};
    return array.filter(function(item, index, array){
        console.log(typeof item + JSON.stringify(item))
        return obj.hasOwnProperty(typeof item + JSON.stringify(item)) ? false : (obj[typeof item + JSON.stringify(item)] = true)
    })
}