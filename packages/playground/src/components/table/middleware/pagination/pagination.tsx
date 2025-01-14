import type { FC } from 'react'
import type { TablePaginationConfig } from './types'
import { Pagination as AntdPagination } from 'antd'
import clsx from 'clsx'
import { useState } from 'react'

const Pagination: FC<TablePaginationConfig> = (props) => {
  const {
    position,
    className,
    defaultCurrent = 1,
    defaultPageSize = 10,
    onChange,
    current: originCurrent,
    pageSize: originPageSize,
    ...rest
  } = props

  const place = position?.[0] ?? 'bottomRight'
  const positionClassName = place.toLowerCase().replace(/top|bottom/, '')

  const isControllableCurrent = 'current' in props
  const isControllablePageSize = 'pageSize' in props

  const [innerCurrent, setInnerCurrent] = useState(defaultCurrent)
  const [innerPageSize, setInnerPageSize] = useState(defaultPageSize)

  const current = isControllableCurrent ? originCurrent : innerCurrent
  const pageSize = isControllableCurrent ? originPageSize : innerPageSize

  const onUpdate = (page: number, size: number) => {
    if (!isControllableCurrent) {
      setInnerCurrent(page)
    }
    if (!isControllablePageSize) {
      setInnerPageSize(size)
    }
    onChange?.(page, size)
  }

  return (
    <AntdPagination
      showSizeChanger
      {...rest}
      current={current}
      pageSize={pageSize}
      className={clsx('virtual-table-pagination', `virtual-table-pagination-${positionClassName}`, className)}
      onChange={onUpdate}
    />
  )
}

export default Pagination
