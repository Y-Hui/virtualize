## tableSelection 数据选择

单选/多选 Table 数据。

### usage

```tsx
import '@are-visual/virtual-table/middleware/selection/styles.css'
import { tableSelection } from '@are-visual/virtual-table/middleware/selection'

import { useTablePipeline } from '@are-visual/virtual-table'

const pipeline = useTablePipeline({
  use: [
    tableSelection({
      onChange(selectedRowKeys, selectedRows, info) {
        console.log({ selectedRowKeys, selectedRows, info })
      },
    }),
  ],
})
```

### API

| Prop      | 说明 | 类型                          | 默认值 | 版本 |
| --------- | ---- | ----------------------------- | ------ | ---- |
| component | 自定义选择框渲染组件 | ComponentType\<SelectionProps\> |        |      |
| preserveSelectedRowKeys | 当数据被删除时仍然保留选项的 `key` | boolean | | |
| multiple | 开启多选 | boolean | true | |
| selectedRowKeys | 已选择的数据 `key` | Key[] | | |
| defaultSelectedRowKeys | 默认选择的数据 `key` | Key[] | | |
| onChange | 选中项发生变化时的回调 |  (*selectedRowKeys*, *selectedRows*, *info*) => void| | |
| getSelectionProps | 选择框的 Props | (*record*) => SelectionProps | | |
| onSelect | 选择/取消选择某行的回调 | (*record*, *selected*, *selectedRows*, *nativeEvent*) => void | | |
| hideSelectAll | 隐藏表头全选勾选框 | boolean | false | |
| fixed | 把选择框列固定在左侧 | boolean |  | |
| columnWidth | 列宽 |  string \| number| 32 | |
| columnTitle | 自定义表头 |  ReactNode \| ((*checkboxNode*, *props*: SelectionColumnTitleProps) => ReactNode)| | |
| renderCell | 自定义选择框渲染 | (*value*, *record*, *index*, *originNode*) => ReactNode | | |
| onCell | 设置单元格属性，用法与 Column 的 `onCell` 相同 | (*data*, *index*) => HTMLAttributes | | |
| extraColumnProps | 额外的 columns 属性（一般配合其他中间件使用） | object |  | |

#### 类型签名

```ts
interface SelectionProps {
  multiple?: boolean
  value?: boolean
  onChange?: (nextValue: boolean, e: Event) => void
  indeterminate?: boolean
  disabled?: boolean
}

type SelectionColumnTitleProps = SelectionProps & {
  allKeys: Key[]
  onClear: () => void
  onSelectAll: () => void
  onSelectInvert: () => void
}
```


### CSS Variables

| Variable                              | 说明                        | 默认值   | 版本 |
| ------------------------------------- | --------------------------- | -------- | ---- |
| --virtual-table-row-selected-bg       | 选中后 row 的背景色         | \#e6f4ff |      |
| --virtual-table-row-selected-hover-bg | hover 时选中后 row 的背景色 | \#bae0ff |      |
