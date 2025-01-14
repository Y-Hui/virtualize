import type { FC, Key } from 'react'
import type { ColumnType } from './types'

export interface ColgroupProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnType<any>[]
  colRef?: (instance: HTMLTableColElement | null, index: number) => void
}

const Colgroup: FC<ColgroupProps> = (props) => {
  const { columns, colRef } = props

  return (
    <colgroup>
      {columns.map((item, index) => {
        const key = 'key' in item ? (item.key as Key) : item.dataIndex
        return (
          <col
            key={typeof key === 'symbol' ? index : key}
            ref={
              typeof colRef === 'function'
                ? (instance) => { colRef(instance, index) }
                : colRef
            }
            style={{
              width: item.width,
              minWidth: item.minWidth,
            }}
          />
        )
      })}
    </colgroup>
  )
}

export default Colgroup
