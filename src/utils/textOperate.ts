import { ElMessage } from 'element-plus'

// 点击选取当前元素所有内容
export function selectAll() {
  const selection = window.getSelection();
  const range = selection?.getRangeAt(0);
  const node = range?.startContainer;
  if (node && node.nodeValue) {
    range?.setStart(node, 0);
    range?.setEnd(node, node.nodeValue.length)
  }
}

export function copyText(el: Element | string) {
   
  // 没有数据则不复制
  if (el instanceof Element) {
    navigator.clipboard.writeText(el.innerHTML);
  } else if (typeof el === "string") {
    navigator.clipboard.writeText(el).then(()=>{
        ElMessage.success('复制成功')
    })
  }
}
