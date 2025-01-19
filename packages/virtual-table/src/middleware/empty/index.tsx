/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MiddlewareContext, MiddlewareRenderBody, MiddlewareResult } from '@are-visual/virtual-table'
import type { ComponentType, ReactNode } from 'react'
import { createMiddleware } from '@are-visual/virtual-table'
import { cloneElement, createElement, isValidElement, useCallback, useMemo } from 'react'
import EmptyRow from './empty-row'

export interface EmptyOptions {
  children: ReactNode | ComponentType
  visible?: boolean
}

function useTableEmpty<T = any>(ctx: MiddlewareContext<T>, args: EmptyOptions): MiddlewareResult<T> {
  const { children: component, visible = true } = args
  const { dataSource } = ctx

  const isNoData = dataSource == null ? true : dataSource.length === 0
  const showEmpty = isNoData && visible

  const node = useMemo(() => {
    if (typeof component === 'function') {
      return createElement(component)
    }
    return component
  }, [component])

  const renderBody: MiddlewareRenderBody = useCallback((children, options) => {
    const { columns } = options

    if (isValidElement(children)) {
      const childrenProps = children.props as Record<string, unknown>
      return cloneElement(children, childrenProps, [
        ...(Array.isArray(childrenProps.children) ? childrenProps.children : []),
        <EmptyRow key="virtual-table-placeholder$" colSpan={columns.length}>{node}</EmptyRow>,
      ])
    }

    return (
      <>
        {children}
        {node}
      </>
    )
  }, [node])

  if (!showEmpty) {
    return ctx
  }

  return {
    ...ctx,
    renderBody,
  }
}

export const tableEmpty = createMiddleware(useTableEmpty)
