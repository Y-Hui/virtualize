/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MiddlewareContext, MiddlewareRenderHeaderCell, MiddlewareResult } from '@are-visual/virtual-table'
import { createMiddleware } from '@are-visual/virtual-table'
import { isValidElement, useCallback, useMemo, useState } from 'react'
import { Resizable } from 'react-resizable'

declare module '@are-visual/virtual-table' {
  interface ColumnExtra {
    disableResize?: boolean
  }
}

interface ResizeOptions {
  storageKey: string
}

function isObject(obj: unknown): obj is Record<string, unknown> {
  return typeof obj === 'object' && obj != null
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
  args?: ResizeOptions,
): MiddlewareResult<T> {
  const { storageKey } = args ?? {}
  const { columns: rawColumns } = ctx
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() => {
    if (storageKey == null) {
      return {}
    }
    return resizeStorage.get(storageKey)
  })

  const handleResize = useCallback((columnKey: string, newWidth: number) => {
    const newWidths = Math.min(1000, Math.max(100, newWidth))
    setColumnWidths((prevState) => {
      const result = {
        ...prevState,
        [columnKey]: newWidths,
      }
      if (storageKey != null) {
        resizeStorage.set(storageKey, result)
      }
      return result
    })
  }, [storageKey])

  const renderHeaderCell: MiddlewareRenderHeaderCell = useCallback((children, options) => {
    const { column, columnIndex = 0, columnWidthList = [] } = options

    if (column.disableResize) {
      return children
    }

    const key = 'key' in column ? (column.key as string) : (column.dataIndex as string)

    let { width } = column

    if (typeof width === 'string') {
      width = columnWidthList[columnIndex]
    }

    if (__DEV__) {
      if (isValidElement(children) && children.type === Resizable) {
        throw new Error('The columnResize plugin was registered multiple times.')
      }
    }

    return (
      <Resizable
        width={width ?? 0}
        height={47}
        handle={(
          <div
            className="resize-handle"
            style={{
              width: 10,
              position: 'absolute',
              right: 0,
              top: 0,
              height: '100%',
              cursor: 'col-resize',
            }}
          />
        )}
        onResize={(_e, { size }) => { handleResize(key, size.width) }}
      >
        {children}
      </Resizable>
    )
  }, [handleResize])

  const columns = useMemo(() => {
    return rawColumns.map((column) => {
      const key = 'key' in column ? (column.key as string) : (column.dataIndex as string)
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
