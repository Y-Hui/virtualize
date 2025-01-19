/** 获取默认的滚动条大小 */
export function getScrollbarSize() {
  const scrollDiv = document.createElement('div')

  scrollDiv.style.position = 'absolute'
  scrollDiv.style.width = '100px'
  scrollDiv.style.height = '100px'
  scrollDiv.style.overflow = 'scroll'
  scrollDiv.style.top = '-9999px'

  document.body.appendChild(scrollDiv)
  const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
  const scrollbarHeight = scrollDiv.offsetHeight - scrollDiv.clientHeight
  document.body.removeChild(scrollDiv)

  return { width: scrollbarWidth, height: scrollbarHeight }
}
