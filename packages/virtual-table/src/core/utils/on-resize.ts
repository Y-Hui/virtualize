import { isWindow } from '../../utils/dom'

interface ResizeRect {
  width: number
  height: number
}

export function onResize(target: Window | HTMLElement, callback: (rect: ResizeRect) => void) {
  if (isWindow(target)) {
    const listener = () => {
      callback({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    window.addEventListener('resize', listener)
    return () => {
      window.removeEventListener('resize', listener)
    }
  } else {
    const observer = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect
      callback({ width: rect.width, height: rect.height })
    })
    observer.observe(target)
    return () => {
      observer.disconnect()
    }
  }
}
