/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @eslint-react/no-clone-element */
import { cloneElement, type ComponentType, createElement, isValidElement, type ReactNode, useCallback, useMemo } from 'react'

import { createMiddleware, type MiddlewareContext, type MiddlewareRenderBody, type MiddlewareResult } from '../../core'
import EmptyRow from './empty-row'

export interface EmptyOptions {
  children: ReactNode | ComponentType
}

function useTableEmpty<T = any>(ctx: MiddlewareContext<T>, args: EmptyOptions): MiddlewareResult<T> {
  const { children: component } = args
  const { dataSource } = ctx

  const showEmpty = dataSource == null ? true : dataSource.length === 0

  const node = useMemo(() => {
    if (typeof component === 'function') {
      return createElement(component)
    }
    return component
  }, [component])

  const renderBody: MiddlewareRenderBody = useCallback((children, options) => {
    if (!showEmpty) {
      return children
    }

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
  }, [showEmpty, node])

  if (!showEmpty) {
    return ctx
  }

  return {
    ...ctx,
    renderBody,
  }
}

export const tableEmpty = createMiddleware(useTableEmpty)
