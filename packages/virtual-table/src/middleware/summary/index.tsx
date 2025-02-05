/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MiddlewareContext, MiddlewareRenderHeader, MiddlewareResult } from '@are-visual/virtual-table'
import type { ReactNode } from 'react'
import type { SummaryProps } from './summary'
import { createMiddleware } from '@are-visual/virtual-table'
import { isValidElement, useCallback } from 'react'
import { SummaryContext } from './context/columns'
import Footer from './footer'
import Summary from './summary'

export interface TableSummaryOptions<T = any> {
  summary: (data: readonly T[]) => ReactNode
}

function useTableSummary<T = any>(
  ctx: MiddlewareContext<T>,
  options?: TableSummaryOptions<T>,
): MiddlewareResult<T> {
  const { summary } = options ?? {}
  const { dataSource } = ctx

  const summaryNode = summary?.(dataSource)
  const fixed = isValidElement(summaryNode)
    && summaryNode.type === Summary
    && (summaryNode.props as SummaryProps).fixed

  const renderHeader: MiddlewareRenderHeader = useCallback((children, { columnDescriptor }) => {
    return (
      <>
        {children}
        <tfoot className="virtual-table-summary-tfoot">
          <SummaryContext.Provider value={columnDescriptor}>
            {summaryNode}
          </SummaryContext.Provider>
        </tfoot>
      </>
    )
  }, [summaryNode])

  if (summary == null) {
    return ctx
  }

  if (fixed === 'top') {
    return { ...ctx, renderHeader }
  }

  return {
    ...ctx,
    renderContent(children, { columnDescriptor }) {
      return (
        <>
          {children}
          <Footer fixed={fixed === 'bottom' || fixed} columns={columnDescriptor}>
            <SummaryContext.Provider value={columnDescriptor}>
              {summaryNode}
            </SummaryContext.Provider>
          </Footer>
        </>
      )
    },
  }
}

export { default as Summary } from './summary'
export const tableSummary = createMiddleware(useTableSummary)
