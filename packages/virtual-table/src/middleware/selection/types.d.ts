import type { AnyObject, TableRowSelection as Selection } from 'antd/es/table/interface'

export interface TableRowSelection<T = AnyObject> extends Selection<T> {
  disableResize?: boolean
}
