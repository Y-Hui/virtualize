import type { CSSProperties, ForwardedRef, ReactNode } from 'react'
import type { PipelineRender } from './pipeline/types'
import clsx from 'clsx'
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import { composeRef } from '../utils/ref'
import { useHorizontalScrollContext } from './context/horizontal-scroll'
import { pipelineRender } from './pipeline/render-pipeline'

export interface TableRootProps {
  className?: string
  style?: CSSProperties
  children?: ReactNode
  hasFixedLeftColumn?: boolean
  hasFixedRightColumn?: boolean
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
  } = props

  const rootNode = useRef<HTMLDivElement>(null)

  const [hasFixedLeft, setHasFixedLeft] = useState(false)
  const [hasFixedRight, setHasFixedRight] = useState(false)

  const { getElements } = useHorizontalScrollContext()

  const elements = useMemo(() => getElements(), [getElements])

  useEffect(() => {
    const onCheckHasFixedEdge = () => {
      const scrollElement = elements[0] as HTMLElement | undefined
      if (scrollElement == null) return
      const { scrollLeft, clientWidth, scrollWidth } = scrollElement
      if (hasFixedLeftColumn) {
        setHasFixedLeft(scrollLeft !== 0)
      }
      if (hasFixedRightColumn) {
        setHasFixedRight(!(scrollLeft + clientWidth >= scrollWidth))
      }
    }

    onCheckHasFixedEdge()

    elements.forEach((node) => {
      node.addEventListener('scroll', onCheckHasFixedEdge)
    })

    return () => {
      elements.forEach((node) => {
        node.removeEventListener('scroll', onCheckHasFixedEdge)
      })
    }
  }, [elements, hasFixedLeftColumn, hasFixedRightColumn])

  return pipelineRender(
    <div
      // eslint-disable-next-line react-compiler/react-compiler
      ref={composeRef(ref, rootNode)}
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
