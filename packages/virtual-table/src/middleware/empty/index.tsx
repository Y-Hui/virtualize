/* eslint-disable @eslint-react/no-clone-element */
import { cloneElement, type ComponentType, createElement, isValidElement, type ReactNode, useCallback, useMemo } from 'react'

import { createMiddleware, type MiddlewareContext, type MiddlewareRender, type MiddlewareResult } from '../../core'
import EmptyRow from './empty-row'

export interface EmptyOptions {
  component?: ComponentType
  children?: ReactNode
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useTableEmpty<T = any>(ctx: MiddlewareContext<T>, args?: EmptyOptions): MiddlewareResult<T> {
  const { children: emptyNode, component } = args ?? {}
  const { dataSource } = ctx

  const showEmpty = dataSource == null ? true : dataSource.length === 0

  const node = useMemo(() => {
    if (typeof component === 'function') {
      return createElement(component)
    }
    return emptyNode
  }, [component, emptyNode])

  const renderBody: MiddlewareRender = useCallback((children, options) => {
    if (!showEmpty) {
      return children
    }

    const { columns } = options

    if (isValidElement(children)) {
      const childrenProps = children.props as Record<string, unknown>
      return cloneElement(children, childrenProps, [
        ...(Array.isArray(childrenProps.children) ? childrenProps.children : []),
        <EmptyRow key="virtual-table-placeholder$" colSpan={columns?.length ?? 0}>{node}</EmptyRow>,
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
