/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from 'react'
import type { NecessaryProps } from '../internal'
import type { ColumnType, OnRowType } from '../types'

export interface MiddlewareContext<T> extends NecessaryProps<T> {
  visibleCount: number
}

export interface MiddlewareResult<T> extends MiddlewareContext<T>, MiddlewareRenders {
  rowClassName?: (record: T, index: number) => string
  onRow?: OnRowType<T>
}

export type Middleware<T> = (context: MiddlewareContext<T>) => MiddlewareResult<T>

interface RenderOptions {
  /** renderCell、renderHeaderCell 存在 */
  column: ColumnType<any>
  /** renderCell、renderHeaderCell 存在 */
  columnIndex: number
  /** 列宽。renderHeaderCell 存在 */
  columnWidthList: number[]

  /** renderRow 存在 */
  rowIndex: number
  /** renderRow 存在 */
  columns: ColumnType<any>[]
  /** renderRow 存在 */
  rowData: any
}

export type PipelineRenderOptions = Partial<RenderOptions>
export type PipelineRender = (children: ReactNode, options: PipelineRenderOptions) => ReactNode

export type MiddlewareRender = (children: ReactNode, options: Pick<RenderOptions, 'columns'>) => ReactNode
export type MiddlewareRenderRoot = (children: ReactNode, options: Pick<RenderOptions>) => ReactNode
export type MiddlewareRenderContent = (children: ReactNode, options: Pick<RenderOptions, 'columns'>) => ReactNode
export type MiddlewareRenderHeaderWrapper = (children: ReactNode, options: Pick<RenderOptions, 'columns'>) => ReactNode
export type MiddlewareRenderHeaderRoot = (children: ReactNode, options: Pick<RenderOptions, 'columns'>) => ReactNode
export type MiddlewareRenderHeader = (children: ReactNode, options: Pick<RenderOptions, 'columns'>) => ReactNode
export type MiddlewareRenderHeaderRow = (children: ReactNode, options: Pick<RenderOptions, 'columns'>) => ReactNode
export type MiddlewareRenderHeaderCell = (children: ReactNode, options: Pick<RenderOptions, 'columns' | 'column' | 'columnIndex' | 'columnWidthList'>) => ReactNode
export type MiddlewareRenderBodyWrapper = (children: ReactNode, options: Pick<RenderOptions, 'columns'>) => ReactNode
export type MiddlewareRenderBodyRoot = (children: ReactNode, options: Pick<RenderOptions, 'columns'>) => ReactNode
export type MiddlewareRenderBody = (children: ReactNode, options: Pick<RenderOptions, 'columns'>) => ReactNode
export type MiddlewareRenderRow = (children: ReactNode, options: Pick<RenderOptions, 'columns' | 'rowIndex' | 'rowData'>) => ReactNode
export type MiddlewareRenderCell = (children: ReactNode, options: Pick<RenderOptions, 'column' | 'columnIndex'>) => ReactNode

export type MergedMiddlewareRender = MiddlewareRender
  | MiddlewareRenderRoot
  | MiddlewareRenderContent
  | MiddlewareRenderHeaderWrapper
  | MiddlewareRenderHeaderRoot
  | MiddlewareRenderHeader
  | MiddlewareRenderHeaderRow
  | MiddlewareRenderHeaderCell
  | MiddlewareRenderBodyWrapper
  | MiddlewareRenderBodyRoot
  | MiddlewareRenderBody
  | MiddlewareRenderRow
  | MiddlewareRenderCell

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
