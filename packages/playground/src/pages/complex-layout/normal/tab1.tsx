import type { MockData } from '@/utils/mock'
import type { ColumnType } from '@are-visual/virtual-table'
import type { FC } from 'react'
import VirtualTable from '@/components/table'
import { useAsyncData } from '@/utils/mock'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Input, Space } from 'antd'

const columnSizes = [60, 90, 200, 200, 150, 200, 240, 200, 250, 150, 150, 150, 150, 150, 150, 150, 150, 200, 150, 150, 150, 200, 150, 150, 200, 200, 200, 200, 150, 200, 200, 200, 200, 200]

const Tab1: FC = () => {
  const [data, setData] = useAsyncData()

  const columns = columnSizes.map((width, index): ColumnType<MockData> => {
    if (index === 0) {
      return {
        title: '',
        key: 'prefix-action',
        width: 80,
        fixed: 'left',
        render(_record, _, index) {
          return (
            <Space>
              <Button
                icon={<PlusOutlined />}
                size="small"
                shape="circle"
                color="primary"
                variant="outlined"
                onClick={() => {
                  setData((prevState) => {
                    const result = prevState.slice()
                    result.splice(index + 1, 0, {
                      key: `key:${Date.now()}`,
                    })
                    return result
                  })
                }}
              />
              <Button
                icon={<MinusOutlined />}
                size="small"
                shape="circle"
                danger
                disabled={data.length === 1}
                onClick={() => {
                  setData((prevState) => {
                    const result = prevState.slice()
                    result.splice(index, 1)
                    return result
                  })
                }}
              />
            </Space>
          )
        },
      }
    }
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

  return (
    <>
      <VirtualTable
        style={{ paddingBottom: 50 }}
        debugKey="demo1"
        rowKey="key"
        dataSource={data}
        columns={columns}
        estimatedRowHeight={39}
        estimatedColumnWidth={180}
        sticky
        loading={data.length === 0}
        pagination={false}
        scrollBarBottom={50}
        expandable={{
          fixed: 'left',
          columnWidth: 48,
          defaultExpandedRowKeys: ['-key:0'],
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

export default Tab1
