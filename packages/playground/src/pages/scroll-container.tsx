import type { ColumnType } from '@/components/table'
import type { MockData } from '@/utils/mock'

import type { FC } from 'react'
import VirtualTable from '@/components/table'
import { useAsyncData } from '@/utils/mock'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Input, InputNumber, Space } from 'antd'

const ScrollContainer: FC = () => {
  const [data, setData] = useAsyncData()

  const columns: ColumnType<MockData>[] = [
    {
      title: 'Index',
      dataIndex: 'key',
      width: 56,
      align: 'center',
      fixed: 'left',
      render(_value, _record, index) {
        return index
      },
    },
    {
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
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (value, _row, index) => {
        return (
          <Input
            value={value}
            onChange={(e) => {
              setData((prevState) => {
                const result = prevState.slice()
                result[index] = { ...result[index], name: e.currentTarget.value }
                return result
              })
            }}
          />
        )
      },
    },
    {
      title: 'Data1',
      dataIndex: 'data1',
      width: 200,
      render: (value, _row, index) => (
        <InputNumber
          className="w-full"
          value={value}
          onChange={(e) => {
            setData((prevState) => {
              const result = prevState.slice()
              result[index] = { ...result[index], data1: e }
              return result
            })
          }}
        />
      ),
    },
    {
      title: 'Data2',
      dataIndex: 'data2',
      width: 200,
      render: (value, _row, index) => (
        <InputNumber
          className="w-full"
          value={value}
          onChange={(e) => {
            setData((prevState) => {
              const result = prevState.slice()
              result[index] = { ...result[index], data2: e }
              return result
            })
          }}
        />
      ),
    },
    {
      title: 'Data3',
      dataIndex: 'data3',
      width: 200,
      render: (value, _row, index) => (
        <InputNumber
          className="w-full"
          value={value}
          onChange={(e) => {
            setData((prevState) => {
              const result = prevState.slice()
              result[index] = { ...result[index], data3: e }
              return result
            })
          }}
        />
      ),
    },
    {
      title: 'Data4',
      dataIndex: 'data4',
      width: 200,
      render: (value, _row, index) => (
        <Input
          value={value}
          onChange={(e) => {
            setData((prevState) => {
              const result = prevState.slice()
              result[index] = { ...result[index], data4: e.currentTarget.value }
              return result
            })
          }}
        />
      ),
    },
    {
      title: 'Data5',
      dataIndex: 'data5',
      width: 200,
      // fixed: 'right',
      render: (value, _row, index) => (
        <Input
          value={value}
          onChange={(e) => {
            setData((prevState) => {
              const result = prevState.slice()
              result[index] = { ...result[index], data5: e.currentTarget.value }
              return result
            })
          }}
        />
      ),
    },
    {
      title: 'Data6',
      dataIndex: 'data6',
      width: 200,
      // fixed: 'right',
      render: (value, _row, index) => (
        <Input
          value={value}
          onChange={(e) => {
            setData((prevState) => {
              const result = prevState.slice()
              result[index] = { ...result[index], data6: e.currentTarget.value }
              return result
            })
          }}
        />
      ),
    },
    {
      title: 'Data7',
      dataIndex: 'data7',
      width: 200,
      render: (value, _row, index) => (
        <Input
          value={value}
          onChange={(e) => {
            setData((prevState) => {
              const result = prevState.slice()
              result[index] = { ...result[index], data7: e.currentTarget.value }
              return result
            })
          }}
        />
      ),
    },
  ]

  return (
    <div style={{ padding: '0 12px' }}>
      <h2>滚动容器</h2>
      <h3>VirtualTable 会自行查找最近的滚动容器并实现虚拟列表</h3>
      <p style={{ marginBottom: 12 }}>
        Cell 中全部渲染组件，渲染压力提升，此时渲染不及时，容易白屏。Column
        数量也会影响性能
      </p>
      <div
        style={{
          boxSizing: 'border-box',
          height: 500,
          border: '1px solid #f00',
          overflow: 'auto',
          overscrollBehavior: 'contain',
        }}
      >
        <VirtualTable
          rowKey="key"
          dataSource={data}
          columns={columns}
          estimatedRowHeight={57}
          sticky
        />
      </div>
    </div>
  )
}

export default ScrollContainer
