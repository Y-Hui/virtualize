/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SetStateAction } from 'react'
import { useCallback, useRef, useState } from 'react'

export type Props = Record<string, any>

interface UseControllableValueOptions<T> {
  valuePropName?: string
  defaultValue?: T
  trigger?: string
}

interface Safe<T> {
  valuePropName?: string
  defaultValue: T
  trigger?: string
}

type Trigger<T> = (action: SetStateAction<T>, ...args: unknown[]) => unknown

function useControllableValue<T = any>(props: Props, options: Safe<T>): [T, Trigger<T>]
function useControllableValue<T = any>(props: Props, options: UseControllableValueOptions<T>): [T | undefined, Trigger<T | undefined>]
function useControllableValue<T = any>(props: Props, options?: UseControllableValueOptions<T>): [T | undefined, Trigger<T | undefined>] {
  const { valuePropName = 'value', defaultValue, trigger = 'onChange' } = options ?? {}

  const isControlled = valuePropName in props

  const value = props[valuePropName] as T
  const initialValue = value ?? defaultValue

  const [state, setState] = useState(initialValue)
  const stateRef = useRef(initialValue)
  if (isControlled) {
    // eslint-disable-next-line react-compiler/react-compiler
    stateRef.current = value
  }

  const onChange = props[trigger] as Trigger<T | undefined> | undefined
  const updateState: Trigger<T | undefined> = useCallback((action, ...args) => {
    if (typeof action === 'function') {
      onChange?.((action as ((prevState: T) => T))(stateRef.current as T), ...args)
    } else {
      onChange?.(action as T, ...args)
    }
  }, [onChange])

  if (isControlled) {
    return [value, updateState] as const
  }

  return [state, setState] as const
}

export { useControllableValue }
