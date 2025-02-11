import './style.scss'

import type { AnyObject, ColumnType } from './types'
import { getKey } from './utils/get-key'

export interface VirtualTableProps<T> {
  rowKey: keyof T | (string & {})
  columns: ColumnType<T>[]
  dataSource?: T[]
}

function getTableCellContent<T extends AnyObject>(
  index: number,
  data: T,
  column: ColumnType<any>,
) {
  const { render } = column
  const rowData = data as AnyObject
  if ('dataIndex' in column) {
    const dataIndex = column.dataIndex as string
    if (typeof render !== 'function') {
      return String(rowData[dataIndex])
    }
    return render(rowData[dataIndex], data, index)
  }
  return render?.(data, data, index) ?? null
}

function VirtualTable<T>(props: VirtualTableProps<T>) {
  const { rowKey, dataSource, columns } = props

  return (
    <table className="virtual-table" data-step="0">
      <colgroup>
        {columns.map((column, columnIndex) => {
          const key = getKey(column)
          return (
            <col
              key={typeof key === 'symbol' ? columnIndex : key}
              style={{ width: column.width, minWidth: column.minWidth }}
            />
          )
        })}
      </colgroup>
      <thead className="virtual-table-header">
        <tr>
          {columns.map((column, columnIndex) => {
            const key = getKey(column)
            return (
              <td
                className="virtual-table-header-cell"
                key={typeof key === 'symbol' ? columnIndex : key}
              >
                {column.title}
              </td>
            )
          })}
        </tr>
      </thead>
      <tbody className="virtual-table-body">
        {dataSource?.map((e, rowIndex) => {
          const rowData = e as AnyObject
          const key = rowData[rowKey as string]
          return (
            <tr key={key}>
              {columns.map((column, columnIndex) => {
                const columnKey = getKey(column)
                return (
                  <td
                    key={typeof columnKey === 'symbol' ? columnIndex : columnKey}
                    className="virtual-table-cell"
                  >
                    {getTableCellContent(rowIndex, rowData, column)}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default VirtualTable
