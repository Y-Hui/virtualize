/* eslint-disable @eslint-react/no-clone-element */
import { cloneElement, type ComponentType, createElement, isValidElement, type ReactNode, useCallback, useMemo } from 'react'

import { createMiddleware } from '../../core/pipeline/create'
import { type MiddlewareContext, type MiddlewareRender } from '../../types'
import EmptyRow from './empty-row'

export interface EmptyOptions {
  component?: ComponentType
  children?: ReactNode
}

export const tableEmpty = createMiddleware(
  function useTableEmpty<T>(ctx: MiddlewareContext<T>, args?: EmptyOptions | void) {
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
        return cloneElement(children, children.props, [
          ...(children.props?.children ?? []),
          <EmptyRow key="virtual-table-placeholder$" colSpan={columns?.length ?? 0}>{node}</EmptyRow>,
        ])
      }

      return (
        <>
          {children}
          {showEmpty && node}
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
  },
)
