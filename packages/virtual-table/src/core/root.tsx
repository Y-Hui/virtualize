import type { CSSProperties, ForwardedRef, ReactNode, RefObject } from 'react'
import type { PipelineRender } from './pipeline/types'
import clsx from 'clsx'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { useMergedRef } from '../utils/ref'
import { pipelineRender } from './pipeline/render-pipeline'

export interface TableRootProps {
  className?: string
  style?: CSSProperties
  children?: ReactNode
  hasFixedLeftColumn?: boolean
  hasFixedRightColumn?: boolean
  bodyScrollContainer: RefObject<HTMLElement>
  renderRoot?: PipelineRender
}

function TableRoot(props: TableRootProps, ref: ForwardedRef<HTMLDivElement>) {
  const {
    className,
    style,
    children,
    hasFixedLeftColumn,
    hasFixedRightColumn,
    renderRoot,
    bodyScrollContainer,
  } = props

  const rootNode = useRef<HTMLDivElement>(null)

  const [hasFixedLeft, setHasFixedLeft] = useState(false)
  const [hasFixedRight, setHasFixedRight] = useState(false)

  useEffect(() => {
    const node = bodyScrollContainer.current
    if (node == null) return
    const onCheckHasFixedEdge = () => {
      const { scrollLeft, clientWidth, scrollWidth } = node
      if (hasFixedLeftColumn) {
        setHasFixedLeft(scrollLeft !== 0)
      }
      if (hasFixedRightColumn) {
        setHasFixedRight(!(scrollLeft + clientWidth >= scrollWidth))
      }
    }
    onCheckHasFixedEdge()
    node.addEventListener('scroll', onCheckHasFixedEdge)
    return () => {
      node.removeEventListener('scroll', onCheckHasFixedEdge)
    }
  }, [bodyScrollContainer, hasFixedLeftColumn, hasFixedRightColumn])

  const mergedRef = useMergedRef(ref, rootNode)
  return pipelineRender(
    <div
      ref={mergedRef}
      className={clsx(
        'virtual-table',
        hasFixedLeft && 'virtual-table-has-fix-left',
        hasFixedRight && 'virtual-table-has-fix-right',
        className,
      )}
      style={style}
    >
      {children}
    </div>,
    renderRoot,
    {},
  )
}

export default forwardRef(TableRoot)
