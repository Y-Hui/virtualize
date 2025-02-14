import type { FC } from 'react'
import { Radio } from 'antd'

export interface ActionAreaProps {
  dataCount: number
  onDataCountChange?: (count: number) => void

  columnCount: number
  onColumnCountChange?: (count: number) => void
}

const ActionArea: FC<ActionAreaProps> = (props) => {
  const { dataCount, onDataCountChange, columnCount, onColumnCountChange } = props

  return (
    <div className="action-area">
      <div className="action-area-section">
        <h3 className="action-area-label">Data count</h3>
        <Radio.Group
          value={dataCount}
          onChange={(e) => {
            const nextCount: number = e.target.value
            onDataCountChange?.(nextCount)
          }}
        >
          <Radio value={100}>100 items</Radio>
          <Radio value={500}>500 items</Radio>
          <Radio value={1000}>1000 items</Radio>
        </Radio.Group>
      </div>
      <div className="action-area-section">
        <h3 className="action-area-label">Column count</h3>
        <Radio.Group
          value={columnCount}
          onChange={(e) => {
            const nextCount: number = e.target.value
            onColumnCountChange?.(nextCount)
          }}
        >
          <Radio value={10}>10 items</Radio>
          <Radio value={100}>100 items</Radio>
          <Radio value={500}>500 items</Radio>
          <Radio value={1000}>1000 items</Radio>
        </Radio.Group>
      </div>
    </div>
  )
}

export default ActionArea
