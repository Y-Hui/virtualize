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

const Tab1: FC = () => {
  const [data] = useAsyncData()

  return (
    <>
      <VirtualTable
        style={{ paddingBottom: 50 }}
        rowKey="key"
        dataSource={data}
        columns={columns}
        estimatedRowHeight={39}
        estimatedColumnWidth={180}
        sticky
        scrollBarBottom={50}
      />
      <div
        style={{
          marginBottom: 80,
          height: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: 50,
          backgroundColor: '#f1f1f1',
          borderRadius: 10,
        }}
      >
        ANOTHER CONTENT
      </div>
      <footer className="complex-footer">Footer</footer>
    </>
  )
}

export default Tab1
