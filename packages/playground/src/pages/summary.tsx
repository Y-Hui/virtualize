import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Input, InputNumber, Radio, Space } from 'antd'
import { type FC, useCallback, useMemo, useState } from 'react'
import VirtualTable, { type ColumnType } from 'virtual-table'

import { type MockData, useAsyncData } from '@/utils/mock'

const SummaryDemo: FC = () => {
  const [summaryPosition, setSummaryPosition] = useState<'bottom' | 'top'>('bottom')

  const [data, setData] = useAsyncData()

  const summary = useCallback(
    (_dataSource: readonly MockData[]) => {
      return (
        <VirtualTable.Summary fixed={summaryPosition}>
          <VirtualTable.Summary.Row>
            <VirtualTable.Summary.Cell index={0}>0</VirtualTable.Summary.Cell>
            <VirtualTable.Summary.Cell index={1}>1</VirtualTable.Summary.Cell>
            <VirtualTable.Summary.Cell index={2}>2</VirtualTable.Summary.Cell>
            <VirtualTable.Summary.Cell index={3}>3</VirtualTable.Summary.Cell>
            <VirtualTable.Summary.Cell index={4}>4</VirtualTable.Summary.Cell>
            <VirtualTable.Summary.Cell index={5}>5</VirtualTable.Summary.Cell>
            <VirtualTable.Summary.Cell index={6}>6</VirtualTable.Summary.Cell>
            <VirtualTable.Summary.Cell index={7}>7</VirtualTable.Summary.Cell>
            <VirtualTable.Summary.Cell index={8}>8</VirtualTable.Summary.Cell>
          </VirtualTable.Summary.Row>
        </VirtualTable.Summary>
      )
    },
    [summaryPosition],
  )

  const isOnlyOneData = data.length === 1
  const columns = useMemo((): ColumnType<MockData>[] => {
    return [
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
                // @ts-ignore
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
    ]
  }, [isOnlyOneData, setData])

  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          marginBottom: 30,
          display: 'grid',
          gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
        }}
      >
        <div>
          <label style={{ marginRight: 8 }} htmlFor="summaryPosition">
            总结栏位置
          </label>
          <Radio.Group
            id="summaryPosition"
            value={summaryPosition}
            onChange={(e) => setSummaryPosition(e.target.value)}
          >
            <Radio value="top">Top</Radio>
            <Radio value="bottom">Bottom</Radio>
          </Radio.Group>
        </div>
      </div>
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
          summary={summary}
          sticky
        />
      </div>
    </div>
  )
}

export default SummaryDemo
