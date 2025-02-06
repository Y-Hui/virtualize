import type { PropsWithChildren } from 'react'
import { createContext, useContext, useMemo, useRef } from 'react'

type Listener = (scrollLeft: number) => void

export interface HorizontalScrollContextState {
  listen: (key: string, listener: Listener) => () => void
  notify: (key: string, scrollLeft: number) => void
}

const HorizontalScroll = createContext<HorizontalScrollContextState | null>(null)

if (__DEV__) {
  HorizontalScroll.displayName = 'VirtualTable.HorizontalScroll'
}

export function HorizontalScrollContext(props: PropsWithChildren) {
  const { children } = props

  const listenerMap = useRef(new Map<string, Listener>())
  const context = useMemo((): HorizontalScrollContextState => {
    return {
      listen(key, listener) {
        listenerMap.current.set(key, listener)
        return () => {
          listenerMap.current.delete(key)
        }
      },
      notify(key, scrollLeft) {
        let rAF = window.requestAnimationFrame as ((fn: () => void) => void) | undefined
        if (rAF == null) {
          rAF = (fn: () => void) => {
            fn()
          }
        }
        rAF(() => {
          listenerMap.current.forEach((listener, itemKey) => {
            if (itemKey !== key) {
              listener(scrollLeft)
            }
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
