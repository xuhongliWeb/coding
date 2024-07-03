// vue 的渲染流程 - 初始化数据 - 模板编译 - render 函数 -  生产虚拟节点 - 生产真是DOM - 渲染

export function path(oldVnode, vnode) {
    // 将虚拟节点转换为真实节点
    const el = createElm(vnode); // 产生真实的dOm
    const parentElm = oldVnode.parentNode; // 获取父节点
    parentElm.insertBefore(el, oldVnode.nextSibling); // 插入到老节点的后面
    parentElm.removeChild(oldVnode); // 删除老节点
}

function createElm(vnode) { // 创建真实节点
    const { tag, data, children, text } = vnode;

    if (typeof tag === "string") { // 元素
        vnode.el = document.createElement(tag);
        undateProperties(vnode); // 设置属性
        children.forEach((element) => { // 递归创建子节点
            vnode.el.appendChild(createElm(element)); // 创建子节点
        });
    } else {
        vnode.el = document.createTextNode(text); // 文本
    }

    return vnode.el;
}


function undateProperties(vnode) {
    let newProps = vnode.data || {};
    let el = vnode.el;
    for (let key in newProps) {
        if (key === "style") {
            for (let styleName in newProps.style) {
                el.style[styleName] = newProps.style[styleName];
            }
        } else if (key === "class") {
            el.className = newProps.class;
        }
    }
}