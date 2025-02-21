import type { FC } from 'react'
import ActionArea from '@/components/action-area'
import VirtualTable from '@/components/virtual-table/table'
import { useState } from 'react'
import { makeColumns, makeDataSource } from './utils/mock'

const Step5: FC = () => {
  const [dataCount, setDataCount] = useState(1000)
  const [columnCount, setColumnCount] = useState(1000)

  const [dataSource, setDataSource] = useState(() => makeDataSource(dataCount))
  const [columns, setColumns] = useState(() => makeColumns(columnCount, [0], [columnCount - 1]))

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
          setColumns(makeColumns(nextCount, [0], [nextCount - 1]))
        }}
      />
      <VirtualTable
        rowKey="key"
        columns={columns}
        dataSource={dataSource}
        estimatedRowHeight={40}
        estimatedColumnWidth={180}
      />
    </>
  )
}

export default Step5
