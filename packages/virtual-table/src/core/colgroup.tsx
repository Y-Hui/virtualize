/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FC } from 'react'
import type { ColumnDescriptor, ColumnType } from './types'

export interface ColgroupProps {
  columns: ColumnDescriptor[]
  colRef?: (instance: HTMLTableColElement | null, column: ColumnType<any>, index: number) => void
}

const Colgroup: FC<ColgroupProps> = (props) => {
  const { columns, colRef } = props

  return (
    <colgroup>
      {columns.map((item, index) => {
        const { key } = item
        if (item.type === 'blank') {
          return <col key={key} style={{ width: item.width }} />
        }

        const { column } = item

        return (
          <col
            key={key}
            ref={
              typeof colRef === 'function'
                ? (instance) => { colRef(instance, column, index) }
                : colRef
            }
            style={{
              width: column.width,
              minWidth: column.minWidth,
            }}
          />
        )
      })}
    </colgroup>
  )
}

export default Colgroup
