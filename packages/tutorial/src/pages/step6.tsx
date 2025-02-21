import type { MiddlewareContext, MiddlewareResult } from '@/components/virtual-table_step6/pipeline/types'
import type { ColumnType } from '@/components/virtual-table_step6/types'
import type { FC } from 'react'
import type { Data } from './utils/mock'
import ActionArea from '@/components/action-area'
import { useTablePipeline } from '@/components/virtual-table_step6/pipeline/useTablePipeline'
import VirtualTable from '@/components/virtual-table_step6/table'
import { Spin, Switch } from 'antd'
import { useMemo, useState } from 'react'
import { makeColumns, makeDataSource } from './utils/mock'

function tableLoading(options?: { loading?: boolean }) {
  return function useLoading<T>(ctx: MiddlewareContext<T>): MiddlewareResult<T> {
    const loading = options?.loading ?? false

    return {
      ...ctx,
      render(children) {
        return <Spin spinning={loading}>{children}</Spin>
      },
    }
  }
}

function tableNewColumn() {
  return function useTableNewColumn<T>(ctx: MiddlewareContext<T>): MiddlewareResult<T> {
    const { columns: rawColumns } = ctx

    const columns = useMemo<ColumnType<T>[]>(() => {
      return [
        {
          key: 'new-column',
          title: 'New',
          width: 80,
          fixed: 'left',
          render() {
            return 'New'
          },
        },
        ...rawColumns,
      ]
    }, [rawColumns])

    return {
      ...ctx,
      columns,
    }
  }
}

const Step6: FC = () => {
  const [dataCount, setDataCount] = useState(1000)
  const [columnCount, setColumnCount] = useState(1000)

  const [dataSource, setDataSource] = useState(() => makeDataSource(dataCount))
  const [columns, setColumns] = useState(() => makeColumns(columnCount, [0], [columnCount - 1]))

  const [loading, setLoading] = useState(false)
  const pipeline = useTablePipeline<Data>({
    use: [
      tableLoading({ loading }),
      tableNewColumn(),
    ],
  })

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
      >
        <div className="action-area-section">
          <h3 className="action-area-label">Loading</h3>
          <Switch value={loading} onChange={setLoading} />
        </div>
      </ActionArea>
      <VirtualTable
        pipeline={pipeline}
        rowKey="key"
        columns={columns}
        dataSource={dataSource}
        estimatedRowHeight={40}
        estimatedColumnWidth={180}
      />
    </>
  )
}

export default Step6
