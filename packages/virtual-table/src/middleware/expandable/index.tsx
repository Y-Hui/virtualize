/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  AnyObject,
  ColumnExtra,
  ColumnType,
  FixedType,
  MiddlewareContext,
  MiddlewareRenderRow,
  MiddlewareResult,
  OnRowType,
} from '@are-visual/virtual-table'
import type { Key, MouseEvent, ReactNode } from 'react'
import { createMiddleware, getRowKey, isValidFixed, useShallowMemo, useStableFn } from '@are-visual/virtual-table'
import { useControllableValue } from '@are-visual/virtual-table/middleware/utils/useControllableValue'
import clsx from 'clsx'
import { useCallback, useMemo, useRef } from 'react'
import ExpandRow, { ExpandRowHeightKey } from './expand-row'

type TriggerEventHandler<T> = (record: T, event: MouseEvent<HTMLElement>) => void
export interface RenderExpandIconProps<T> {
  prefixCls: string
  expanded: boolean
  record: T
  expandable: boolean
  onExpand: TriggerEventHandler<T>
}
export type RowClassName<T> = (record: T, index: number, indent: number) => string
export type RenderExpandIcon<T> = (props: RenderExpandIconProps<T>) => ReactNode
export type ExpandedRowRender<T> = (record: T, index: number, indent: number, expanded: boolean) => ReactNode

export interface ExpandableConfig<T> {
  expandedRowKeys?: readonly Key[]
  defaultExpandedRowKeys?: readonly Key[]
  expandedRowRender?: ExpandedRowRender<T>
  columnTitle?: ReactNode
  expandRowByClick?: boolean
  expandIcon?: RenderExpandIcon<T>
  onExpand?: (expanded: boolean, record: T) => void
  onExpandedRowsChange?: (expandedKeys: readonly Key[]) => void
  defaultExpandAllRows?: boolean
  showExpandColumn?: boolean
  expandedRowClassName?: string | RowClassName<T>
  rowExpandable?: (record: T) => boolean
  columnWidth?: number | string
  fixed?: FixedType
  extraColumnProps?: ColumnExtra
}

export { ExpandRowHeightKey }
export const EXPANSION_COLUMN_KEY = 'VirtualTable.EXPANSION_COLUMN'

export function isExpansionColumn<T = any>(column: ColumnType<T>) {
  return column.key === EXPANSION_COLUMN_KEY
}

function useTableExpandable<T = any>(
  ctx: MiddlewareContext<T>,
  options?: ExpandableConfig<T>,
): MiddlewareResult<T> {
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
    // indentSize: _indentSize,

    showExpandColumn = true,
    expandedRowClassName,

    rowExpandable,
    columnWidth = 50,
    fixed,
    extraColumnProps,
  } = options ?? {}

  const _rowExpandableValue = useMemo(() => {
    return dataSource.map((row) => {
      if (!rowExpandable) return false
      return rowExpandable(row)
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
      const expandKeys = dataSource.map((record, index): Key | null => {
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
  const [expansion, setExpansion] = useControllableValue<readonly Key[]>(
    options ?? {},
    {
      trigger: 'onExpandedRowsChange',
      valuePropName: 'expandedRowKeys',
      defaultValue: defaultExpandedRowKeys ?? defaultExpandKey,
    },
  )

  const onUpdateExpansion = useStableFn((rowData: T, shouldExpand?: boolean) => {
    const key = getRowKey(rowData, rowKey)
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

  const renderRow: MiddlewareRenderRow = useCallback((children, args) => {
    const { rowData, rowIndex, rowKey: key, columnDescriptor } = args

    const isExpandable = rowExpandableRecord[rowIndex]
    if (isExpandable) {
      const isExpanded: boolean | undefined = expansion.includes(key)
      const isRendered = expansionKeys.current.has(key)

      let className = ''
      if (typeof expandedRowClassName === 'string') {
        className = expandedRowClassName
      } else if (typeof expandedRowClassName === 'function') {
        className = expandedRowClassName(rowData as T, rowIndex, 0)
      }

      return (
        <>
          {children}
          {isRendered && (
            <ExpandRow
              className={className}
              rowKey={key}
              isExpanded={isExpanded}
              colSpan={columnDescriptor.length}
              fixed={isFixed}
            >
              {expandedRowRender?.(rowData as T, rowIndex, 0, isExpanded)}
            </ExpandRow>
          )}
        </>
      )
    }
    return children
  }, [
    isFixed,
    rowExpandableRecord,
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
        ...extraColumnProps,
        key: EXPANSION_COLUMN_KEY,
        title: columnTitle,
        width: columnWidth,
        fixed,
        render(_value, record, index) {
          const key = getRowKey(record, rowKey)

          const expandable = rowExpandableRecord[index] ?? false
          const expanded = expansion.includes(key)

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
        onHeaderCell() {
          return { className: 'virtual-table-expand-column' }
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
    extraColumnProps,
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
    renderRow,
    onRow: !expandRowByClick ? undefined : onRow,
  }
}

export const tableExpandable = createMiddleware(useTableExpandable)
