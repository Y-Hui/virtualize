import '@are-visual/virtual-table/styles/table.scss'
import '@are-visual/virtual-table/middleware/column-resize/styles.scss'
import '@are-visual/virtual-table/middleware/selection/styles.scss'
import '@are-visual/virtual-table/middleware/horizontal-scroll-bar/styles.scss'
import type { ColumnType } from '@are-visual/virtual-table'
import type { FC } from 'react'
import { VirtualTable } from '@are-visual/virtual-table'
import { Input } from 'antd'

const size = 1000

const dataSource = Array.from({ length: size }, (_, index) => {
  return { key: index.toString() }
})

const columns = Array.from({ length: size }, (_, index): ColumnType<Record<string, string>> => {
  return {
    fixed: [0].includes(index) ? 'left' : [size - 1].includes(index) ? 'right' : undefined,
    dataIndex: `data${index}`,
    title: `Data${index}`,
    width: 180,
    render(_val, record) {
      return <Input defaultValue={record.key} />
    },
  }
})

const ContainerScroll: FC = () => {
  return (
    <VirtualTable
      className="virtual-table-small"
      style={{
        boxSizing: 'border-box',
        height: 500,
        width: '100%',
        border: '1px solid #f00',
        overflow: 'auto',
        overscrollBehavior: 'contain',
      }}
      rowKey="key"
      dataSource={dataSource}
      columns={columns}
      estimatedRowHeight={49}
      estimatedColumnWidth={180}
      stickyHeader
    />
  )
}

export default ContainerScroll
