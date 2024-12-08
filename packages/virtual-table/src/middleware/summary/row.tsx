import type { CSSProperties, FC, MouseEvent, ReactNode } from 'react'

export interface SummaryRowProps {
  children?: ReactNode
  className?: string
  style?: CSSProperties
  onClick?: (e?: MouseEvent<HTMLElement>) => void
}

const SummaryRow: FC<SummaryRowProps> = ({ children, ...props }) => {
  return <tr {...props}>{children}</tr>
}

export default SummaryRow
