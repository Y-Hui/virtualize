/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnType, MiddlewareContext, MiddlewareRenderHeaderCell, MiddlewareResult } from '@are-visual/virtual-table'
import type { Key } from 'react'
import { createMiddleware, getKey } from '@are-visual/virtual-table'
import { isValidElement, useCallback, useMemo, useState } from 'react'
import { Resizable } from 'react-resizable'

declare module '@are-visual/virtual-table' {
  interface ColumnExtra {
    disableResize?: boolean
    /** Resize 时限制最大列宽 */
    maxWidth?: number
  }
}

type Constraint<T> = number | ((column: ColumnType<T>) => (number | undefined | null))

export interface ResizeOptions<T = any> {
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
      const result = JSON.parse(raw)
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
  const { storageKey, min, max } = args ?? {}
  const { columns: rawColumns } = ctx
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
    const { column, columnWidths } = options

    if (column.disableResize) {
      return children
    }

    const key = getKey(column)

    const width = Number.isFinite(column.width) ? (column.width as number) : (columnWidths.get(key) ?? 0)

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
  }, [handleResize, max, min])

  const columns = useMemo(() => {
    return rawColumns.map((column) => {
      const key = getKey(column).toString()
      const width = columnWidths[key] as number | undefined
      if (width != null && width !== column.width) {
        return { ...column, width }
      }
      return column
    })
  }, [columnWidths, rawColumns])

  return { ...ctx, columns, renderHeaderCell }
}

export const columnResize = createMiddleware(useColumnResize)
