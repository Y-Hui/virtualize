import type { ColumnType } from '@/components/table'
import type { MockStringData } from '@/utils/mock'

import type { FC } from 'react'
import VirtualTable from '@/components/table'
import { useAsyncPureStringData } from '@/utils/mock'

const columns: ColumnType<MockStringData>[] = [
  {
    title: 'Key',
    dataIndex: 'key',
    width: 100,
    align: 'center',
  },
  {
    title: 'Text',
    dataIndex: 'text',
    width: 200,
    align: 'center',
  },
  ...Array.from({ length: 6 }, (_, index): ColumnType<MockStringData> => {
    return {
      title: `Text${2 + index}`,
      dataIndex: `text${2 + index}`,
      width: 200,
      align: 'center',
    }
  }),
]

const DefaultDemo: FC = () => {
  const [data] = useAsyncPureStringData()

  return (
    <div style={{ padding: '0 12px' }}>
      <h2>纯文本</h2>
      <h3>性能够好，但是对于实际场景没很大意义 😅</h3>
      <p>此处没有滚动容器，滚动容器为 window</p>
      <p style={{ marginBottom: 12 }}>
        VirtualTable 动态计算行高，你只需要传入一个预估高度（estimatedRowHeight）
      </p>
      <VirtualTable
        rowKey="key"
        dataSource={data}
        columns={columns}
        estimatedRowHeight={100}
      />
    </div>
  )
}

export default DefaultDemo
