import type { MockData } from '@/utils/mock'
import type { ColumnType } from '@are-visual/virtual-table'
import type { FC } from 'react'
import VirtualTable from '@/components/table'
import { useAsyncData } from '@/utils/mock'
import { Input } from 'antd'

const columnSizes = [60, 90, 200, 200, 150, 200, 240, 200, 250, 150, 150, 150, 150, 150, 150, 150, 150, 200, 150, 150, 150, 200, 150, 150, 200, 200, 200, 200, 150, 200, 200, 200, 200, 200]

const Tab2: FC = () => {
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

  const [data] = useAsyncData()

  return (
    <>
      <VirtualTable
        style={{ paddingBottom: 50 }}
        debugKey="demo222"
        rowKey="key"
        dataSource={data}
        columns={columns}
        estimatedRowHeight={39}
        estimatedColumnWidth={180}
        sticky
        scrollBarBottom={50}
        loading={data.length === 0}
        pagination={false}
        expandable={{
          fixed: 'left',
          columnWidth: 48,
          defaultExpandedRowKeys: ['-key:1', '-key:2'],
          expandedRowRender: () => (
            <>
              {Array.from({ length: 10 }).map((_v, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </>
          ),
          rowExpandable: () => true,
        }}
      />
      <footer className="complex-footer">Footer</footer>
    </>
  )
}

export default Tab2
