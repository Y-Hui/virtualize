import type { PropsWithChildren } from 'react'
import { createContext, useContext, useMemo, useRef } from 'react'

type Listener = (scrollLeft: number, node: HTMLElement) => void

export interface HorizontalScrollContextState {
  listen: (key: string, listener: Listener) => () => void
  notify: (key: string, options: { scrollLeft: () => number, node: HTMLElement }) => void
}

const HorizontalScroll = createContext<HorizontalScrollContextState | null>(null)

if (__DEV__) {
  HorizontalScroll.displayName = 'VirtualTable.HorizontalScroll'
}

export function HorizontalScrollContext(props: PropsWithChildren) {
  const { children } = props

  const listenerMap = useRef(new Map<string, Listener>())
  const context = useMemo((): HorizontalScrollContextState => {
    const skipEvent = new Set<string>()
    return {
      listen(key, listener) {
        listenerMap.current.set(key, (scrollLeft, node) => {
          listener(scrollLeft, node)
        })
        return () => {
          listenerMap.current.delete(key)
        }
      },
      notify(key, options) {
        if (skipEvent.has(key)) {
          skipEvent.delete(key)
          return
        }
        const { scrollLeft, node } = options
        let rAF = window.requestAnimationFrame as ((fn: () => void) => void) | undefined
        if (rAF == null) {
          rAF = (fn: () => void) => {
            fn()
          }
        }
        listenerMap.current.forEach((listener, itemKey) => {
          if (key === itemKey) return
          skipEvent.add(itemKey)
          rAF(() => {
            listener(scrollLeft(), node)
          })
        })
      },
    }
  }, [])

  return <HorizontalScroll.Provider value={context}>{children}</HorizontalScroll.Provider>
}

export function useHorizontalScrollContext() {
  const context = useContext(HorizontalScroll)

  if (context == null) {
    throw new Error('useHorizontalScrollContext provider not found')
  }

  return context
}
