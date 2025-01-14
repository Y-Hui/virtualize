import './styles.scss'

import type { ComponentType, DetailedHTMLProps, ForwardedRef, InputHTMLAttributes } from 'react'
import type { SelectionProps as BaseProps } from './types'
import clsx from 'clsx'
import { createElement, forwardRef, useEffect, useRef } from 'react'
import { composeRef } from '../../utils/ref'

type InputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
export interface SelectionProps extends BaseProps,
  Omit<InputProps, 'type' | 'onChange' | 'checked' | 'value' | 'defaultChecked' | 'defaultValue' | 'disabled'> {
  component?: ComponentType<BaseProps>
}

function Selection(props: SelectionProps, ref: ForwardedRef<HTMLInputElement>) {
  const {
    className,
    multiple,
    indeterminate,
    value = false,
    onChange,
    component,
    ...rest
  } = props

  const isCustomComponent = component != null

  const inputNode = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isCustomComponent) return
    const input = inputNode.current
    if (input == null) return
    input.indeterminate = !!indeterminate
  }, [isCustomComponent, indeterminate])

  if (isCustomComponent) {
    return createElement(component, props)
  }

  return (
    <input
      {...rest}
      // eslint-disable-next-line react-compiler/react-compiler
      ref={composeRef(inputNode, ref)}
      className={clsx('virtual-table-selection', className)}
      type={multiple ? 'checkbox' : 'radio'}
      checked={value}
      onChange={(e) => {
        onChange?.(e.target.checked, e.nativeEvent)
      }}
    />
  )
}

export default forwardRef(Selection)
