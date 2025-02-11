import type { ColumnType } from '@/components/virtual-table_step2/types'
import type { FC } from 'react'
import VirtualTable from '@/components/virtual-table_step2/table'

const size = 100

const dataSource = Array.from({ length: size }, (_, index) => {
  return { key: index.toString() }
})

const columns = Array.from({ length: size }, (_, index): ColumnType<Record<string, string>> => {
  return {
    fixed: [0].includes(index) ? 'left' : [size - 1].includes(index) ? 'right' : undefined,
    dataIndex: `data${index}`,
    title: `Data${index}`,
    width: 180,
    render(_v, _record, i) {
      return `[${i}] Data(${i})`
    },
  }
})

const Step2: FC = () => {
  return (
    <VirtualTable rowKey="key" columns={columns} dataSource={dataSource} />
  )
}

export default Step2
