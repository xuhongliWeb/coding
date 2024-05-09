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
const singleAttrIdentifier = /([^\s"'<>/=]+)/
const singleAttrAssign = /(?:=)/
const singleAttrValues = [
  // attr value double quotes
  /"([^"]*)"+/.source,
  // attr value, single quotes
  /'([^']*)'+/.source,
  // attr value, no quotes
  /([^\s"'=<>`]+)/.source
]
const attribute = new RegExp(
  '^\\s*' + singleAttrIdentifier.source +
  '(?:\\s*(' + singleAttrAssign.source + ')' +
  '\\s*(?:' + singleAttrValues.join('|') + '))?'
)

function start(tagName,attrs) {
    console.log(tagName,'start')
    console.log(attrs,'attrs-start')
}
export function parseHTML(html, options) {
  var stack = []

  var index = 0
  var last, lastTag;

  //递归分解HTML
  while (html) {// 只要html不为空，就一直循环解析
    last = html;
    var textEnd = html.indexOf('<')
    if (textEnd === 0) { //如果开头是<，那么就是开始标签
       const startTagMatch = parseStartTag() // 开始标签匹配的结果
       if (startTagMatch) { // 如果匹配到了开始标签
          start(startTagMatch.tagName, startTagMatch.attrs)
        break
       }
        break
    }
    
  }


  function advance(n) { // 将字符串进行截取操作， 并更新html 
    html = html.substring(n)
  }

  //解析开始标签
  function parseStartTag() {
    var start = html.match(startTagOpen);
    if (start) {
        const match = {
            tagName: start[1],
            attrs: []
        }
        advance(start[0].length)
        // 如果直接是闭合标签
        let end, attr;
        // 不是结尾标签 也能匹配到属性
        while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
            // 兼容属性单引号双引号等情况
            match.attrs.push({
                name: attr[1],
                value: attr[3] || attr[4] || attr[5]
            })
            console.log(attr,'attr')
            advance(attr[0].length) // 去掉当前属性
           
        }
        console.log(end,'end')
        if (end) { // 如果是闭合标签 
            advance(end[0].length) // 删除配到到的结束标签
            return match
        }
    }
  }
}

