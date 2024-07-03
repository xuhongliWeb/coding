import { parseHTML } from "./parser/html-parser.js";
import { generate } from "./parser/generate.js";


export function compileToFunctions(template) {
    // html - render 函数
    // ast 是描述语言本身的对象，描述语言本身的
    // 1. 需要将html 代码转化为ast - render 语法树

    // 1. 将html代码转化为ast
    let ast = parseHTML(template);


    // 2. 优化静态节点

    // 3. 通过ast 生成render 函数
    let code = generate(ast)



    // 4. 将render 函数转化为函数

    // let obj = {a:1,b:2}
    // with(obj) {
    //     console.log(a,b)
    // }

    // 限制取出范围- 通过 with, 之后通过改变this 环境进行取值
    let render = new Function("with(this){return " + code + "}")
    return render
}

