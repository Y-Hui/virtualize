/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  TableRowSelection as RawTableRowSelection,
} from '@are-visual/virtual-table/middleware/selection'
import type { TableRowSelection as AntdTableRowSelection } from 'antd/es/table/interface'

export type TableRowSelection<T = any> = Omit<RawTableRowSelection<T>, 'multiple' | 'component'> & Pick<AntdTableRowSelection, 'selections'> & {
  type?: 'checkbox' | 'radio'
}
