/* eslint-disable @eslint-react/hooks-extra/no-direct-set-state-in-use-effect */
import clsx from 'clsx'
import {
  type CSSProperties,
  type FC,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react'

import { getScrollElement, getScrollParent } from '../utils/dom'

export interface TableRootProps {
  className?: string
  style?: CSSProperties
  children?: ReactNode
  hasFixedColumn?: boolean
}

const TableRoot: FC<TableRootProps> = (props) => {
  const { className, style, children, hasFixedColumn } = props

  const rootNode = useRef<HTMLDivElement>(null)

  const [hasFixedLeft, setHasFixedLeft] = useState(false)
  const [hasFixedRight, setHasFixedRight] = useState(false)

  useEffect(() => {
    const node = rootNode.current
    if (node == null || !hasFixedColumn) return

    const container = getScrollParent(node)

    const onCheckHasFixedEdge = () => {
      const scrollElement = getScrollElement(container)
      const { scrollLeft, clientWidth, scrollWidth } = scrollElement
      setHasFixedLeft(scrollLeft !== 0)
      setHasFixedRight(!(scrollLeft + clientWidth >= scrollWidth))
    }

    onCheckHasFixedEdge()

    container.addEventListener('scroll', onCheckHasFixedEdge)
    return () => {
      container.removeEventListener('scroll', onCheckHasFixedEdge)
    }
  }, [hasFixedColumn])

  return (
    <div
      ref={rootNode}
      className={clsx(
        'virtual-table',
        hasFixedLeft && 'virtual-table-has-fix-left',
        hasFixedRight && 'virtual-table-has-fix-right',
        className,
      )}
      style={style}
    >
      {children}
    </div>
  )
}

export default TableRoot
