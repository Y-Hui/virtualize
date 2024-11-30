import {
  Checkbox,
  type CheckboxProps,
  Radio,
  type RadioChangeEvent,
  type RadioProps,
} from 'antd'
import { type CheckboxChangeEvent } from 'antd/es/checkbox'
import { createElement, type FunctionComponent, isValidElement } from 'react'

import { type TableRowSelection } from './types'

export interface SelectionCellProps<T>
  extends Partial<Omit<CheckboxProps, 'checked' | 'defaultChecked'>> {
  index: number
  isRadio?: boolean
  record: T
  checked?: boolean
  renderCell: TableRowSelection<T>['renderCell']
  onRadioChange?: RadioProps['onChange']
  onCheckboxChange?: CheckboxProps['onChange']
}

function SelectionCell<T>(props: SelectionCellProps<T>) {
  const {
    index,
    isRadio,
    record,
    checked = false,
    renderCell,
    onCheckboxChange,
    onRadioChange,
    // @ts-expect-error 故意将 defaultChecked 从 props 中排除，不需要此属性
    defaultChecked,
    ...rest
  } = props

  const node = createElement(
    (isRadio ? Radio : Checkbox) as FunctionComponent<RadioProps | CheckboxProps>,
    {
      ...rest,
      checked,
      onChange(e: CheckboxChangeEvent | RadioChangeEvent) {
        if (isRadio) {
          return onRadioChange?.(e)
        }
        return onCheckboxChange?.(e)
      },
    },
  )

  if (renderCell) {
    const newNode = renderCell(checked, record, index, node)
    if (isValidElement(newNode)) return newNode
    return null
  }

  return node
}

export default SelectionCell
