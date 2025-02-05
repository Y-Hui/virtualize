import type { CSSProperties, Key, Ref } from 'react'
import type { NecessaryProps } from './internal'
import type {
  MiddlewareRenderBody,
  MiddlewareRenderBodyRoot,
  MiddlewareRenderBodyWrapper,
} from './pipeline/types'
import type { RowProps } from './row'
import type { AnyObject, InnerColumnDescriptor } from './types'
import clsx from 'clsx'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { shallowEqualArrays } from '../utils/equal'
import { useMergedRef } from '../utils/ref'
import Colgroup from './colgroup'
import { useColumnSizes } from './context/column-sizes'
import { useHorizontalScrollContext } from './context/horizontal-scroll'
import { pipelineRender } from './pipeline/render-pipeline'
import Row from './row'
import { getKey } from './utils/get-key'

export interface TableBodyProps<T>
  extends Omit<NecessaryProps<T>, 'columns'>,
  Pick<RowProps<T>, 'onRow' | 'renderRow' | 'renderCell'> {
  className?: string
  style?: CSSProperties
  startIndex: number
  columns: InnerColumnDescriptor<T>
  bodyWrapperRef?: Ref<HTMLDivElement>
  bodyRootRef?: Ref<HTMLTableElement>
  bodyRef?: Ref<HTMLTableSectionElement>
  rowClassName?: (record: T, index: number) => string
  renderBodyWrapper?: MiddlewareRenderBodyWrapper
  renderBodyRoot?: MiddlewareRenderBodyRoot
  renderBody?: MiddlewareRenderBody
}

function TableBody<T>(props: TableBodyProps<T>) {
  const {
    bodyWrapperRef,
    bodyRootRef,
    bodyRef,
    className,
    style,
    dataSource,
    columns: columnDescriptor,
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

  const { columns, descriptor } = columnDescriptor

  const { addShouldSyncElement } = useHorizontalScrollContext()

  const { widthList, setWidthList } = useColumnSizes()
  const columnWidthsRef = useRef(new Map<Key, number>())
  useLayoutEffect(() => {
    const snap = widthList
    const prevKeys = [...snap.keys()]
    const nextKeys = [...columnWidthsRef.current.keys()]

    const prevValues = [...snap.values()]
    const nextValues = [...columnWidthsRef.current.values()]

    if (!shallowEqualArrays(prevKeys, nextKeys) || !shallowEqualArrays(prevValues, nextValues)) {
      // console.log(new Map(columnWidthsRef.current), { prevKeys, nextKeys, prevValues, nextValues })
      setWidthList(new Map(columnWidthsRef.current))
    }
  })

  const bodyNode = pipelineRender(
    <tbody ref={bodyRef}>
      {dataSource.map((e, rowIndex) => {
        const _rowKey = (e as AnyObject)[rowKey as string]
        return (
          <Row
            key={_rowKey}
            className={clsx(rowClassName?.(e, rowIndex))}
            rowIndex={rowIndex + startIndex}
            rowData={e}
            columns={columnDescriptor}
            onRow={onRow}
            renderRow={renderRow}
            renderCell={renderCell}
          />
        )
      })}
    </tbody>,
    renderBody,
    { columns, columnDescriptor: descriptor },
  )

  const tableNode = pipelineRender(
    <table
      className={clsx(className, 'virtual-table-body')}
      style={style}
      ref={bodyRootRef}
    >
      <Colgroup
        columns={descriptor}
        colRef={(node, column) => {
          if (node == null) return
          const key = getKey(column)
          columnWidthsRef.current.set(key, node.offsetWidth)
        }}
      />
      {bodyNode}
    </table>,
    renderBodyRoot,
    { columns, columnDescriptor: descriptor },
  )

  const wrapperRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const node = wrapperRef.current
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
    { columns, columnDescriptor: descriptor },
  )
}

export default TableBody
