/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MiddlewareContext, MiddlewareResult } from '@are-visual/virtual-table'
import type { ReactElement, ReactNode } from 'react'
import type { CellProps } from './cell'
import type { FooterProps } from './footer'
import type { SummaryProps } from './summary'
import { createMiddleware } from '@are-visual/virtual-table'
import clsx from 'clsx'
import { Children, Fragment, isValidElement } from 'react'
import { SummaryContext } from './context/columns'
import Footer from './footer'
import Summary from './summary'

export interface InlineCellProps<T> extends Omit<CellProps, 'ref' | 'columnKey' | 'render' | 'children'> {
  render?: (dataSource: T[]) => ReactNode
}

declare module '@are-visual/virtual-table' {
  interface ColumnExtra<T = any> {
    summary?: InlineCellProps<T>
  }
}

export interface TableSummaryOptions<T = any> extends Pick<FooterProps, 'bottom' | 'className' | 'style' | 'zIndex'> {
  summary: (data: T[]) => ReactNode
}

function useTableSummary<T = any>(
  ctx: MiddlewareContext<T>,
  options?: TableSummaryOptions<T>,
): MiddlewareResult<T> {
  const { className, style, zIndex, bottom, summary } = options ?? {}
  const { dataSource, instance } = ctx

  let hasFixedTop = false
  let hasFixedBottom = false

  const summaryNode = summary?.(dataSource)
  const topNode: ReactNode[] = []
  const bottomNode: ReactNode[] = []

  const handleRowElement = (node: ReactElement<SummaryProps>) => {
    const fixed = node.props.fixed
    if (fixed === 'top') {
      hasFixedTop = true
      topNode.push(node)
    } else {
      if (fixed === 'bottom' || fixed === true) {
        hasFixedBottom = true
      }
      bottomNode.push(node)
    }
  }

  if (summary == null) {
    return ctx
  }

  if (isValidElement(summaryNode)) {
    if (summaryNode.type === Fragment) {
      const rawChildren = (summaryNode.props as { children?: ReactNode }).children
      // eslint-disable-next-line @eslint-react/no-children-for-each
      Children.forEach(rawChildren, (child) => {
        if (isValidElement(child) && child.type === Summary) {
          handleRowElement(child as ReactElement<SummaryProps>)
        } else {
          if (__DEV__) {
            console.warn(child, 'The summary function does not support components other than Fragment and Summary.')
          }
        }
      })
    } else if (summaryNode.type === Summary) {
      handleRowElement(summaryNode as ReactElement<SummaryProps>)
    } else {
      if (__DEV__) {
        console.error(summaryNode, 'The summary function does not support components other than Fragment and Summary.')
        throw new Error('The summary function does not support components other than Fragment and Summary.')
      }
    }
  } else {
    return ctx
  }

  return {
    ...ctx,
    ...(hasFixedTop as boolean
      ? {
          renderHeader: (children, { columnDescriptor }) => {
            return (
              <>
                {children}
                <tfoot className={clsx('virtual-table-summary-tfoot', className)} style={style}>
                  <SummaryContext.Provider value={columnDescriptor}>
                    {topNode}
                  </SummaryContext.Provider>
                </tfoot>
              </>
            )
          },
        }
      : {}),
    ...(hasFixedBottom as boolean
      ? {
          renderContent(children, { columnDescriptor }) {
            const { defaultColumnWidth } = instance.getCurrentProps()
            return (
              <>
                {children}
                <Footer
                  className={className}
                  style={style}
                  zIndex={zIndex}
                  bottom={bottom}
                  fixed={hasFixedBottom}
                  columns={columnDescriptor}
                  defaultColumnWidth={defaultColumnWidth}
                >
                  <SummaryContext.Provider value={columnDescriptor}>
                    {bottomNode}
                  </SummaryContext.Provider>
                </Footer>
              </>
            )
          },
        }
      : {}),
  }
}

export { default as Summary } from './summary'
export const tableSummary = createMiddleware(useTableSummary)
