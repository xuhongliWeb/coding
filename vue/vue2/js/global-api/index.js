import { mergeOptions } from "../utils/index.js"

export function initGlobalApi(Vue) {
    Vue.options = {}
    Vue.mixin = function (mixin) {
        // 合并对象
        this.options = mergeOptions(this.options, mixin)
    }
}

