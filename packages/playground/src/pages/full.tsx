import '@are-visual/virtual-table/styles/table.scss'
import '@are-visual/virtual-table/middleware/column-resize/styles.scss'
import '@are-visual/virtual-table/middleware/expandable/styles.scss'
import '@are-visual/virtual-table/middleware/horizontal-scroll-bar/styles.scss'
import '@are-visual/virtual-table/middleware/loading/styles.scss'
import '@are-visual/virtual-table/middleware/selection/styles.scss'
import '@are-visual/virtual-table/middleware/summary/styles.scss'

import type { MockData } from '@/utils/mock'
import type { ColumnType } from '@are-visual/virtual-table'
import type { SelectionProps } from '@are-visual/virtual-table/middleware/selection'
import type { FC } from 'react'
import { useAsyncData } from '@/utils/mock'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { useTablePipeline, VirtualTable } from '@are-visual/virtual-table'
import { columnResize } from '@are-visual/virtual-table/middleware/column-resize'
import { tableEmpty } from '@are-visual/virtual-table/middleware/empty'
import { tableExpandable } from '@are-visual/virtual-table/middleware/expandable'
import { horizontalScrollBar } from '@are-visual/virtual-table/middleware/horizontal-scroll-bar'
import { tableLoading } from '@are-visual/virtual-table/middleware/loading'
import { tableSelection } from '@are-visual/virtual-table/middleware/selection'
import { Summary, tableSummary } from '@are-visual/virtual-table/middleware/summary'
import { Button, Checkbox, Empty, Input, InputNumber, Radio, Space, Switch } from 'antd'
import { useMemo, useState } from 'react'

/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-expect-error: 为 demo 保留此函数
function SelectionImpl(props: SelectionProps) {
  const {
    multiple,
    value,
    onChange,
    indeterminate,
    disabled,
  } = props

  if (!multiple) {
    return (
      <Radio
        checked={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked, e.nativeEvent)}
      />
    )
  }

  return (
    <Checkbox
      checked={value}
      indeterminate={indeterminate}
      disabled={disabled}
      onChange={(e) => onChange?.(e.target.checked, e.nativeEvent)}
    />
  )
}

const FullDemo: FC = () => {
  const [summaryPosition, setSummaryPosition] = useState<'bottom' | 'top'>('bottom')
  const [loading, setLoading] = useState(true)
  const [sticky, setSticky] = useState(true)
  const [empty, setEmpty] = useState(false)

  const [data, setData] = useAsyncData()

  const selection = useMemo(() => {
    return tableSelection<MockData>({
      extraColumnProps: { disableResize: true },
      // component: SelectionImpl,
      fixed: true,
      onSelect(record, selected, selectedRows, nativeEvent) {
        console.log({ record, selected, selectedRows, nativeEvent })
      },
      onChange(selectedRowKeys, selectedRows, info) {
        console.log({ selectedRowKeys, selectedRows, info })
      },
    })
  }, [])

  const expandable = useMemo(() => {
    return tableExpandable<MockData>({
      extraColumnProps: { disableResize: true },
      fixed: 'left',
      defaultExpandAllRows: true,
      // defaultExpandedRowKeys: ['key:1'],
      rowExpandable: () => true,
      expandedRowRender(record) {
        return record.name
      },
    })
  }, [])

  const summary = useMemo(() => {
    return tableSummary({
      summary: () => {
        return (
          <Summary key="summary" fixed={summaryPosition}>
            <Summary.Row>
              {(column, key) => {
                if (column.key === 'name') {
                  return (
                    <Summary.Cell columnKey={key}>
                      {key.toString()}
                    </Summary.Cell>
                  )
                }
                return <Summary.Cell columnKey={key} />
              }}
            </Summary.Row>
          </Summary>
        )
      },
    })
  }, [summaryPosition])

  const pipeline = useTablePipeline({
    use: [
      selection,
      expandable,
      columnResize({
        storageKey: 'full-demo',
      }),
      { priority: 200, hook: tableLoading({ loading }) },
      { priority: 200, hook: tableEmpty({ visible: !loading, children: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> }) },
      { priority: 200, hook: summary },
      { priority: 200, hook: horizontalScrollBar() },
    ],
  })

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
          border: '1px solid #f00',
          height: 500,
          maxHeight: 100,
        }}
      >
        <div>
          <label style={{ marginRight: 8 }}>总结栏位置</label>
          <Radio.Group
            value={summaryPosition}
            onChange={(e) => setSummaryPosition(e.target.value as 'top' | 'bottom')}
          >
            <Radio value="top">Top</Radio>
            <Radio value="bottom">Bottom</Radio>
          </Radio.Group>
        </div>
        <div>
          <label style={{ marginRight: 8 }}>Loading</label>
          <Switch value={loading} onChange={setLoading} />
        </div>
        <div>
          <label style={{ marginRight: 8 }}>Sticky</label>
          <Switch value={sticky} onChange={setSticky} />
        </div>
        <div>
          <label style={{ marginRight: 8 }}>Empty</label>
          <Switch value={empty} onChange={setEmpty} />
        </div>
      </div>
      <div>
        <VirtualTable
          pipeline={pipeline}
          // style={{
          //   boxSizing: 'border-box',
          //   height: 500,
          //   width: 800,
          //   border: '1px solid #f00',
          //   overflow: 'auto',
          //   overscrollBehavior: 'contain',
          // }}
          rowKey="key"
          dataSource={empty ? [] : data}
          columns={columns}
          estimatedRowHeight={49}
          // estimatedColumnWidth={200}
          stickyHeader={sticky}
        />
      </div>
    </div>
  )
}

export default FullDemo
