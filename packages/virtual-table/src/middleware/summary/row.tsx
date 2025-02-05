/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnType } from '@are-visual/virtual-table'
import type { CSSProperties, FC, Key, MouseEvent, ReactNode } from 'react'
import { Fragment, useContext } from 'react'
import { SummaryContext } from './context/columns'

export interface SummaryRowProps {
  children?: ReactNode | ((column: ColumnType<any>, key: Key) => ReactNode)
  className?: string
  style?: CSSProperties
  onClick?: (e?: MouseEvent<HTMLElement>) => void
}

const SummaryRow: FC<SummaryRowProps> = ({ children, ...props }) => {
  const descriptor = useContext(SummaryContext)

  if (typeof children === 'function') {
    if (descriptor != null) {
      return (
        <tr {...props}>
          {descriptor.map((item) => {
            const { key } = item
            if (item.type === 'blank') {
              return <td key={key} />
            }
            const { column } = item
            return <Fragment key={key}>{children(column, key)}</Fragment>
          })}
        </tr>
      )
    } else {
      throw new Error('SummaryRow is missing the columns context and cannot use children as a function.')
    }
  }

  return <tr {...props}>{children}</tr>
}

export default SummaryRow
