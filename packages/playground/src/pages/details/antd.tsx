import type { ColumnType } from 'antd/es/table'
import type { FC } from 'react'
import { Input, Table } from 'antd'

const size = 1000

const dataSource = Array.from({ length: size }, (_, index) => {
  return { key: index.toString() }
})

const columns = Array.from({ length: 10 }, (_, index): ColumnType<Record<string, string>> => {
  return {
    fixed: [0].includes(index) ? 'left' : [size - 1].includes(index) ? 'right' : undefined,
    dataIndex: `data${index}`,
    title: `Data${index}`,
    width: 180,
    render(_val, record) {
      return <Input defaultValue={record.key} />
    },
  }
})

const ContainerScroll: FC = () => {
  return (
    <Table
      style={{
        boxSizing: 'border-box',
        border: '1px solid #f00',
      }}
      rowKey="key"
      dataSource={dataSource}
      columns={columns}
      scroll={{ x: 1000, y: 500 }}
      virtual
      pagination={false}
    />
  )
}

export default ContainerScroll
