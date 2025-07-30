/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnType, MiddlewareContext, MiddlewareRenderHeaderCell, MiddlewareResult } from '@are-visual/virtual-table'
import type { Key } from 'react'
import { createMiddleware, getColumnWidth, getKey, isValidFixedRight } from '@are-visual/virtual-table'
import { isValidElement, useCallback, useMemo, useState } from 'react'
import { Resizable } from 'react-resizable'

declare module '@are-visual/virtual-table' {
  interface ColumnExtra {
    disableResize?: boolean
    /** Resize 时限制最小列宽 */
    minWidth?: number
    /** Resize 时限制最大列宽 */
    maxWidth?: number
  }
}

type Constraint<T> = number | ((column: ColumnType<T>) => (number | undefined | null))

export interface ResizeOptions<T = any> {
  /** 当column 设置的width小于容器width的时候， 是否使用空白列作为占位 */
  usePlaceholderWhenWidthLTContainerWidth?: boolean
  storageKey: string
  min?: Constraint<T>
  max?: Constraint<T>
}

function isObject(obj: unknown): obj is Record<string, unknown> {
  return typeof obj === 'object' && obj != null
}

function getValue<T, Args>(maybeValue: T | ((args: Args) => T), args: Args): T {
  if (typeof maybeValue === 'function') {
    return (maybeValue as (args: Args) => T)(args)
  }
  return maybeValue
}

function getConstraintValue<T>(
  constraint: Constraint<T> | undefined,
  column: ColumnType<T>,
): [width: number, height: number] | undefined {
  if (constraint == null) return undefined
  const result = getValue(constraint, column)
  if (result == null) {
    return undefined
  }
  return [result, 0]
}

const resizeStorage = {
  key(storageKey: string) {
    return `${storageKey}_resize`
  },
  get(storageKey: string): Record<string, number> {
    try {
      const raw = window.localStorage.getItem(resizeStorage.key(storageKey)) ?? '{}'
      const result: unknown = JSON.parse(raw)
      if (isObject(result)) {
        Object.entries(result).forEach(([k, v]) => {
          if (!Number.isFinite(v)) {
            delete result[k]
          }
        })
        return result as Record<string, number>
      }
      return {}
    } catch (_err) {
      return {}
    }
  },
  set(storageKey: string, value: Record<string, number>) {
    window.localStorage.setItem(resizeStorage.key(storageKey), JSON.stringify(value))
  },
}

function useColumnResize<T = any>(
  ctx: MiddlewareContext<T>,
  args?: ResizeOptions<T>,
): MiddlewareResult<T> {
  const { storageKey, min, max, usePlaceholderWhenWidthLTContainerWidth = true } = args ?? {}
  const { columns: rawColumns, instance } = ctx
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() => {
    if (storageKey == null) {
      return {}
    }
    return resizeStorage.get(storageKey)
  })

  const handleResize = useCallback((columnKey: Key, newWidth: number) => {
    setColumnWidths((prevState) => {
      const result = {
        ...prevState,
        [`${columnKey}`]: newWidth,
      }
      if (storageKey != null) {
        resizeStorage.set(storageKey, result)
      }
      return result
    })
  }, [storageKey])

  const renderHeaderCell: MiddlewareRenderHeaderCell<T> = useCallback((children, options) => {
    const { column } = options
    if (column.disableResize) {
      return children
    }

    const key = getKey(column)
    const width = getColumnWidth(column, instance.getCurrentProps().defaultColumnWidth)

    if (__DEV__) {
      if (isValidElement(children) && children.type === Resizable) {
        throw new Error('The columnResize plugin was registered multiple times.')
      }
    }

    return (
      <Resizable
        width={width}
        axis="x"
        minConstraints={getConstraintValue(column.minWidth ?? min, column)}
        maxConstraints={getConstraintValue(column.maxWidth ?? max, column)}
        handle={(
          <div className="virtual-table-column-resize-handle" />
        )}
        onResize={(_e, { size }) => {
          handleResize(key, size.width)
        }}
      >
        {children}
      </Resizable>
    )
  }, [handleResize, instance, max, min])

  const columns = useMemo(() => {
    let totalWidth = rawColumns.reduce((total, column) => {
      const key = getKey(column).toString()
      const width = columnWidths[key] || (column.width ?? 0) || 0
      total += width
      return total
    }, 0)
    const rect = ctx.headerWrapperRef.current?.getBoundingClientRect()
    let result = rawColumns
    if (usePlaceholderWhenWidthLTContainerWidth && ((rect?.width) != null) && totalWidth < rect.width) {
      const rightFixedIndex = rawColumns.findIndex((column) => isValidFixedRight(column.fixed))
      const placeholder = { key: '__placeholder__', dataIndex: '__placeholder__', disableResize: true, width: rect.width - totalWidth }
      if (rightFixedIndex === -1) {
        result = [...rawColumns, placeholder]
      } else {
        result = [
          ...rawColumns.slice(0, rightFixedIndex),
          placeholder,
          ...rawColumns.slice(rightFixedIndex),
        ]
      }
    }

    return result.map((column) => {
      const key = getKey(column).toString()
      const width = columnWidths[key] as number | undefined
      if (width != null && width !== column.width && column.key !== '__placeholder__') {
        return { ...column, width }
      }
      return column
    })
  }, [columnWidths, rawColumns, ctx, usePlaceholderWhenWidthLTContainerWidth])

  return { ...ctx, columns, renderHeaderCell }
}

export const columnResize = createMiddleware(useColumnResize)
