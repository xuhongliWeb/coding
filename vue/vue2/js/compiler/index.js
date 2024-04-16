import { parse } from "./parser/index.js"

const baseOptions = {}

// 编译，将模板template编译成AST树、render函数以及staticRenderFns函数
function createCompiler(options) {

    function compile(template, options) {

        // 合并配置


        // 基础模板编译，得到编译结果

        const ast = parse(template.trim(), options) // 将模板编译成AST树
    }

    return {
        compile,
    }
}

const {compile,compileToFunctions} = createCompiler(baseOptions)

export {compile,compileToFunctions}