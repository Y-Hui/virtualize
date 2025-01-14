/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TableRowSelection as AntdTableRowSelection } from 'antd/es/table/interface'
import type {
  TableRowSelection as RawTableRowSelection,
} from 'virtual-table/src/middleware/selection'

export type TableRowSelection<T = any> = Omit<RawTableRowSelection<T>, 'multiple' | 'component'> & Pick<AntdTableRowSelection, 'selections'> & {
  type?: 'checkbox' | 'radio'
}
