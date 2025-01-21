import type { PropsWithChildren } from 'react'
import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useRef, useState } from 'react'

export interface HorizontalScrollContextState {
  getElements: () => HTMLElement[]
  /** VirtualTable 中 header、body 水平滚动为内部容器，需要同步滚动时调用此函数 */
  addShouldSyncElement: (key: string, element: HTMLElement) => () => void
  removeShouldSyncElement: (key: string) => void
}

const HorizontalScroll = createContext<HorizontalScrollContextState | null>(null)

if (__DEV__) {
  HorizontalScroll.displayName = 'VirtualTable.HorizontalScroll'
}

export function HorizontalScrollContext(props: PropsWithChildren) {
  const { children } = props

  const elementsRef = useRef<Record<string, HTMLElement>>({})
  const [elements, setElements] = useState<Record<string, HTMLElement>>({})

  const removeShouldSyncElement = useCallback((key: string) => {
    delete elementsRef.current[key]
    setElements({ ...elementsRef.current })
  }, [])

  const addShouldSyncElement = useCallback((key: string, element: HTMLElement) => {
    const target = elementsRef.current[key]
    if (target !== element) {
      elementsRef.current[key] = element
      setElements({ ...elementsRef.current })
    }
    return () => {
      removeShouldSyncElement(key)
    }
  }, [removeShouldSyncElement])

  const context = useMemo((): HorizontalScrollContextState => {
    return {
      getElements() {
        return Object.values(elements)
      },
      addShouldSyncElement,
      removeShouldSyncElement,
    }
  }, [addShouldSyncElement, elements, removeShouldSyncElement])

  // 水平滚动容器同步
  useLayoutEffect(() => {
    const nodes = Object.values(elements)

    const disabledElement = new Set<HTMLElement>()
    const updateScrollLeft = (currentElement: HTMLElement, scrollLeft: number) => {
      nodes.forEach((el) => {
        if (el === currentElement) return
        disabledElement.add(el)

        el.scrollLeft = scrollLeft
      })
    }

    const onScroll = (e: Event) => {
      const target = e.target as HTMLElement

      if (disabledElement.has(target)) {
        disabledElement.delete(target)
        return
      }

      const sync = () => {
        const { scrollLeft } = target
        updateScrollLeft(target, scrollLeft)
      }

      const rAF = window.requestAnimationFrame as typeof window.requestAnimationFrame | undefined
      if (rAF != null) {
        rAF(sync)
      } else {
        sync()
      }
    }

    nodes.forEach((node) => {
      node.addEventListener('scroll', onScroll)
    })

    return () => {
      nodes.forEach((node) => {
        node.removeEventListener('scroll', onScroll)
      })
    }
  }, [elements])

  return <HorizontalScroll.Provider value={context}>{children}</HorizontalScroll.Provider>
}

export function useHorizontalScrollContext() {
  const context = useContext(HorizontalScroll)

  if (context == null) {
    throw new Error('useHorizontalScrollContext provider not found')
  }

  return context
}
