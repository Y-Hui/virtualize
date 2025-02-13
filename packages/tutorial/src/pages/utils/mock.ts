import type { ColumnType } from '@/components/virtual-table_step0/types'

export interface Data {
  key: string
}

export function makeDataSource(size: number) {
  return Array.from({ length: size }, (_, index): Data => {
    return { key: index.toString() }
  })
}

export function makeColumns(size: number, fixedLeftIndex: number[] = [], fixedRightIndex: number[] = []) {
  return Array.from({ length: size }, (_, index): ColumnType<Data> => {
    return {
      fixed: fixedLeftIndex.includes(index) ? 'left' : fixedRightIndex.includes(index) ? 'right' : undefined,
      dataIndex: `data${index}`,
      title: `Data${index}`,
      width: 180,
      render(_v, _record, i) {
        return `[${i}] Data(${i})`
      },
    }
  })
}
