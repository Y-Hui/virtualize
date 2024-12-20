/* eslint-disable @typescript-eslint/no-explicit-any */
import { useControllableValue, useMemoizedFn } from 'ahooks'
import { type ExpandableConfig as RawExpandableConfig } from 'antd/es/table/interface'
import clsx from 'classnames'
import { type Key, useCallback, useMemo, useRef } from 'react'

import { isValidFixed, type OnRowType, useShallowMemo } from '../../core'
import {
  type AnyObject,
  type ColumnType,
  type FixedType,
  type MiddlewareContext,
  type MiddlewareRender,
} from '../../types'
import { createMiddleware } from '../index'
import ExpandRow from './expand-row'

export type ExpandableConfig<T> = Omit<RawExpandableConfig<T>, 'fixed'> & {
  fixed?: FixedType
}

export const EXPANSION_COLUMN_KEY = 'VirtualTable.EXPANSION_COLUMN'

export function isExpansionColumn<T = any>(column: ColumnType<T>) {
  return column.key === EXPANSION_COLUMN_KEY
}

const EMPTY_ARR: Key[] = []

/* eslint max-len: ["error", { "code": 120 }] */
export const tableExpandable = createMiddleware(
  function useTableExpandable<T = any>(ctx: MiddlewareContext<T>, options?: ExpandableConfig<T> | void) {
    const disablePlugin = options == null

    const { rowKey, columns: rawColumns, dataSource } = ctx
    const {
      // expandedRowKeys,
      // onExpandedRowsChange,
      defaultExpandedRowKeys,
      expandedRowRender,
      columnTitle,
      expandRowByClick = false,
      expandIcon,
      onExpand,

      defaultExpandAllRows = false,

      // TODO: 未实现
      indentSize: _indentSize,

      showExpandColumn = true,
      expandedRowClassName,

      // TODO: 未实现
      childrenColumnName: _childrenColumnName,

      rowExpandable,
      columnWidth = 50,
      fixed,
    } = options || {}

    const _rowExpandableValue = useMemo(() => {
      return (dataSource ?? []).map((row) => {
        if (!rowExpandable) return false
        return rowExpandable(row as T)
      })
    }, [dataSource, rowExpandable])

    // useShallowMemo 每一次渲染时候都会重新求值，这对于某些开销较大的计算不太友好，
    // 所以使用 useMemo 求值再通过 useShallowMemo 浅比较
    // useMemo 标记 deps 后，若 deps 不变也就不需要重新求值
    // 使用 useShallowMemo 主要是为了防止重新求值后结果不变但地址指针变化，导致不必要的渲染
    const rowExpandableRecord = useShallowMemo(() => _rowExpandableValue)

    // 即使 defaultExpandAllRows 变更之后，此插件也不要响应变化，只使用初始值，所以存储一下
    const defaultExpandAll = useRef(
      // options 中有 expandedRowKeys 则表示受控模式，那么 defaultExpandAllRows 不生效
      'expandedRowKeys' in (options ?? {}) || 'defaultExpandedRowKeys' in (options ?? {})
        ? false
        : defaultExpandAllRows,
    )
    const defaultExpandKey = useShallowMemo((): readonly Key[] => {
      if (defaultExpandAll.current) {
        const expandKeys = (dataSource ?? []).map((record, index): Key | null => {
          if (rowExpandableRecord[index]) {
            const key = (record as AnyObject)[rowKey as string] as string | number
            return key
          }
          return null
        })
        return expandKeys.filter((x) => x != null)
      }
      return []
    })

    const expansionKeys = useRef(new Set<Key>(defaultExpandedRowKeys ?? defaultExpandKey))
    const [expansion = EMPTY_ARR, setExpansion] = useControllableValue<readonly Key[]>(
      options ?? {},
      {
        trigger: 'onExpandedRowsChange',
        valuePropName: 'expandedRowKeys',
        defaultValue: defaultExpandedRowKeys ?? defaultExpandKey,
      },
    )

    const onUpdateExpansion = useMemoizedFn((rowData: T, shouldExpand?: boolean) => {
      const key = (rowData as AnyObject)[rowKey as string]
      expansionKeys.current.add(key)
      if (shouldExpand == null) {
        if (expansion.includes(key)) {
          setExpansion(expansion.filter((x) => x !== key))
          onExpand?.(false, rowData)
        } else {
          setExpansion([...expansion, key])
          onExpand?.(true, rowData)
        }
      } else if (shouldExpand) {
        setExpansion([...expansion, key])
        onExpand?.(true, rowData)
      } else {
        setExpansion(expansion.filter((x) => x !== key))
        onExpand?.(false, rowData)
      }
    })

    const isFixed = isValidFixed(fixed)

    const renderRow: MiddlewareRender = useCallback((children, args) => {
      const { rowData, rowIndex } = args

      const isExpandable = rowExpandableRecord[rowIndex!]
      if (isExpandable) {
        const key = rowData[rowKey] as string | number
        const isExpanded: boolean | undefined = expansion.includes(key)
        const isRendered = expansionKeys.current.has(key)

        let className = ''
        if (typeof expandedRowClassName === 'string') {
          className = expandedRowClassName
        } else if (typeof expandedRowClassName === 'function') {
          className = expandedRowClassName(rowData, rowIndex!, 0)
        }

        return (
          <>
            {children}
            {isRendered
              ? (
                  <ExpandRow
                    className={className}
                    rowIndex={rowIndex!}
                    isExpanded={isExpanded}
                    colSpan={args.columns!.length}
                    fixed={isFixed}
                  >
                    {expandedRowRender?.(rowData, rowIndex!, 0, isExpanded)}
                  </ExpandRow>
                )
              : null}
          </>
        )
      }
      return children
    }, [
      isFixed,
      rowExpandableRecord,
      rowKey,
      expansion,
      expandedRowClassName,
      expandedRowRender,
    ])

    const columns = useMemo((): ColumnType<T>[] => {
      if (!showExpandColumn) {
        return rawColumns
      }

      return [
        {
          key: EXPANSION_COLUMN_KEY,
          title: columnTitle,
          width: columnWidth,
          fixed,
          render(_value, record, index) {
            const key = (record as AnyObject)[rowKey as string] as string | number

            const expandable = rowExpandableRecord[index] ?? false
            const expanded = expansion.includes(key) ?? false

            if (typeof expandIcon === 'function') {
              return expandIcon({
                expandable,
                expanded,
                record,
                prefixCls: 'virtual-table',
                onExpand: (rowData: T, _e) => {
                  onUpdateExpansion(rowData)
                },
              })
            }

            if (!expandable) {
              return null
            }

            return (
              <button
                className={clsx(
                  'virtual-table-row-expand-icon',
                  expanded
                    ? 'virtual-table-row-expand-icon-expanded'
                    : 'virtual-table-row-expand-icon-collapsed',
                )}
                type="button"
                aria-label={expanded ? '关闭行' : '展开行'}
                aria-expanded={expanded}
                onClick={() => {
                  onUpdateExpansion(record, !expanded)
                }}
              />
            )
          },
        },
        ...rawColumns,
      ]
    }, [
      showExpandColumn,
      columnTitle,
      columnWidth,
      fixed,
      rawColumns,
      rowKey,
      rowExpandableRecord,
      expansion,
      expandIcon,
      onUpdateExpansion,
    ])

    const onRow: OnRowType<T> = useCallback((record, index) => {
      if (rowExpandableRecord[index]) {
        return {
          onClick: (e) => {
            e.stopPropagation()
            onUpdateExpansion(record)
          },
        }
      }
      return {}
    }, [rowExpandableRecord, onUpdateExpansion])

    if (disablePlugin) {
      return ctx
    }

    return {
      ...ctx,
      columns,
      renderRow: disablePlugin ? undefined : renderRow,
      onRow: !expandRowByClick ? undefined : onRow,
    }
  },
)
