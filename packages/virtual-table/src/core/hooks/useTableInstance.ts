import type { TableInstance as Instance } from '../types'
import { useMemo } from 'react'

export interface InternalHook {
  implGetCurrentProps: (fn: Instance['getCurrentProps']) => void
  implGetColumns: (fn: Instance['getColumns']) => void
  implGetDOM: (fn: Instance['getDOM']) => void
  implGetRowHeightMap: (fn: Instance['getRowHeightMap']) => void
  implGetRowVirtualizeState: (fn: Instance['getRowVirtualizeState']) => void
  implScrollValueByRowIndex: (fn: Instance['getScrollValueByRowIndex']) => void
  implScrollValueByColumnKey: (fn: Instance['getScrollValueByColumnKey']) => void
  implScrollToRow: (fn: Instance['scrollToRow']) => void
  implScrollToColumn: (fn: Instance['scrollToColumn']) => void
  implScrollTo: (fn: Instance['scrollTo']) => void
  implGetColumnByKey: (fn: Instance['getColumnByKey']) => void
  implGetColumnByIndex: (fn: Instance['getColumnByIndex']) => void
  implGetColumnKeyByIndex: (fn: Instance['getColumnKeyByIndex']) => void
  implGetColumnWidths: (fn: Instance['getColumnWidths']) => void
  implGetColumnWidthByKey: (fn: Instance['getColumnWidthByKey']) => void
}

export type InternalInstance = Instance & {
  getInternalHooks: () => InternalHook
}

class TableInstance {
  constructor() {
    this.getInstance = this.getInstance.bind(this)
    this.getInternalHooks = this.getInternalHooks.bind(this)
  }

  instance: Instance = {
    getCurrentProps() {
      throw new Error('getCurrentProps() has not been implemented yet')
    },
    getColumns() {
      throw new Error('getColumns() has not been implemented yet')
    },
    getDOM() {
      throw new Error('getDOM() has not been implemented yet')
    },
    getRowHeightMap() {
      throw new Error('getRowHeightMap() has not been implemented yet')
    },
    getRowVirtualizeState() {
      throw new Error('getRowVirtualizeState() has not been implemented yet')
    },
    getScrollValueByRowIndex() {
      throw new Error('getScrollValueByRowIndex() has not been implemented yet')
    },
    getScrollValueByColumnKey() {
      throw new Error('getScrollValueByColumnKey() has not been implemented yet')
    },
    scrollToRow() {
      throw new Error('scrollToRow() has not been implemented yet')
    },
    scrollToColumn() {
      throw new Error('scrollToColumn() has not been implemented yet')
    },
    scrollTo() {
      throw new Error('scrollTo() has not been implemented yet')
    },
    getColumnByKey() {
      throw new Error('getColumnByKey() has not been implemented yet')
    },
    getColumnByIndex() {
      throw new Error('getColumnByIndex() has not been implemented yet')
    },
    getColumnKeyByIndex() {
      throw new Error('getColumnKeyByIndex() has not been implemented yet')
    },
    getColumnWidths() {
      throw new Error('getColumnWidths() has not been implemented yet')
    },
    getColumnWidthByKey() {
      throw new Error('getColumnWidthByKey() has not been implemented yet')
    },
  }

  getInternalHooks(): InternalHook {
    return {
      implGetCurrentProps: (fn) => {
        this.instance.getCurrentProps = fn
      },
      implGetColumns: (fn) => {
        this.instance.getColumns = fn
      },
      implGetDOM: (fn) => {
        this.instance.getDOM = fn
      },
      implGetRowVirtualizeState: (fn) => {
        this.instance.getRowVirtualizeState = fn
      },
      implGetRowHeightMap: (fn) => {
        this.instance.getRowHeightMap = fn
      },
      implScrollValueByRowIndex: (fn) => {
        this.instance.getScrollValueByRowIndex = fn
      },
      implScrollValueByColumnKey: (fn) => {
        this.instance.getScrollValueByColumnKey = fn
      },
      implScrollToRow: (fn) => {
        this.instance.scrollToRow = fn
      },
      implScrollToColumn: (fn) => {
        this.instance.scrollToColumn = fn
      },
      implScrollTo: (fn) => {
        this.instance.scrollTo = fn
      },
      implGetColumnByKey: (fn) => {
        this.instance.getColumnByKey = fn
      },
      implGetColumnByIndex: (fn) => {
        this.instance.getColumnByIndex = fn
      },
      implGetColumnKeyByIndex: (fn) => {
        this.instance.getColumnKeyByIndex = fn
      },
      implGetColumnWidths: (fn) => {
        this.instance.getColumnWidths = fn
      },
      implGetColumnWidthByKey: (fn) => {
        this.instance.getColumnWidthByKey = fn
      },
    }
  }

  getInstance(): InternalInstance {
    return {
      ...(Object.keys(this.instance).reduce<Instance>((result, key) => {
        // @ts-expect-error I just don't want to write some boilerplate code, so I use traversal, but there is no problem at runtime
        result[key as keyof Instance] = (...rest: unknown[]) => {
          return (this.instance[key as keyof Instance] as (...rest: unknown[]) => unknown)(...rest)
        }
        return result
      }, {} as Instance)),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      getInternalHooks: this.getInternalHooks,
    }
  }
}

export function useTableInstance(instance?: Instance) {
  return useMemo(() => {
    if (instance == null) {
      return new TableInstance().getInstance() as Instance
    }
    return instance
  }, [instance])
}
