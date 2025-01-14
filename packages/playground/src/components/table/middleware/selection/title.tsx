import './styles.scss'

import type { CheckboxProps, MenuProps } from 'antd'
import type { Key } from 'react'
import type { TableRowSelection } from './types'
import { DownOutlined } from '@ant-design/icons'
import { Checkbox, ConfigProvider, Dropdown, Table } from 'antd'
import clsx from 'clsx'
import { useContext } from 'react'

export interface SelectionTitleProps
  extends Pick<TableRowSelection<unknown>, 'selections'>,
  Pick<CheckboxProps, 'onChange' | 'checked' | 'indeterminate' | 'disabled'> {
  onSelectAll: () => void
  onSelectInvert: () => void
  onClear: () => void
  allKeys: Key[]
}

type DefaultSelectionsType =
  | typeof Table.SELECTION_ALL
  | typeof Table.SELECTION_INVERT
  | typeof Table.SELECTION_NONE

const DEFAULT_SELECTIONS_KEYS: DefaultSelectionsType[] = [
  Table.SELECTION_ALL,
  Table.SELECTION_INVERT,
  Table.SELECTION_NONE,
]

type ItemType = NonNullable<MenuProps['items']>[number]

function SelectionTitle(props: SelectionTitleProps) {
  const {
    checked,
    onChange,
    indeterminate,
    selections: rawSelections,
    onClear,
    onSelectAll,
    onSelectInvert,
    allKeys,
    disabled,
  } = props

  const { locale } = useContext(ConfigProvider.ConfigContext)
  const tableLocale = locale?.Table

  const DEFAULT_SELECTIONS: Record<DefaultSelectionsType, ItemType> = {
    [Table.SELECTION_ALL]: {
      key: Table.SELECTION_ALL,
      label: tableLocale?.selectAll,
      onClick: onSelectAll,
    },
    [Table.SELECTION_INVERT]: {
      key: Table.SELECTION_INVERT,
      label: tableLocale?.selectInvert,
      onClick: onSelectInvert,
    },
    [Table.SELECTION_NONE]: {
      key: Table.SELECTION_NONE,
      label: tableLocale?.selectNone,
      onClick: onClear,
    },
  }

  const selections = rawSelections === true
    ? DEFAULT_SELECTIONS_KEYS
    : Array.isArray(rawSelections)
      ? rawSelections
      : undefined

  return (
    <div className={clsx('virtual-table-selection')}>
      <Checkbox
        checked={checked}
        indeterminate={indeterminate}
        disabled={disabled}
        onChange={onChange}
      />
      {selections && (
        <div className="virtual-table-selection-extra">
          <Dropdown
            menu={{
              items: selections.reduce<ItemType[]>((items, item) => {
                if (typeof item === 'string') {
                  if (DEFAULT_SELECTIONS_KEYS.includes(item)) {
                    items.push(DEFAULT_SELECTIONS[item])
                  }
                } else if ('key' in item) {
                  items.push({
                    key: item.key,
                    label: item.text,
                    onClick: () => {
                      item.onSelect?.(allKeys)
                    },
                  })
                }
                return items
              }, []),
            }}
          >
            <DownOutlined />
          </Dropdown>
        </div>
      )}
    </div>
  )
}

export default SelectionTitle
