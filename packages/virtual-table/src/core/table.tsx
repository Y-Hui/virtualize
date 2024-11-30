/* eslint-disable @eslint-react/hooks-extra/no-direct-set-state-in-use-layout-effect */
import clsx from 'classnames'
import {
  type CSSProperties,
  type DetailedHTMLProps,
  type ForwardedRef,
  forwardRef,
  type ReactElement,
  type RefAttributes,
  type TableHTMLAttributes,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { __DEV__ } from '../utils/dev'
import { getScrollElement, getScrollParent, isRoot, isWindow } from '../utils/dom'
import { composeRef } from '../utils/ref'
import TableBody, { type TableBodyProps } from './body'
import { TableShared, type TableSharedContextType } from './context/shared'
import { TableColumnsContext } from './context/table-columns'
import TableHeader from './header'
import {
  useRowRectManager,
  type UseRowRectManagerOptions,
} from './hooks/useRowRectManager'
import { TablePipeline } from './hooks/useTablePipeline'
import TableRoot from './root'

type DefaultTableProps = DetailedHTMLProps<
  TableHTMLAttributes<HTMLTableElement>,
  HTMLTableElement
>

export type VirtualTableCoreRef = HTMLTableElement

export interface VirtualTableCoreProps<T>
  extends Omit<DefaultTableProps, 'children'>,
    Pick<UseRowRectManagerOptions, 'estimatedRowHeight'>,
    Omit<TableBodyProps<T>, 'startIndex'> {
  rootClassName?: string
  rootStyle?: CSSProperties

  /** 开启表头 sticky，设置为 true 则默认 top 为 0，为 number 则是偏移量 */
  stickyHeader?: number | boolean

  /** 在头和尾额外渲染多少条 @default 5 */
  overscanCount?: number

  pipeline?: TablePipeline<T>
}

function VirtualTableCore<T>(
  props: VirtualTableCoreProps<T>,
  ref: ForwardedRef<VirtualTableCoreRef>,
) {
  const {
    rootClassName,
    rootStyle,
    className,
    style,
    columns: rawColumns,
    dataSource: rawData,
    rowKey: rawRowKey = 'key',
    estimatedRowHeight,
    overscanCount = 5,
    stickyHeader,
    pipeline = TablePipeline.defaultPipeline as TablePipeline<T>,
    rowClassName: rawRowClassName,
    onRow,
    ...rest
  } = props

  const { dataSource, columns, rowKey, rowClassName } = pipeline.use({
    dataSource: rawData,
    rowKey: rawRowKey,
    columns: rawColumns,
    rowClassName: rawRowClassName,
  })

  const tableNode = useRef<HTMLTableElement>(null)
  const { rects, updateRowHeight, sum } = useRowRectManager({
    itemCount: dataSource?.length ?? 0,
    estimatedRowHeight,
  })

  // 滚动容器内可见数据条数
  const visibleCount = useRef(0)
  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(0)

  const dataSlice = useMemo(() => {
    return (dataSource ?? [])?.slice(startIndex, endIndex)
  }, [dataSource, startIndex, endIndex])

  const hasData = dataSource == null ? false : dataSource.length > 0

  // 初始化时根据滚动容器计算 visibleCount
  useLayoutEffect(() => {
    const container = tableNode.current
    if (container == null) return

    const scrollerContainer = getScrollParent(container)
    let containerHeight = 0
    if (isWindow(scrollerContainer) || isRoot(scrollerContainer)) {
      containerHeight = window.innerHeight
    } else {
      containerHeight = getScrollElement(scrollerContainer).getBoundingClientRect().height
    }
    const count = Math.ceil(containerHeight / estimatedRowHeight)

    if (visibleCount.current === 0) {
      const nextStartIndex = 0
      setStartIndex(nextStartIndex)
      setEndIndex(nextStartIndex + count + overscanCount)
    }

    visibleCount.current = count
  }, [estimatedRowHeight, hasData, overscanCount])

  useEffect(() => {
    const node = tableNode.current
    if (node == null) return
    const container = getScrollParent(node)

    const onScroll = (e: Event) => {
      const scrollElement = getScrollElement(e.target)
      const { scrollTop } = scrollElement
      // TODO: 考虑二分法查找；未判断滚动方向，这可能是导致向上滚动白屏的原因
      const anchor = rects().find((x) => x.bottom > scrollTop)
      if (anchor != null) {
        setStartIndex(Math.max(0, anchor.index - overscanCount))
        setEndIndex(anchor.index + visibleCount.current + overscanCount)
      }
    }

    container.addEventListener('scroll', onScroll)
    return () => {
      container.removeEventListener('scroll', onScroll)
    }
  }, [overscanCount, rects])

  const topBlank = sum(0, startIndex)
  const bottomBlank = sum(endIndex)
  const hasFixedColumn = columns.some((x) => typeof x.fixed === 'string')

  const shared = useMemo(() => {
    return { updateRowHeight } satisfies TableSharedContextType
  }, [updateRowHeight])

  return (
    <TableShared.Provider value={shared}>
      <TableColumnsContext columns={columns}>
        <TableRoot
          className={rootClassName}
          style={rootStyle}
          hasFixedColumn={hasFixedColumn}
        >
          <TableHeader columns={columns} stickyHeader={stickyHeader} />
          <table
            {...rest}
            className={clsx(className, 'virtual-table-body')}
            style={{ ...style, paddingBottom: bottomBlank, paddingTop: topBlank }}
            ref={composeRef(tableNode, ref)}
          >
            <colgroup>
              {columns.map((item, index) => {
                const key = 'key' in item ? item.key : item.dataIndex
                return (
                  <col
                    key={typeof key === 'symbol' ? index : key}
                    style={{
                      width: item.width,
                      minWidth: item.minWidth,
                    }}
                  />
                )
              })}
            </colgroup>
            <TableBody
              columns={columns}
              rowKey={rowKey}
              dataSource={dataSlice}
              startIndex={startIndex}
              rowClassName={rowClassName}
              onRow={onRow}
            />
          </table>
        </TableRoot>
      </TableColumnsContext>
    </TableShared.Provider>
  )
}

if (__DEV__) {
  VirtualTableCore.displayName = 'VirtualTable.Core'
}

export default forwardRef(VirtualTableCore) as <T>(
  props: VirtualTableCoreProps<T> & RefAttributes<HTMLTableElement>,
) => ReactElement
