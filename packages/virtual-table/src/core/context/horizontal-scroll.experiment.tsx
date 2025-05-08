import type { PropsWithChildren } from 'react'
import { createContext, useContext, useEffect, useMemo, useRef } from 'react'
import { filterMap } from '../utils/filter'

interface Listener {
  trigger: (scrollLeft: number, node: HTMLElement) => void
  before: () => void
  after: () => void
}

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
  const timeoutId = useRef<number>()

  const context = useMemo((): HorizontalScrollContextState => {
    // const skipEvent = new Set<string>()
    return {
      listen(key, listener) {
        listenerMap.current.set(key, listener)
        return () => {
          listenerMap.current.delete(key)
        }
      },
      notify(key, options) {
        // if (skipEvent.has(key)) {
        //   skipEvent.delete(key)
        //   return
        // }
        window.clearTimeout(timeoutId.current)

        const { scrollLeft, node } = options
        let rAF = window.requestAnimationFrame as ((fn: () => void) => void) | undefined
        if (rAF == null) {
          rAF = (fn: () => void) => {
            fn()
          }
        }

        const needSynced = filterMap(listenerMap.current, (_v, itemKey) => key !== itemKey)
        needSynced.forEach((f) => f.before())
        needSynced.forEach((listener) => {
          // rAF(() => {
          listener.trigger(scrollLeft(), node)
          // })
        })
        timeoutId.current = window.setTimeout(() => {
          rAF(() => {
            needSynced.forEach((listener) => {
              listener.after()
            })
          })
        })
      },
    }
  }, [])

  useEffect(() => {
    return () => {
      window.clearTimeout(timeoutId.current)
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

export function useScrollSynchronize<T extends HTMLElement>(key: string) {
  const { listen, notify } = useHorizontalScrollContext()
  const nodeRef = useRef<T>(null)

  useEffect(() => {
    const node = nodeRef.current
    if (node == null) return

    const onScroll = () => {
      notify(key, { scrollLeft: () => node.scrollLeft, node })
    }

    const addEvent = () => {
      // eslint-disable-next-line @eslint-react/web-api/no-leaked-event-listener
      node.addEventListener('scroll', onScroll, { passive: true })
    }

    const removeEvent = () => {
      node.removeEventListener('scroll', onScroll)
    }

    const dispose = listen(key, {
      trigger: (scrollLeft) => {
        node.style.willChange = 'scroll-position'
        node.scrollLeft = scrollLeft
      },
      before: () => {
        removeEvent()
      },
      after: () => {
        removeEvent()
        addEvent()
        node.style.willChange = ''
      },
    })

    addEvent()
    return () => {
      removeEvent()
      dispose()
    }
  }, [key, listen, notify])

  return nodeRef
}
