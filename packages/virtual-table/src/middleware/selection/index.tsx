import { useControllableValue } from 'ahooks'
import { isValidElement, type Key, type ReactNode, useCallback, useRef } from 'react'

import {
  type Middleware,
  type MiddlewareContext,
} from '../../core/hooks/useTablePipeline'
import { type AnyObject, type ColumnType } from '../../types'
import SelectionCell from './cell'
import SelectionTitle from './title'
import { type TableRowSelection } from './types'

const SELECTION_COLUMN_KEY = 'Table.SELECTION_COLUMN'

/**
 * 为 Table 实现多选、单选功能，不传入 options 则是禁用插件
 */
export function selection<T>(options?: TableRowSelection<T>): Middleware<T> {
  type Context = Required<MiddlewareContext<T>>
  return function useSelection(ctx) {
    const { columns: rawColumns } = ctx
    const rowKey = ctx.rowKey as string
    const dataSource = (ctx.dataSource ?? []) as AnyObject[]

    // preserveSelectedRowKeys=true 时，勾选过的数据，都会在这里存一份
    const cache = useRef(new Map<Key, T>())

    const [selectedRowKeys, setSelectedRowKeys] = useControllableValue<Key[]>(options, {
      defaultValuePropName: 'defaultSelectedRowKeys',
      valuePropName: 'selectedRowKeys',
      trigger: 'onChange',
      defaultValue: [],
    })

    const rowClassName: Context['rowClassName'] = useCallback(
      (record) => {
        const key = (record as AnyObject)[rowKey]
        const checked = selectedRowKeys.includes(key)
        return checked ? 'virtual-table-row-selected' : ''
      },
      [rowKey, selectedRowKeys],
    )

    if (options == null) {
      return ctx
    }

    const {
      preserveSelectedRowKeys,
      type,
      getCheckboxProps,
      onSelect,
      selections,
      hideSelectAll = false,
      fixed = 'left',
      columnWidth,
      columnTitle,

      // TODO: 未实现
      // checkStrictly 属性使用场景：
      // const dataSource = [{ key: 1, name: "张三", children: [{ key: 1.1, name: "李四" }] }]
      // dataSource 中含有 children 属性，antd Table 组件会显示为“树形”结构，Table 左侧会新增一个展开按钮，点击后会显示“李四”的数据
      // 勾选“张三”的时候，会把对应 children 全部选中。如果 checkStrictly=false 则不选中。
      checkStrictly: _checkStrictly,

      renderCell,
      onCell,
    } = options

    const selectionPropsList = dataSource.map((row) => {
      if (!getCheckboxProps) return {}
      return getCheckboxProps(row as T)
    })
    const allDisabled = !selectionPropsList.some((item) => !item.disabled)

    // 当有某一行数据 Checkbox disabled 时，过滤它
    const allKeys = dataSource
      .filter((_data, index) => !selectionPropsList[index].disabled)
      .map((x) => x[rowKey as string])

    const isSelected = selectedRowKeys.length > 0
    const indeterminate = isSelected && allKeys.length > selectedRowKeys.length
    const isSelectedAll = isSelected
      ? allKeys.length > 0 && allKeys.every((key) => selectedRowKeys.includes(key))
      : false

    const shakeDeadKeys = (keys: Key[]) => {
      const unionKeys = new Set(keys)
      if (!preserveSelectedRowKeys) {
        return Array.from(unionKeys).filter((key) => {
          return allKeys.includes(key)
        })
      }
      return Array.from(unionKeys)
    }

    const getRowsByKeys = (keys: Key[]) => {
      const result: (T | undefined)[] = []
      keys.forEach((key) => {
        let value = dataSource.find((row) => row[rowKey] === key) as T | undefined

        // 在 cache 中还是找不到对应的数据，就放弃寻找，填入一个 undefined（与 antd 默认表现一致）
        // 场景: selectedRowKeys 中有一个在 dataSource 中不存在的 key，用这个 key 是找不到数据的
        if (value == null && preserveSelectedRowKeys) {
          value = cache.current.get(key)
        }

        if (!value && !preserveSelectedRowKeys) return

        result.push(value)
      })
      return result
    }

    const onSelectAll = () => {
      const keys = shakeDeadKeys([...selectedRowKeys, ...allKeys])
      const rows = getRowsByKeys(keys)
      setSelectedRowKeys(keys, rows, { type: 'all' })
    }

    const onSelectInvert = () => {
      const keys = allKeys.filter((key) => !selectedRowKeys.includes(key))
      const rows = getRowsByKeys(keys)
      setSelectedRowKeys(keys, rows, { type: 'invert' })
    }

    const onClearAll = () => {
      setSelectedRowKeys([], [], { type: 'none' })
    }

    const mergeColumns = () => {
      const renderRadio = type === 'radio'

      const onCreateTitle = () => {
        if (renderRadio) {
          if (isValidElement(columnTitle)) {
            return columnTitle
          }
          if (typeof columnTitle === 'function') {
            return columnTitle(undefined)
          }
          return null
        }

        let title: ReactNode = (
          <SelectionTitle
            checked={isSelectedAll}
            indeterminate={indeterminate}
            selections={selections}
            onClear={onClearAll}
            onSelectAll={onSelectAll}
            onSelectInvert={onSelectInvert}
            allKeys={allKeys}
            disabled={allDisabled}
            onChange={() => {
              if (isSelectedAll) {
                onClearAll()
              } else {
                onSelectAll()
              }
            }}
          />
        )
        if (isValidElement(columnTitle)) {
          title = columnTitle
        } else if (typeof columnTitle === 'function') {
          title = columnTitle(title)
        }
        return title
      }

      const column: ColumnType<T> = {
        title: hideSelectAll ? undefined : onCreateTitle(),
        width: columnWidth ?? 32,
        // eslint-disable-next-line no-nested-ternary
        fixed: fixed === false ? undefined : fixed === 'left' ? 'left' : 'right',
        key: SELECTION_COLUMN_KEY,
        render(_value, record, index) {
          const key = (record as AnyObject)[rowKey]
          const checked = selectedRowKeys.includes(key)
          const extraProps = selectionPropsList[index]

          const updateCache = () => {
            if (preserveSelectedRowKeys) {
              cache.current.set(key, record)
            }
          }

          return (
            <SelectionCell
              {...extraProps}
              index={index}
              isRadio={renderRadio}
              checked={checked}
              record={record}
              renderCell={renderCell}
              onRadioChange={(e) => {
                updateCache()
                const keys = [key]
                const rows = getRowsByKeys(keys)
                // @ts-expect-error rows 并不是安全的 T[] 类型，因为有 preserveSelectedRowKeys 功能存在，在此处只能忽略类型错误
                onSelect?.(record, e.target.checked, rows, e)
                setSelectedRowKeys(keys, rows, { type: 'single' })
              }}
              onCheckboxChange={(e) => {
                updateCache()
                if (checked) {
                  const keys = shakeDeadKeys(selectedRowKeys.filter((x) => x !== key))
                  const rows = getRowsByKeys(keys)
                  // @ts-expect-error rows 并不是安全的 T[] 类型，因为有 preserveSelectedRowKeys 功能存在，在此处只能忽略类型错误
                  onSelect?.(record, e.target.checked, rows, e)
                  setSelectedRowKeys(keys, rows, { type: 'single' })
                } else {
                  const keys = shakeDeadKeys([...selectedRowKeys, key])
                  const rows = getRowsByKeys(keys)
                  // @ts-expect-error rows 并不是安全的 T[] 类型，因为有 preserveSelectedRowKeys 功能存在，在此处只能忽略类型错误
                  onSelect?.(record, e.target.checked, rows, e)
                  setSelectedRowKeys(keys, rows, { type: 'single' })
                }
              }}
            />
          )
        },
        onCell,
        onHeaderCell() {
          return { className: 'virtual-table-selection-column' }
        },
      }
      return [column, ...rawColumns]
    }

    return {
      ...ctx,
      rowClassName,
      columns: mergeColumns(),
    } satisfies MiddlewareContext<T>
  }
}

export type { TableRowSelection }
