const ncname = "[a-zA-Z_][\\w\\-\\.]*";
const qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")";
const startTagOpen = new RegExp("^<" + qnameCapture);
const startTagClose = /^\s*(\/?)>/;
const endTag = new RegExp("^<\\/" + qnameCapture + "[^>]*>");
/*匹配<!DOCTYPE> 标签*/
const doctype = /^<!DOCTYPE [^>]+>/i;
/*匹配注释*/
const comment = /^<!--/;
const conditionalComment = /^<!\[/;
// Regular Expressions for parsing tags and attributes
const singleAttrIdentifier = /([^\s"'<>/=]+)/;
const singleAttrAssign = /(?:=)/;
const singleAttrValues = [
    // attr value double quotes
    /"([^"]*)"+/.source,
    // attr value, single quotes
    /'([^']*)'+/.source,
    // attr value, no quotes
    /([^\s"'=<>`]+)/.source,
];
const attribute = new RegExp(
    "^\\s*" +
        singleAttrIdentifier.source +
        "(?:\\s*(" +
        singleAttrAssign.source +
        ")" +
        "\\s*(?:" +
        singleAttrValues.join("|") +
        "))?"
);

export function parseHTML(html, options) {
    let root;
    let currentParent;
    var stack = [];
    var index = 0;
    var last, lastTag;

    //递归分解HTML
    while (html) {
        // 只要html不为空，就一直循环解析
        var textEnd = html.indexOf("<");
        //如果开头是<，那么就是开始标签
        if (textEnd === 0) {
            // v-bind v-on
            // 注释
            const startTagMatch = parseStartTag(); // 开始标签匹配的结果
            if (startTagMatch) {
                // 如果匹配到了开始标签
                start(startTagMatch.tagName, startTagMatch.attrs);
                continue;
            }

            const endTagMatch = html.match(endTag);
            console.log(endTagMatch, "endTagMatch");
            if (endTagMatch) {
                // 如果匹配到了结束标签
                advance(endTagMatch[0].length);
                end(endTagMatch[1]);
                continue;
            }
        }

        // 如果开头不是<，那么就是文本
        let text;
        if (textEnd > 0) {
            text = html.substring(0, textEnd);
            advance(text.length);
            chars(text);
        }
    }

    function advance(n) {
        // 将字符串进行截取操作， 并更新html
        html = html.substring(n);
    }

    //解析开始标签
    function parseStartTag() {
        var start = html.match(startTagOpen);
        if (start) {
            const match = {
                tagName: start[1],
                attrs: [],
            };
            advance(start[0].length);
            // 如果直接是闭合标签
            let end, attr;
            // 不是结尾标签 也能匹配到属性
            while (
                !(end = html.match(startTagClose)) &&
                (attr = html.match(attribute))
            ) {
                // 兼容属性单引号双引号等情况
                match.attrs.push({
                    name: attr[1],
                    value: attr[3] || attr[4] || attr[5],
                });
                advance(attr[0].length); // 去掉当前属性
            }
            if (end) {
                // 如果是闭合标签
                advance(end[0].length); // 删除配到到的结束标签
                return match;
            }
        }
    }

    function start(tagName, attrs) {
        console.log(tagName, "start");
        console.log(attrs, "attrs-start");
        let elemet = createASTElement(tagName, attrs);
        if (!root) {
            root = elemet;
        }
        currentParent = elemet; // 当前解析的标签  保存起来
        stack.push(elemet);
    }

    function end(tagName) {
        console.log(tagName, "end");
        let element = stack.pop(); // 取出栈中最后一个
        currentParent = stack[stack.length - 1];
        if (currentParent) { // 如果有父节点
            element.parent = currentParent; // 设置父节点
            currentParent.children.push(element); // 设置子节点
        }
    }

    function chars(text) {
        console.log(text, "chars");
        text = text.replace(/\s/g, "");
        if (text) { // 去掉空格 保存文本
            currentParent.children.push({
                type: 3,
                text,
            });
        }
    }

    function createASTElement(tag, attrs) {
        return {
            tag, // 标签名
            attrs, // 属性
            type: 1, // 1表示元素节点，2表示文本节点
            children: [], // 子节点
            parent: null, // 父节点
        };
    }

    return root;
}
