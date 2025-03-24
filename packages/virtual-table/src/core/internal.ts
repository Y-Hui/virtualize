import type { Key } from 'react'
import type { ColumnType } from './types'

export interface NecessaryProps<T> {
  dataSource: T[]
  columns: ColumnType<T>[]
  // 假设 T 类型的声明是 { title: string }，但是实际运行时却是 { id: number; title: string; }
  // 那么 rowKey="id" 则会抛出一个错误：类型“"id"”不可分配给类型“keyof Data”
  // 这个联合类型解决了上述问题，你可以传入合法的 key 或者是一个自定义的字符串
  rowKey: (keyof T | (string & {})) | ((rowData: T) => Key)
}
