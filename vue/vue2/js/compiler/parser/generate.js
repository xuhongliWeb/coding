// 预期 <div id="app" style="color:red">hello {{name}} <span>hello</span></div>
// 结果 render() {
    // return _c('div', {
    //     attrs: {
    //         "id": "app"
    //     },
    //     style: {
    //         "color": "red"
    //     }
    // }, [_v("hello " + _s(name) + " "), _c('span', [_v("hello")])])
// }

// return _c('div', {attrs: {"id": "app"}}, [_v("hello " + _s(name) + " "), _c('span', [_v("hello")])])

const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g

// {name:'id',value:'app'} => {id: app}
function genProps(attrs) {
    console.log(attrs,'attrs')
    let attrsStr = ''

    for (let i =0; i < attrs.length; i++) {
        let {name, value} = attrs[i]
        if (name === 'style') { // style="color:red;font-size:14px" => {color:red,font-size:14px} 兼容行内样式
            let styleObj = {}
            value.split(';').forEach(item => {
                let [key, value] = item.split(':')
                styleObj[key] = value
            })
            value = styleObj
        }
        attrsStr += `${name}: ${JSON.stringify(value)},`
    }

    console.log(attrsStr,'attrsStr')
    return `{${attrsStr.slice(0,-1)}}`
}


function genNode(node) {
    if (node.type === 1) {
        return generate(node)
    } else {
        let text = node.text
        if (text) {
            if (!defaultTagRE.test(text)) {
                // 普通文本 不带 {{}}
                return `_v(${JSON.stringify(text)})`
            }
        
            let tokens = []
            let lastIndex =  defaultTagRE.lastIndex = 0 // 如果正则是全局模式下 需要每次使用前手动设置lastIndex
            let match // 每次 匹配到的结果

            while (match = defaultTagRE.exec(text)) {
                let index = match.index // 保存匹配到的索引
                if (index > lastIndex) {
                    tokens.push(JSON.stringify(text.slice(lastIndex, index))) // 添加普通文本
                }

                tokens.push(`_s(${match[1].trim()})`) // 匹配到的内容

                lastIndex = index + match[0].length // 匹配到的索引 + 匹配到的内容长度 更新索引

                if (lastIndex < text.length)  { //  剩余文本
                    tokens.push(JSON.stringify(text.slice(lastIndex))) // 添加普通文本
                }
            }

            return `_v(${tokens.join('+')})`

        }
    }
}

// 处理子节点
function genChildren(children) {
    if (children) { // 
        return children.map(child => genNode(child)).join(',')
    }
    // return children.map(child => genNode(child)).join(',')
}

export function generate(ast) {

    console.log(ast,'ast’')

    let code = `_c(${ast.tag}, ${ast.attrs.length ? genProps(ast.attrs) : 'undefined'}, ${ast.children.length ? genChildren(ast.children) : 'undefined'})`

    return code
}