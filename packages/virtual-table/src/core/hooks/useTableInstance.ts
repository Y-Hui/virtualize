import type { TableInstance as Instance, TableInstanceBuildIn } from '../types'
import { useState } from 'react'

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
type InstanceShape = TableInstanceBuildIn & Pick<Instance, 'extend'> & Record<PropertyKey, Function>

class TableInstance {
  constructor() {
    this.getInstance = this.getInstance.bind(this)
  }

  getInstance() {
    const buildInMethods: (keyof TableInstanceBuildIn)[] = [
      'getCurrentProps',
      'getColumns',
      'getDataSource',
      'getDOM',
      'getRowHeightMap',
      'getRowVirtualizeState',
      'getScrollValueByRowIndex',
      'getScrollValueByColumnKey',
      'scrollToRow',
      'scrollToColumn',
      'scrollTo',
      'getColumnByKey',
      'getColumnByIndex',
      'getColumnKeyByIndex',
      'getColumnWidths',
      'getColumnWidthByKey',
    ]

    const extendInstance: InstanceShape = {
      ...buildInMethods.reduce<TableInstanceBuildIn>((result, fnName) => {
        result[fnName] = () => {
          throw new Error(`${fnName}() has not been implemented yet`)
        }
        return result
      }, {} as TableInstanceBuildIn),
      extend: (args) => {
        Object.keys(args).forEach((fnName) => {
          extendInstance[fnName] = args[fnName]
        })
      },
    }
    return extendInstance
  }
}

export function useTableInstance<T>(instance?: Instance<T>) {
  const [state] = useState(() => {
    if (instance == null) {
      return new TableInstance().getInstance()
    }
    return instance
  })
  return state as Instance<T>
}
