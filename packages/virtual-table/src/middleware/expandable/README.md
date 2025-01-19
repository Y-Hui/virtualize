## tableExpandable

为 Table 增加行展开功能。

### usage

```tsx
import '@are-visual/virtual-table/middleware/expandable/styles.css'
import { tableExpandable } from '@are-visual/virtual-table/middleware/expandable'

import { useTablePipeline } from '@are-visual/virtual-table'

const pipeline = useTablePipeline({
  use: [
    tableExpandable({
      fixed: 'left',
      rowExpandable: (record) => true,
      expandedRowRender(record) {
        return <div>Expanded Content</div>
      },
    }),
  ],
})
```

### API

| Prop       | 说明                                            | 类型                                              | 默认值 | 版本 |
| ---------- | ----------------------------------------------- | ------------------------------------------------- | ------ | ---- |
| expandedRowKeys | 控制行展开 | Key[] | -      |      |
| defaultExpandedRowKeys | 默认展开的行 | Key[] | - | |
| expandedRowRender | 行展开后显示的内容 | (*record*, *index*, *indent*, *expanded*) => ReactNode | - | |
| columnTitle | 自定义展开列表头 | ReactNode | - | |
| expandRowByClick | 通过点击以展开行 | boolean | false | |
| expandIcon | 自定义展开图标 | (*props*) => ReactNode | - | |
| onExpand | 展开/收起时触发 | (*expanded*, *record*) => void | - | |
| onExpandedRowsChange | 展开的行变化时触发 | (*expandedKeys*) => void | - | |
| defaultExpandAllRows | 默认展开所有行（非异步数据时有效） | boolean | false | |
| showExpandColumn | 是否显示展开图标列 | boolean | true | |
| expandedRowClassName | 展开行的 className | string \| RowClassName | - | |
| rowExpandable | 设置是否允许行展开 | (*record*) => boolean | - | |
| columnWidth | 列宽 | number \| string| 50 | |
| fixed | 固定列 | `left` \| `right` | - | |
| extraColumnProps | 额外的 columns 属性（一般配合其他中间件使用） | object | - | |

#### 类型签名

```ts
type TriggerEventHandler<T> = (record: T, event: MouseEvent<HTMLElement>) => void

interface RenderExpandIconProps<T> {
  prefixCls: string
  expanded: boolean
  record: T
  expandable: boolean
  onExpand: TriggerEventHandler<T>
}
type RowClassName<T> = (record: T, index: number, indent: number) => string
type RenderExpandIcon<T> = (props: RenderExpandIconProps<T>) => ReactNode
type ExpandedRowRender<T> = (record: T, index: number, indent: number, expanded: boolean) => ReactNode
```



### CSS Variables

| Variable                                         | 说明                     | 默认值              | 版本 |
| ------------------------------------------------ | ------------------------ | ------------------- | ---- |
| --virtual-table-expanded-row-background          | 展开行背景色             | rgba(0, 0, 0, 0.02) |      |
|                                                  |                          |                     |      |
| --virtual-table-expanded-icon-width              | 展开图标宽度             | 17px                |      |
| --virtual-table-expanded-icon-height             | 展开图标高度             | 17px                |      |
| --virtual-table-expanded-icon-background         | 展开图标背景色           | #fff                |      |
|                                                  |                          |                     |      |
| --virtual-table-expanded-icon-border-color       | 展开图标边框颜色         | \#f0f0f0            |      |
| --virtual-table-expanded-icon-hover-border-color | hover 时展开图标边框颜色 | currentColor        |      |
|                                                  |                          |                     |      |
| --virtual-table-expanded-icon-color              | 展开图标前景色           | rgba(0, 0, 0, 0.88) |      |
| --virtual-table-expanded-icon-hover-color        | hover 时展开图标前景色   | \#69b1ff            |      |
|                                                  |                          |                     |      |
| --virtual-table-expanded-icon-radius             | 展开图标圆角大小         | 6px                 |      |
