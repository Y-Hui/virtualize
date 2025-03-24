/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MiddlewareContext, MiddlewareRenderBodyContent, MiddlewareResult } from '@are-visual/virtual-table'
import type { ComponentType, ReactNode } from 'react'
import { createMiddleware } from '@are-visual/virtual-table'
import { createElement, useCallback, useMemo } from 'react'
import EmptyRow from './empty-row'

export interface EmptyOptions {
  children: ReactNode | ComponentType
  visible?: boolean
}

function useTableEmpty<T = any>(ctx: MiddlewareContext<T>, args: EmptyOptions): MiddlewareResult<T> {
  const { children: component, visible = true } = args
  const { dataSource } = ctx

  const isNoData = !Array.isArray(dataSource) ? true : dataSource.length === 0
  const showEmpty = isNoData && visible

  const node = useMemo(() => {
    if (typeof component === 'function') {
      return createElement(component)
    }
    return component
  }, [component])

  const renderBodyContent: MiddlewareRenderBodyContent = useCallback((children, options) => {
    const { columnDescriptor } = options

    return (
      <>
        {children}
        <EmptyRow key="virtual-table-placeholder$" colSpan={columnDescriptor.length}>{node}</EmptyRow>
      </>
    )
  }, [node])

  if (!showEmpty) {
    return ctx
  }

  return {
    ...ctx,
    renderBodyContent,
  }
}

export const tableEmpty = createMiddleware(useTableEmpty)
