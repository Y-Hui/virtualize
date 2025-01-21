import type { CSSProperties, Ref } from 'react'
import type { NecessaryProps } from './internal'
import type {
  MiddlewareRenderBody,
  MiddlewareRenderBodyRoot,
  MiddlewareRenderBodyWrapper,
} from './pipeline/types'
import type { RowProps } from './row'
import type { AnyObject } from './types'
import clsx from 'clsx'
import { useEffect, useRef } from 'react'
import { useMergedRef } from '../utils/ref'
import Colgroup from './colgroup'
import { useHorizontalScrollContext } from './context/horizontal-scroll'
import { pipelineRender } from './pipeline/render-pipeline'
import Row from './row'

export interface TableBodyProps<T>
  extends NecessaryProps<T>,
  Pick<RowProps<T>, 'onRow' | 'renderRow' | 'renderCell'> {
  className?: string
  style?: CSSProperties
  startIndex: number
  wrapperRef?: Ref<HTMLDivElement>
  tableRef?: Ref<HTMLTableElement>
  rowClassName?: (record: T, index: number) => string
  renderBodyWrapper?: MiddlewareRenderBodyWrapper
  renderBodyRoot?: MiddlewareRenderBodyRoot
  renderBody?: MiddlewareRenderBody
}

function TableBody<T>(props: TableBodyProps<T>) {
  const {
    wrapperRef,
    tableRef,
    className,
    style,
    dataSource,
    columns,
    rowKey,
    startIndex,
    rowClassName,
    onRow,
    renderBodyWrapper,
    renderBodyRoot,
    renderBody,
    renderRow,
    renderCell,
  } = props

  const { addShouldSyncElement } = useHorizontalScrollContext()

  const bodyNode = pipelineRender(
    <tbody>
      {dataSource.map((e, rowIndex) => {
        const _rowKey = (e as AnyObject)[rowKey as string]
        return (
          <Row
            key={_rowKey}
            className={clsx(rowClassName?.(e, rowIndex))}
            rowIndex={rowIndex + startIndex}
            rowData={e}
            columns={columns}
            onRow={onRow}
            renderRow={renderRow}
            renderCell={renderCell}
          />
        )
      })}
    </tbody>,
    renderBody,
    { columns },
  )

  const tableNode = pipelineRender(
    <table className={clsx(className, 'virtual-table-body')} style={style} ref={tableRef}>
      <Colgroup columns={columns} />
      {bodyNode}
    </table>,
    renderBodyRoot,
    { columns },
  )

  const bodyWrapperRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const node = bodyWrapperRef.current
    if (node == null) return
    return addShouldSyncElement('virtual-table-body', node)
  }, [addShouldSyncElement])

  const mergedRef = useMergedRef(wrapperRef, bodyWrapperRef)

  return pipelineRender(
    <div
      ref={mergedRef}
      className="virtual-table-body-wrapper"
    >
      {tableNode}
    </div>,
    renderBodyWrapper,
    { columns },
  )
}

export default TableBody
