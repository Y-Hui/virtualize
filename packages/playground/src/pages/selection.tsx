import type { ColumnType } from '@/components/table'
import type { MockData } from '@/utils/mock'
import type { FC } from 'react'
import VirtualTable from '@/components/table'
import { createMockData } from '@/utils/mock'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Input, InputNumber, Space, Switch } from 'antd'
import { useEffect, useMemo, useState } from 'react'

const SelectionDemo: FC = () => {
  const [data, setData] = useState<MockData[]>([])
  const [current, setCurrent] = useState(1)

  useEffect(() => {
    setTimeout(() => {
      setData(createMockData('scroll'))
    }, 300)
  }, [])

  const [isRadio, setIsRadio] = useState(false)

  const isOnlyOneData = data.length === 1
  const columns = useMemo((): ColumnType<MockData>[] => {
    return [
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
                disabled={isOnlyOneData}
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
        render: (value: string, _row, index) => {
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
        render: (_, row, index) => (
          <InputNumber
            className="w-full"
            value={row.data1}
            onChange={(e) => {
              setData((prevState) => {
                const result = prevState.slice()
                result[index] = { ...result[index], data1: e ?? 0 }
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
        render: (value: number, _row, index) => (
          <InputNumber
            className="w-full"
            value={value}
            onChange={(e) => {
              setData((prevState) => {
                const result = prevState.slice()
                result[index] = { ...result[index], data2: e ?? 0 }
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
        render: (value: number, _row, index) => (
          <InputNumber
            className="w-full"
            value={value}
            onChange={(e) => {
              setData((prevState) => {
                const result = prevState.slice()
                result[index] = { ...result[index], data3: e ?? 0 }
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
        render: (value: string, _row, index) => (
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
        render: (value: string, _row, index) => (
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
    ]
  }, [isOnlyOneData, setData])

  return (
    <div style={{ padding: '0 12px' }}>
      <h2>选择</h2>
      <div style={{ display: 'inline-flex', alignItems: 'center', margin: '0 0 8px 0' }}>
        <Switch value={isRadio} onChange={setIsRadio} />
        &nbsp;单选模式
      </div>
      <VirtualTable
        rowKey="key"
        dataSource={data}
        columns={columns}
        estimatedRowHeight={49}
        estimatedColumnWidth={200}
        sticky
        rowSelection={{
          selections: true,
          fixed: true,
          type: isRadio ? 'radio' : 'checkbox',
          onChange(selectedRowKeys, selectedRows, info) {
            console.log({ selectedRowKeys, selectedRows, info })
          },
        }}
        onChange={(e) => {
          console.log(e)
        }}
        pagination={{
          className: 'footer',
          current,
          total: 2000,
          pageSize: 500,
          onChange(page) {
            setData([])
            setCurrent(page)
            setTimeout(() => {
              setData(createMockData(current.toString()))
            }, 0)
          },
        }}
      />
    </div>
  )
}

export default SelectionDemo
