import { useCallback, useEffect, useRef, useState } from 'react'

export type Updater<S> = (prev: S) => S

export function useStateInRenderPhase<S>(initialState: S) {
  const stateRef = useRef<S>(initialState)
  const [state, setState] = useState<S>(initialState)

  const lastPromiseRef = useRef<Promise<void> | null>(null)
  const updateBatchRef = useRef<Updater<S>[]>([])

  const setFrameState = useCallback((updater: Updater<S>) => {
    updateBatchRef.current.push(updater)
    const promise = Promise.resolve()
    lastPromiseRef.current = promise
    promise.then(() => {
      if (lastPromiseRef.current === promise) {
        const prevBatch = updateBatchRef.current
        const prevState = stateRef.current
        updateBatchRef.current = []

        prevBatch.forEach((batchUpdater) => {
          stateRef.current = batchUpdater(stateRef.current)
        })

        lastPromiseRef.current = null

        if (prevState !== stateRef.current) {
          setState(stateRef.current)
        }
      }
    })
  }, [])

  useEffect(() => {
    return () => {
      lastPromiseRef.current = null
    }
  }, [])

  return [state, setFrameState] as const
}
