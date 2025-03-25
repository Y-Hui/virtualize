/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Key, ReactNode, RefObject } from 'react'
import type { ScrollElement } from '../../utils/dom'
import type { NecessaryProps } from '../internal'
import type { ColumnDescriptor, ColumnType, OnRowType } from '../types'

type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export interface MiddlewareContext<T> extends Readonly<NecessaryProps<T>> {
  readonly estimatedRowHeight: number
  readonly rootRef: RefObject<HTMLDivElement>
  readonly headerWrapperRef: RefObject<HTMLDivElement>
  readonly bodyWrapperRef: RefObject<HTMLDivElement>
  readonly bodyRootRef: RefObject<HTMLTableElement>
  readonly bodyRef: RefObject<HTMLTableSectionElement>
  readonly getScroller: () => ScrollElement | undefined
  readonly getOffsetTop: () => number
  [key: string]: unknown
}

export interface MiddlewareResult<T> extends MiddlewareContext<T>, MiddlewareRenders {
  rowClassName?: (record: T, index: number) => string
  onRow?: OnRowType<T>
  [key: string]: unknown
}

export type Middleware<T> = (context: MiddlewareContext<T>) => MiddlewareResult<T>

interface RenderOptions<T = any> {
  column: ColumnType<T>
  columnWidths: Map<Key, number>
  rowIndex: number
  startRowIndex: number
  columns: ColumnType<T>[]
  rowData: T
  columnDescriptor: ColumnDescriptor<T>[]
}

export type PipelineRenderOptions = Partial<RenderOptions>
export type PipelineRender = (children: ReactNode, options: PipelineRenderOptions) => ReactNode

export type MiddlewareRender<T = any> = (children: ReactNode, options: Prettify<Pick<RenderOptions<T>, 'columns' | 'columnDescriptor'>>) => ReactNode
export type MiddlewareRenderRoot<T = any> = (children: ReactNode, options: Prettify<Omit<RenderOptions<T>, keyof RenderOptions<T>>>) => ReactNode
export type MiddlewareRenderContent<T = any> = (children: ReactNode, options: Prettify<Pick<RenderOptions<T>, 'columns' | 'columnDescriptor'>>) => ReactNode
export type MiddlewareRenderHeaderWrapper<T = any> = (children: ReactNode, options: Prettify<Pick<RenderOptions<T>, 'columns' | 'columnDescriptor'>>) => ReactNode
export type MiddlewareRenderHeaderRoot<T = any> = (children: ReactNode, options: Prettify<Pick<RenderOptions<T>, 'columns' | 'columnDescriptor'>>) => ReactNode
export type MiddlewareRenderHeader<T = any> = (children: ReactNode, options: Prettify<Pick<RenderOptions<T>, 'columns' | 'columnDescriptor'>>) => ReactNode
export type MiddlewareRenderHeaderRow<T = any> = (children: ReactNode, options: Prettify<Pick<RenderOptions<T>, 'columns' | 'columnDescriptor'>>) => ReactNode
export type MiddlewareRenderHeaderCell<T = any> = (children: ReactNode, options: Prettify<Pick<RenderOptions<T>, 'columns' | 'columnDescriptor' | 'column' | 'columnWidths'>>) => ReactNode
export type MiddlewareRenderBodyWrapper<T = any> = (children: ReactNode, options: Prettify<Pick<RenderOptions<T>, 'columns' | 'columnDescriptor' | 'startRowIndex'>>) => ReactNode
export type MiddlewareRenderBodyRoot<T = any> = (children: ReactNode, options: Prettify<Pick<RenderOptions<T>, 'columns' | 'columnDescriptor' | 'startRowIndex'>>) => ReactNode
export type MiddlewareRenderBody<T = any> = (children: ReactNode, options: Prettify<Pick<RenderOptions<T>, 'columns' | 'columnDescriptor' | 'startRowIndex'>>) => ReactNode
export type MiddlewareRenderBodyContent<T = any> = (children: ReactNode, options: Prettify<Pick<RenderOptions<T>, 'columns' | 'columnDescriptor' | 'startRowIndex'>>) => ReactNode
export type MiddlewareRenderRow<T = any> = (children: ReactNode, options: Prettify<Pick<RenderOptions<T>, 'columns' | 'columnDescriptor' | 'rowIndex' | 'rowData'>>) => ReactNode
export type MiddlewareRenderCell<T = any> = (children: ReactNode, options: Prettify<Pick<RenderOptions<T>, 'column'>>) => ReactNode

export type MergedMiddlewareRender<T = any> = MiddlewareRender<T>
  | MiddlewareRenderRoot<T>
  | MiddlewareRenderContent<T>
  | MiddlewareRenderHeaderWrapper<T>
  | MiddlewareRenderHeaderRoot<T>
  | MiddlewareRenderHeader<T>
  | MiddlewareRenderHeaderRow<T>
  | MiddlewareRenderHeaderCell<T>
  | MiddlewareRenderBodyWrapper<T>
  | MiddlewareRenderBodyRoot<T>
  | MiddlewareRenderBody<T>
  | MiddlewareRenderBodyContent<T>
  | MiddlewareRenderRow<T>
  | MiddlewareRenderCell<T>

export interface MiddlewareRenders {
  /**
   * 自定义最外层渲染，children 为 整个 VirtualTable。
   */
  render?: MiddlewareRender
  /**
   * 自定义 TableRoot(div.virtual-table) 的渲染。
   * @note 注意：出于性能考虑，**需要自行对函数 memo**
   */
  renderRoot?: MiddlewareRenderRoot
  /**
   * 自定义渲染，children 为（TableHeader、TableBody）。
   */
  renderContent?: MiddlewareRenderContent
  /**
   * 自定义渲染 TableHeader。children 为 div.virtual-table-header
   * @note 注意：出于性能考虑，**需要自行对函数 memo**
   */
  renderHeaderWrapper?: MiddlewareRenderHeaderWrapper
  /**
   * children 为 table
   * @note 注意：出于性能考虑，**需要自行对函数 memo**
   */
  renderHeaderRoot?: MiddlewareRenderHeaderRoot
  /**
   * children 为 thead
   * @note 注意：出于性能考虑，**需要自行对函数 memo**
   */
  renderHeader?: MiddlewareRenderHeader
  /**
   * children 为 tr
   * @note 注意：出于性能考虑，**需要自行对函数 memo**
   */
  renderHeaderRow?: MiddlewareRenderHeaderRow
  /**
   * children 为 th
   * @note 注意：出于性能考虑，**需要自行对函数 memo**
   */
  renderHeaderCell?: MiddlewareRenderHeaderCell
  /**
   * 自定义渲染 TableBody。children 为 div.virtual-table-body-wrapper
   * @note 注意：出于性能考虑，**需要自行对函数 memo**
   */
  renderBodyWrapper?: MiddlewareRenderBodyWrapper
  /**
   * children 为 table.virtual-table-body
   * @note 注意：出于性能考虑，**需要自行对函数 memo**
   */
  renderBodyRoot?: MiddlewareRenderBodyRoot
  /**
   * children 为 tbody
   * @note 注意：出于性能考虑，**需要自行对函数 memo**
   */
  renderBody?: MiddlewareRenderBody
  /**
   * 默认情况下 children 是 ReactNode[]，即 tbody 下渲染的各个 Row
   */
  renderBodyContent?: MiddlewareRenderBodyContent
  /**
   * children 为 tr
   * @note 注意：出于性能考虑，**需要自行对函数 memo**
   */
  renderRow?: MiddlewareRenderRow
  /**
   * children 为 td
   * @note 注意：出于性能考虑，**需要自行对函数 memo**
   */
  renderCell?: MiddlewareRenderCell
}
