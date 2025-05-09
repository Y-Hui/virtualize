import type { FC } from 'react'
import type { ColumnDescriptor } from './types'
import { memo } from 'react'
import { getColumnWidth } from './utils/get-width'

export interface ColgroupProps {
  columns: ColumnDescriptor[]
  defaultColumnWidth: number
}

const Colgroup: FC<ColgroupProps> = (props) => {
  const { columns, defaultColumnWidth } = props

  return (
    <colgroup>
      {columns.map((item) => {
        const { key } = item
        if (item.type === 'blank') {
          return <col key={key} className="blank" style={{ width: item.width }} />
        }
        const { column } = item
        const width = getColumnWidth(column, defaultColumnWidth)
        return (
          <col
            key={key}
            data-col-key={key}
            style={{
              width,
            }}
          />
        )
      })}
    </colgroup>
  )
}

export default memo(Colgroup)
