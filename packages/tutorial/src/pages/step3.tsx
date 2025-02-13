import type { FC } from 'react'
import ActionArea from '@/components/action-area'
import VirtualTable from '@/components/virtual-table_step3/table'
import { useState } from 'react'
import { makeColumns, makeDataSource } from './utils/mock'

const Step3: FC = () => {
  const [dataCount, setDataCount] = useState(100)
  const [columnCount, setColumnCount] = useState(100)

  const [dataSource, setDataSource] = useState(() => makeDataSource(dataCount))
  const [columns, setColumns] = useState(() => makeColumns(columnCount, [0, 1], [dataCount - 1, dataCount - 2]))

  return (
    <>
      <ActionArea
        dataCount={dataCount}
        onDataCountChange={(nextCount) => {
          setDataCount(nextCount)
          setDataSource(makeDataSource(nextCount))
        }}
        columnCount={columnCount}
        onColumnCountChange={(nextCount) => {
          setColumnCount(nextCount)
          setColumns(makeColumns(nextCount, [0, 1], [nextCount - 1, nextCount - 2]))
        }}
      />
      <VirtualTable
        rowKey="key"
        columns={columns}
        dataSource={dataSource}
      />
    </>
  )
}

export default Step3
