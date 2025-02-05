import '@are-visual/virtual-table/styles/table.scss'
import '@are-visual/virtual-table/middleware/column-resize/styles.scss'
import '@are-visual/virtual-table/middleware/selection/styles.scss'
import '@are-visual/virtual-table/middleware/horizontal-scroll-bar/styles.scss'
import type { ColumnType } from '@are-visual/virtual-table'
import type { FC } from 'react'
import { useTablePipeline, VirtualTable } from '@are-visual/virtual-table'

import { horizontalScrollBar } from '@are-visual/virtual-table/middleware/horizontal-scroll-bar'
import { tableSelection } from '@are-visual/virtual-table/middleware/selection'

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
    render(_v, _record, i) {
      return `[${i}] Data(${i})`
    },
  }
})

const RowsAndColumns: FC = () => {
  const pipeline = useTablePipeline({
    use: [
      tableSelection({
        fixed: true,
      }),
      horizontalScrollBar(),
    ],
  })

  return (
    <>
      <VirtualTable
        className="virtual-table-small"
        style={{
          boxSizing: 'border-box',
          height: 500,
          width: 800,
          border: '1px solid #f00',
          overflow: 'auto',
          overscrollBehavior: 'contain',
        }}
        pipeline={pipeline}
        rowKey="key"
        dataSource={dataSource}
        columns={columns}
        estimatedRowHeight={39}
        estimatedColumnWidth={180}
        overscanColumns={3}
        stickyHeader
      />
      <br />
      <br />
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
        pipeline={pipeline}
        rowKey="key"
        dataSource={dataSource}
        columns={columns}
        estimatedRowHeight={39}
        estimatedColumnWidth={180}
        stickyHeader
      />
    </>
  )
}

export default RowsAndColumns
