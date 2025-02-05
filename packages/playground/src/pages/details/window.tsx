import '@are-visual/virtual-table/styles/table.scss'
import '@are-visual/virtual-table/middleware/horizontal-scroll-bar/styles.scss'
import type { ColumnType } from '@are-visual/virtual-table'
import type { FC } from 'react'
import { useTablePipeline, VirtualTable } from '@are-visual/virtual-table'
import { horizontalScrollBar } from '@are-visual/virtual-table/middleware/horizontal-scroll-bar'

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

const WindowScroll: FC = () => {
  const pipeline = useTablePipeline({
    use: [horizontalScrollBar()],
  })

  return (
    <VirtualTable
      rowKey="key"
      pipeline={pipeline}
      dataSource={dataSource}
      columns={columns}
      estimatedRowHeight={39}
      estimatedColumnWidth={180}
      stickyHeader={40}
    />
  )
}

export default WindowScroll
