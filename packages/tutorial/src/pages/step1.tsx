import type { FC } from 'react'
import ActionArea from '@/components/action-area'
import VirtualTable from '@/components/virtual-table_step1/table'
import { useState } from 'react'
import { makeColumns, makeDataSource } from './utils/mock'

const Step1: FC = () => {
  const [dataCount, setDataCount] = useState(100)
  const [columnCount, setColumnCount] = useState(100)

  const [dataSource, setDataSource] = useState(() => makeDataSource(dataCount))
  const [columns, setColumns] = useState(() => makeColumns(columnCount))

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
          setColumns(makeColumns(nextCount))
        }}
      />
      <VirtualTable rowKey="key" columns={columns} dataSource={dataSource} />
    </>
  )
}

export default Step1
