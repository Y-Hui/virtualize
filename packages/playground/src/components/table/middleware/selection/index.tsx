/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SelectionProps } from 'virtual-table/src/middleware/selection'
import type { TableRowSelection } from './types'
import { Checkbox, Radio } from 'antd'
import { isValidElement } from 'react'
import { tableSelection as rawTableSelection } from 'virtual-table/src/middleware/selection'
import SelectionTitle from './title'

export type { TableRowSelection }

export function tableSelection<T = any>(args?: TableRowSelection<T>) {
  if (args == null) {
    return rawTableSelection<T>()
  }

  const { type, selections, columnWidth, columnTitle, ...rest } = args

  const multiple = type === 'checkbox'

  return rawTableSelection<T>({
    ...rest,
    component: SelectionImpl,
    multiple,
    columnWidth: columnWidth ?? ((selections == null || !multiple) ? 32 : 48),
    columnTitle:
      selections != null
        ? (node, ctx) => {
            if (columnTitle != null) {
              if (isValidElement(columnTitle)) {
                return columnTitle
              }
              if (typeof columnTitle === 'function') {
                return columnTitle(node, ctx)
              }
            }

            if (!multiple) {
              return null
            }

            return (
              <SelectionTitle
                checked={ctx.value}
                indeterminate={ctx.indeterminate}
                disabled={ctx.disabled}
                onChange={(e) => {
                  ctx.onChange?.(e.target.checked, e.nativeEvent)
                }}
                onSelectAll={ctx.onSelectAll}
                onSelectInvert={ctx.onSelectInvert}
                onClear={ctx.onClear}
                allKeys={ctx.allKeys}
                selections={selections}
              />
            )
          }
        : undefined,
  })
}

function SelectionImpl(props: SelectionProps) {
  const {
    multiple,
    value,
    onChange,
    indeterminate,
    disabled,
  } = props

  if (!multiple) {
    return (
      <Radio
        checked={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked, e.nativeEvent)}
      />
    )
  }

  return (
    <Checkbox
      checked={value}
      indeterminate={indeterminate}
      disabled={disabled}
      onChange={(e) => onChange?.(e.target.checked, e.nativeEvent)}
    />
  )
}
