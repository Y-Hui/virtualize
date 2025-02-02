import type { MockData } from '@/utils/mock'
import type { TableColumnType } from 'antd'
import type { TableRowSelection } from 'antd/es/table/interface'

import type { FC } from 'react'
import { useSyncData } from '@/utils/mock'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Input, InputNumber, Space, Switch, Table } from 'antd'
import { useMemo, useState } from 'react'

const AntdDemo: FC = () => {
  const [data, setData] = useSyncData()
  // const [data, setData] = useAsyncData()
  const [isRadio, setIsRadio] = useState(false)

  const columns = useMemo(() => {
    return [
      {
        title: 'Index',
        dataIndex: 'key',
        width: 56,
        className: 'foo',
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
        hidden: true,
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
                // disabled={isOnlyOneData}
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
        fixed: 'right',
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
        fixed: 'right',
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
    ] satisfies TableColumnType<MockData>[]
  }, [setData])

  const rowSelection = useMemo(() => {
    return {
      selections: true,
      type: isRadio ? 'radio' : 'checkbox',
      onChange(selectedRowKeys, selectedRows, info) {
        console.log({ selectedRowKeys, selectedRows, info })
      },
      onSelect(record, selected, selectedRows, nativeEvent) {
        console.log({ record, selected, selectedRows, nativeEvent })
      },
    } satisfies TableRowSelection
  }, [isRadio])
  // const [expanded, setExpanded] = useState<Key[]>([])
  const [, setFlag] = useState(false)

  return (
    <div style={{ padding: '0 12px' }}>
      <h2
        onClick={() => {
          setFlag((x) => !x)
        }}
      >
        Antd
      </h2>
      <div style={{ display: 'inline-flex', alignItems: 'center', margin: '0 0 8px 0' }}>
        <Switch value={isRadio} onChange={setIsRadio} />
        &nbsp;单选模式
      </div>
      <Table
        rowKey="key"
        dataSource={data.slice(0, 100)}
        columns={columns}
        sticky
        rowSelection={rowSelection}
        size="middle"
        pagination={{ total: 100 }}
        scroll={{ x: 1000 }}
        // bordered
        expandable={{
          fixed: 'right',
          // defaultExpandAllRows: true,
          expandedRowRender(record) {
            return record.name
          },
          rowExpandable() {
            return true
          },
        }}
        onChange={(pagination) => {
          console.log(pagination)
        }}
        summary={() => {
          return (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>0</Table.Summary.Cell>
                <Table.Summary.Cell index={1}>1</Table.Summary.Cell>
                <Table.Summary.Cell index={2}>2</Table.Summary.Cell>
                <Table.Summary.Cell index={3}>3</Table.Summary.Cell>
                <Table.Summary.Cell index={4}>4</Table.Summary.Cell>
                <Table.Summary.Cell index={5}>5</Table.Summary.Cell>
                <Table.Summary.Cell index={6}>6</Table.Summary.Cell>
                <Table.Summary.Cell index={7}>7</Table.Summary.Cell>
                <Table.Summary.Cell index={8}>8</Table.Summary.Cell>
                <Table.Summary.Cell index={9}>9</Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )
        }}
      />
    </div>
  )
}

export default AntdDemo
