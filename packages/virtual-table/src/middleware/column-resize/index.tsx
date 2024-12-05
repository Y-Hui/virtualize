import 'react-resizable/css/styles.css'

import { useCallback, useMemo, useState } from 'react'
import { Resizable } from 'react-resizable'

import { type Middleware, type MiddlewareRender } from '../../types'

declare module '../../types' {
  interface ColumnExtra {
    disableResize?: boolean
  }
}

interface ResizeOptions {
  storageKey: string
}

const resizeStorage = {
  key(storageKey: string) {
    return `${storageKey}_resize`
  },
  get(storageKey: string) {
    try {
      const raw = window.localStorage.getItem(resizeStorage.key(storageKey)) || '{}'
      const result = JSON.parse(raw)
      Object.entries(result).forEach(([k, v]) => {
        if (!Number.isFinite(v)) {
          delete result[k]
        }
      })
      return result
    } catch (_err) {
      return {}
    }
  },
  set(storageKey: string, value: Record<string, number>) {
    window.localStorage.setItem(resizeStorage.key(storageKey), JSON.stringify(value))
  },
}

export function columnResize<T>(args?: ResizeOptions): Middleware<T> {
  return function useColumnResize(ctx) {
    const { storageKey } = args ?? {}
    const { columns: rawColumns } = ctx
    const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() => {
      if (storageKey == null) {
        return {}
      }
      return resizeStorage.get(storageKey)
    })

    const handleResize = useCallback(
      (columnKey: string, newWidth: number) => {
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
      },
      [storageKey],
    )

    const renderHeaderCell: MiddlewareRender = useCallback(
      (children, options) => {
        const { column, columnIndex = 0, columnWidthList = [] } = options

        if (column?.disableResize) {
          return children
        }

        const key =
          'key' in column! ? (column.key as string) : (column!.dataIndex as string)

        let width = column?.width

        if (typeof width === 'string') {
          width = columnWidthList[columnIndex]
        }

        return (
          <Resizable
            width={width ?? 0}
            height={47}
            handle={
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
            }
            onResize={(_e, { size }) => handleResize(key, size.width)}
          >
            {children}
          </Resizable>
        )
      },
      [handleResize],
    )

    const columns = useMemo(() => {
      return rawColumns.map((column) => {
        const key =
          'key' in column! ? (column.key as string) : (column.dataIndex as string)
        const width = columnWidths?.[key]
        if (width != null && width !== column.width) {
          return { ...column, width }
        }
        return column
      })
    }, [columnWidths, rawColumns])

    return { ...ctx, columns, renderHeaderCell }
  }
}
