import type { CSSProperties, MouseEvent } from 'react'
import { useContext } from 'react'

import Cell from './cell'
import { SummaryContext } from './context/columns'

export interface SummaryOutletProps<T> {
  className?: string
  style?: CSSProperties
  dataSource: T[]
  onClick?: (e?: MouseEvent<HTMLElement>) => void
}

function SummaryOutlet<T>(props: SummaryOutletProps<T>) {
  const { dataSource, ...restProps } = props
  const descriptor = useContext(SummaryContext)

  if (descriptor == null) {
    throw new Error(
      'SummaryOutlet is missing the columns context and cannot use children as a function.',
    )
  }

  return (
    <tr {...restProps}>
      {descriptor.map((item) => {
        const { key } = item
        if (item.type === 'blank') {
          return <td key={key} />
        }
        const { column } = item
        const { render, ...cellProps } = column.summary ?? {}
        return (
          <Cell {...cellProps} key={key} columnKey={key}>
            {render?.(dataSource)}
          </Cell>
        )
      })}
    </tr>
  )
}

export default SummaryOutlet
