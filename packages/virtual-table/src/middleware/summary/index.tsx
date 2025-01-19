/* eslint-disable @typescript-eslint/no-explicit-any */
import './style.scss'

import type { MiddlewareContext, MiddlewareResult } from '@are-visual/virtual-table'
import type { ReactNode } from 'react'
import type { SummaryProps } from './summary'
import { createMiddleware } from '@are-visual/virtual-table'
import { isValidElement, useCallback } from 'react'
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
  const { columns, dataSource } = ctx

  const summaryNode = summary?.(dataSource ?? [])
  const fixed = isValidElement(summaryNode)
    && summaryNode.type === Summary
    && (summaryNode.props as SummaryProps).fixed

  const renderHeader = useCallback((children: ReactNode) => {
    return (
      <>
        {children}
        <tfoot className="virtual-table-summary-tfoot">{summaryNode}</tfoot>
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
    renderContent(children) {
      return (
        <>
          {children}
          <Footer fixed={fixed === 'bottom' || fixed} columns={columns}>
            {summaryNode}
          </Footer>
        </>
      )
    },
  }
}

export { default as Summary } from './summary'
export const tableSummary = createMiddleware(useTableSummary)
