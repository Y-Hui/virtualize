import type { MockData } from '@/utils/mock'
import type { ColumnType } from '@are-visual/virtual-table'
import type { FC } from 'react'
import VirtualTable from '@/components/table'
import { useAsyncData } from '@/utils/mock'
import { Input } from 'antd'

const columnSizes = [60, 90, 200, 200, 150, 200, 240, 200, 250, 150, 150, 150, 150, 150, 150, 150, 150, 200, 150, 150, 150, 200, 150, 150, 200, 200, 200, 200, 150, 200, 200, 200, 200, 200]
const columns = columnSizes.map((width, index): ColumnType<MockData> => {
  return {
    fixed: [0, 1, 2].includes(index) ? 'left' : undefined,
    dataIndex: `data${index}`,
    title: <span>{`Data${index}`}</span>,
    width,
    render(_v, _record, i) {
      return (
        <Input defaultValue={`[${i}] Data(${index})`} />
      )
    },
  }
})

const Tab2: FC = () => {
  const [data] = useAsyncData()

  return (
    <>
      <div style={{ height: 600, overflowY: 'auto', marginBottom: 50 }}>
        <VirtualTable
          rowKey="key"
          dataSource={data}
          columns={columns}
          estimatedRowHeight={39}
          estimatedColumnWidth={100}
          scrollBarBottom={50}
          sticky
        />
        <footer className="complex-footer" style={{ position: 'sticky', padding: 0 }}>Footer</footer>
      </div>
    </>
  )
}

export default Tab2
