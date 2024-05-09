import { parseHTML } from "./parser/html-parser.js";


export function compileToFunctions(template) {
    // html - render 函数
    // ast 是描述语言本身的对象，描述语言本身的
    // 1. 需要将html 代码转化为ast - render 语法树

    console.log(template, "template");

    let ast = parseHTML(template);
    console.log(ast, "ast");
}

