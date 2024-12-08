/* eslint-disable @typescript-eslint/no-explicit-any */
import './style.scss'

import { isValidElement, type ReactNode, useCallback } from 'react'

import { type MiddlewareContext } from '../../types'
import { createMiddleware } from '../index'
import Footer from './footer'
import Summary, { type SummaryProps } from './summary'

export interface TableSummaryOptions<T = any> {
  summary: (data: readonly T[]) => React.ReactNode
}

export const tableSummary = createMiddleware(function useTableSummary<T = any>(
  ctx: MiddlewareContext<T>,
  options?: TableSummaryOptions<T> | void,
) {
  const { summary } = options ?? {}
  const { columns, dataSource = [] } = ctx

  const summaryNode = summary?.(dataSource ?? [])
  const fixed =
    isValidElement(summaryNode) &&
    summaryNode.type === Summary &&
    (summaryNode.props as SummaryProps).fixed

  const renderHeader = useCallback(
    (children: ReactNode) => {
      return (
        <>
          {children}
          <tfoot className="virtual-table-summary-tfoot">{summaryNode}</tfoot>
        </>
      )
    },
    [summaryNode],
  )

  if (summary == null) {
    return ctx
  }

  if (fixed === 'top') {
    return { ...ctx, renderHeader }
  }

  return {
    ...ctx,
    renderTable(children) {
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
})
