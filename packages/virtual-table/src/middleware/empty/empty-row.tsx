import { Empty } from 'antd'
import type { FC } from 'react'

import { useContainerSize } from '../../core'

export interface EmptyRowProps {
  colSpan: number
}

const EmptyRow: FC<EmptyRowProps> = (props) => {
  const { colSpan } = props
  const { width } = useContainerSize()

  return (
    <tr>
      <td colSpan={colSpan}>
        <div
          style={{
            boxSizing: 'border-box',
            position: 'sticky',
            left: 0,
            top: 0,
            padding: 16,
            width: width <= 0 ? undefined : width,
          }}
        >
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      </td>
    </tr>
  )
}

export default EmptyRow
