export type ScrollElement = HTMLElement | Window

const overflowStylePatterns = ['scroll', 'auto', 'overlay']

function isElement(node: unknown): node is Node {
  if (!(node instanceof Node)) {
    return false
  }
  const ELEMENT_NODE_TYPE = 1
  return node.nodeType === ELEMENT_NODE_TYPE
}

export function getScrollParent(
  el: Element,
  root: ScrollElement | null | undefined = window,
): ScrollElement {
  let node = el

  while (node && node !== root && isElement(node)) {
    if (node === document.body) {
      return root as HTMLElement
    }
    const { overflowY } = window.getComputedStyle(node)
    if (overflowStylePatterns.includes(overflowY)) {
      return node as HTMLElement
    }
    node = node.parentNode as Element
  }
  return el.ownerDocument.defaultView || window
}

export function isWindow(arg: unknown): arg is Window {
  return Object.prototype.toString.call(arg) === '[object Window]'
}

export function isDocument(arg: unknown): arg is Document {
  return Object.prototype.toString.call(arg) === '[object HTMLDocument]'
}

export function isRoot(arg: unknown): arg is HTMLElement {
  return Object.prototype.toString.call(arg) === '[object HTMLHtmlElement]'
}

export function getScrollElement(el: unknown): Element {
  if (isDocument(el)) {
    return el.scrollingElement!
  }
  if (isElement(el)) {
    return el as Element
  }
  return document.scrollingElement!
}
