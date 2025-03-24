import type { MockData } from '@/utils/mock'
import type { ColumnType } from '@are-visual/virtual-table'
import type { FC } from 'react'
import VirtualTable from '@/components/table'
import { useAsyncData } from '@/utils/mock'
import { Input } from 'antd'

const size = 1000

const columns = Array.from({ length: size }, (_, index): ColumnType<MockData> => {
  return {
    fixed: [0].includes(index) ? 'left' : [size - 1].includes(index) ? 'right' : undefined,
    dataIndex: `data${index}`,
    title: `Data${index}`,
    width: 180,
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
      <footer className="complex-footer">Footer</footer>
    </>
  )
}

export default Tab1
