## Virtualize

### VirtualTable

` @are-visual/virtual-table` 是一个基于插件机制实现的虚拟表格组件，仅支持 React。

#### Install

```bash
npm install @are-visual/virtual-table

yarn add @are-visual/virtual-table

pnpm add @are-visual/virtual-table
```

#### Usage

```tsx
import type { ColumnType } from '@are-visual/virtual-table'
import { VirtualTable } from '@are-visual/virtual-table'

interface User {
  id: number
  name: string
  age: number
}

const dataSource: User[] = [
  { id: 1, name: 'Allen', age: 26 },
  { id: 2, name: 'Andrew', age: 43 },
  { id: 3, name: 'Max', age: 12 },
]

const columns: ColumnType<User>[] = [
  {
    dataIndex: 'id',
    title: 'UID',
    width: 100,
    render(value) {
      return `#${value}`
    },
  },
  {
    dataIndex: 'name',
    title: 'Username',
    width: 100,
  },
  {
    dataIndex: 'age',
    title: 'Age',
    align: 'right',
    width: 100,
  },
  {
    key: 'actions',
    title: 'Action',
    width: 100,
    render(value, record, index) {
      return (
        <button type="button">View details</button>
      )
    },
  },
]

function App() {
  return (
    <VirtualTable
      rowKey="id"
      dataSource={dataSource}
      columns={columns}
      estimatedRowHeight={37}
    />
  )
}
```

#### Columns 定义

| Prop Name    | 说明                                                         | 类型                                      | 默认值 | 版本 |
| ------------ | ------------------------------------------------------------ | ----------------------------------------- | ------ | ---- |
| key          | React 需要的 key 属性，如果已经指定了唯一的 dataIndex，可忽略此属性 | Key                                       |        |      |
| dataIndex    | 指定 dataSource 中的 key 用于单元格内容展示                  | string                                    |        |      |
| className    | 每列样式名称                                                 | string                                    |        |      |
| colSpan      | **表头**列合并，设置为 0 时，不渲染                          | number |        |      |
| title        | 表头内容                                                     | ReactNode |        |      |
| align        | 单元格对齐方式                                               | `left` \|`right` \|`center` |        |      |
| ~~minWidth~~ | ~~列最小宽度~~                                               | ~~number~~                                |        | `v0.11`废弃 |
| width        | 列宽度                                                       | number \| ~~string~~                      |        | `v0.11`废弃 `string`类型 |
| fixed        | 固定列                                                       | `left` \| `right` |                           |        |
| render       | 自定义单元格渲染内容                                         | (*value*, *record*, *index*) => ReactNode |        |      |
| onHeaderCell | 设置表头单元格属性 | (column,  index) => TdHTMLAttributes                          |        |      |
| onCell       | 设置单元格属性 | (column,  index) => TdHTMLAttributes |        |      |

#### Table Props

| Prop Name            | 说明                                                    | 类型                                    | 默认值                        | 版本    |
| -------------------- | ------------------------------------------------------- | --------------------------------------- | ----------------------------- | ------- |
| ref                  | 设置最外层 div ref                                      | Ref\<HTMLDivElement\>                   |                               |         |
| tableBodyRef         | 设置 body 部分 table ref                                | Ref\<HTMLTableElement\>                 |                               |         |
| className            | 样式类名                                                | string                                  |                               |         |
| style                | 样式                                                    | CSSProperties                           |                               |         |
| tableBodyClassName   | body 样式类名                                           | string                                  |                               |         |
| tableBodyStyle       | body 样式                                               | CSSProperties                           |                               |         |
| columns              | 表格列配置                                              | ColumnType[]                            |                               |         |
| dataSource           | 表格数据源                                              | object[]                                |                               |         |
| rowKey               | 表格行 key 的取值                                       | string \| `(data) => React.Key`         | `key`                         | >=0.5.0 |
| estimatedRowHeight   | 预计每行高度                                            | number                                  | 46                            |         |
| estimatedColumnWidth | 预计每列宽度<br />设置后将会开启横向虚拟化              | number                                  |                               |         |
| overscanRows         | 额外在首尾渲染数据条数                                  | number                                  | 5                             |         |
| overscanColumns      | 横向虚拟化时，在头和尾额外渲染多少列                    | number                                  | 3                             |         |
| stickyHeader         | 表头吸顶<br />为 true 时 top 为 0，为 number 则是偏移量 | number \| boolean                       |                               |         |
| defaultColumnWidth   | 缺失宽度设置时的默认值（与虚拟化无关）                  | number                                  | 100                           | >=0.2   |
| pipeline             | 插件实例                                                | TablePipeline                           |                               |         |
| rowClassName         | 表格行样式类名                                          | (*record*, *index*) => string           |                               |         |
| onRow                | 设置行属性                                              | (*record*, *index*) => TdHTMLAttributes |                               |         |
| getOffsetTop         | 计算顶部偏移量                                          | () => number                            | 使用最外层 div 计算 offsetTop |         |
| virtualHeader        | 表头虚拟化                                              | boolean                                 | `true`                        | >0.1.0  |

#### getOffsetTop

![offset-layout](./docs/images/offset-top-layout.svg)

例如上图所示，业务开发中的常见布局形式，绿色部分即为 Table 组件之前的**额外区域**，若这一部分的 DOM 高度较高，滚动会导致可视区域内容计算出错，导致 Table 存在空白部分。

在虚拟列表的实现中，当滚动事件触发时，需要使用 `scrollTop` 与最接近滚动容器顶部的元素（锚点元素）位置进行比较，再得出最新的数据可视范围。

![offset-scroll-top](./docs/images/offset-scroll-top.svg)
如上图所示，当 Table 与滚动容器的上边缘相交时，数据可视范围计算才可以开始计算。而正是因为额外区域的存在，导致 Table 与滚动容器上边缘相交前，可视数据范围的计算便已经触发了，造成 Table 中存在空白行。

所以，`@are-visual/virtual-table` 提供了 `getOffsetTop` 属性，用于得知额外区域的具体高度，这样在数据可视范围计算时才能避免这个问题。

一般来说，你不太需要关注 `getOffsetTop`，因为它有一个默认实现：使用 table 的 DOM 节点计算与滚动容器之间的距离作为偏移量。

`getOffsetTop` 总是会在滚动事件中反复调用。

> 关于 `getOffsetTop` 的默认实现是否会造成额外重排/性能影响，还有待验证。若你实在担心，可以设置 getOffsetTop 以覆盖默认实现。

#### useTableInstance

一个提供编程式操作 VirtualTable 的 hook。

> 版本要求：>=v0.8.0

##### scrollToRow 滚动到指定行

```tsx
const instance = useTableInstance()

const onScroll = () => {
  // 通过索引值，滚动到第 10 行
  instance.scrollToRow(10)
  instance.scrollToRow(10, 'smooth') // 指定 behavior
}

<VirtualTable instance={instance} />
```

> 注意：由于是虚拟列表，行高是不确定的，若 `estimatedRowHeight` 不准确，scrollToRow 则无法准确滚动到对应的行。

##### scrollToColumn 滚动到指定列

```tsx
const instance = useTableInstance()

const onScroll = () => {
  // 通过 key，滚动到指定列
  instance.scrollToColumn('columnKey')
  instance.scrollToColumn('columnKey', 'smooth') // 指定 behavior
}

<VirtualTable instance={instance} />
```

> 注意：由于是虚拟列表，列宽是不确定的，若 `estimatedColumnWidth` 不准确，scrollToColumn 则无法准确滚动到对应的列。

##### scrollTo 手动滚动

```tsx
const instance = useTableInstance()

const onScroll = () => {
  // 使用像素值进行滚动，背后其实是对原生 DOM 节点的 scrollTo 进行的封装
  instance.scrollTo({ top: 0, left: 0 })
}

<VirtualTable instance={instance} />
```

##### getScrollValueByRowIndex

```tsx
const instance = useTableInstance()

const onScroll = () => {
  // 通过索引值，滚动到第 10 行所对应的数值
  console.log(instance.getScrollValueByRowIndex(10))
}
```

##### getScrollValueByColumnKey

```tsx
const instance = useTableInstance()

const onScroll = () => {
  // 通过 key，获取滚动到指定列所对应的数值
  console.log(instance.getScrollValueByColumnKey('columnKey'))
}
```

##### getDOM

有些时候，你不得不获取 DOM 节点来进行一些操作。

```tsx
const instance = useTableInstance()

const doSomething = () => {
  const { root, headerWrapper, bodyWrapper, bodyRoot, body } = instance.getDOM()
}

<VirtualTable instance={instance} />
```

##### getCurrentProps

有些时候，你可能不太方便获取到传递给 VirtualTable 的 props，那么你可以通过 `instance.getCurrentProps` 获取。

```tsx
const instance = useTableInstance()

const doSomething = () => {
  console.log(instance.getCurrentProps().stickyHeader)
}

<VirtualTable stickyHeader={120} instance={instance} />
```

##### getRowVirtualizeState 获取行虚拟化用到的数据

```tsx
const { startIndex, endIndex, overscan, estimateSize } = instance.getRowVirtualizeState()
```

##### getRowHeightMap 获取所有的行高信息

```ts
const heightMap = instance.getRowHeightMap()

heightMap.get(rowKey)
```

##### getColumnByKey 通过 columnKey 获取 column 定义

```ts
const column = instance.getColumnByKey(columnKey)
```

##### getColumnByIndex 通过索引获取 column 定义

```ts
const column = instance.getColumnByIndex(index)
```

##### getColumnKeyByIndex 通过索引获取 columnKey

```ts
const columnKey = instance.getColumnKeyByIndex(index)
```

##### getColumnWidths 获取所有的列宽

所有的列宽通过 columnKey 进行记录（无序）。

```ts
const widths = instance.getColumnWidths()
widths.get(columnKey)
```

##### getColumnWidthByKey 通过 columnKey 获取列宽

```ts
const width = instance.getColumnWidthByKey(columnKey)
```

##### getColumns 获取 middleware 处理过的 columns

```ts
const pipelineColumns = instance.getColumns()
```

##### getDataSource 获取 middleware 处理过的 dataSource

```ts
const pipelineDataSource = instance.getDataSource()
```

##### extend 自定义扩展函数

当你编写插件时想要提供一些函数用于手动调用，`extend` 能够帮你方便设置。

```tsx
import type { TableInstance } from '@are-visual/virtual-table'

declare module '@are-visual/virtual-table' {
  interface TableInstance {
    foo: () => void
  }
}

instance.extend({
  foo() {
    // do something...
  },
} satisfies Partial<TableInstance>)
```

通过以上的函数，你可以很方便的获取一些 VirtualTable 内部的数据，但是这些函数不能在 render 阶段中直接调用，否则会抛出 `has not been implemented yet` 错误。因为这些函数都在 VirtualTable 内部渲染阶段初始化，它们初始化完成后便能使用。建议在事件处理函数中调用。

你也许会发现有些函数能够在渲染阶段直接使用，但是并不能保证在未来的版本中均是如此。

#### 插件

`@are-visual/virtual-table` 提供一个 `useTablePipeline` hook 用于组合各种插件，为 Table 增加各式各样的功能。

目前插件列表：

- [columnResize 列宽调整](./packages/virtual-table/src/middleware/column-resize)
- [tableEmpty 空提示](./packages/virtual-table/src/middleware/empty)
- [tableExpandable 行展开](./packages/virtual-table/src/middleware/expandable)
- [horizontalScrollBar 水平滚动条](./packages/virtual-table/src/middleware/horizontal-scroll-bar)
- [tableLoading 加载状态](./packages/virtual-table/src/middleware/loading)
- [tableSelection 单选/多选](./packages/virtual-table/src/middleware/selection)
- [tableSummary 总结栏](./packages/virtual-table/src/middleware/summary)

```tsx
import '@are-visual/virtual-table/middleware/selection/styles.scss'
import { tableSelection } from '@are-visual/virtual-table/middleware/selection'

import '@are-visual/virtual-table/middleware/loading/styles.scss'
import { tableLoading } from '@are-visual/virtual-table/middleware/loading'

import { useState, type Key } from 'react'
import { useTablePipeline, VirtualTable } from '@are-visual/virtual-table'

function App() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([])

  const pipeline = useTablePipeline({
    use: [
      // 单选/多选插件
      tableSelection({
        selectedRowKeys,
        onChange(selectedRowKeys, selectedRows, info) {
          setSelectedRowKeys(selectedRowKeys)
        },
      }),
      
      // loading 插件
      tableLoading({ loading: false })
    ],
  })

  return (
    <VirtualTable
      pipeline={pipeline}
      rowKey="id"
      dataSource={dataSource}
      columns={columns}
      estimatedRowHeight={37}
    />
  )
}
```

#### 插件顺序

你可以指定 `priority` 来编排插件的顺序，数字越大越靠后。

例如下面的 `columnResize`，其他插件修改 columns 后，才会轮到 columnResize 执行，这样它才能获取到最新最完整的 columns.

```ts
const pipeline = useTablePipeline({
  use: [
    tableLoading({ loading: true }),

    { priority: 100, hook: columnResize()},
  ],
})
```

#### 合并

你可以使用 `pipeline` 属性合并外层传进来的插件，当你基于 VirtualTable 封装顶层组件又希望提供插件能力时，它会很有用。

```ts
const another = useTablePipeline({
  use: [
    tableLoading({ loading: true }),
    { priority: 100, hook: columnResize()},
  ],
})

const mergedPipeline = useTablePipeline({
  // 与 another 合并
  pipeline: another,
  use: [
    // 一些其他插件
  ],
})
```

#### 自定义插件

插件本身就是一个 react hook，它接受 `@are-visual/virtual-table` 传递的数据，处理再返回。

遵循下面这样的公式。当多个插件一起使用时，前一个插件返回的 context 会成为下一个插件所接收到的 context，所以这就是 pipeline。

![plugin 公式](./docs/images/plugin.svg)

##### 插件 context 定义

| key          | 说明                     | 类型         | 版本 |
| ------------ | ------------------------ | ------------ | ---- |
| dataSource   | 表格数据源               | object[]     |      |
| columns      | 表格列配置               | ColumnType[] |      |
| rowKey       | 表格行 key 的取值        | string       |      |
| estimatedRowHeight | 预计每行高度 | number       |      |
| rootRef | 最外层 div 元素 | RefObject\<HTMLDivElement\> | |
| headerWrapperRef | header 外层 div 元素 | RefObject\<HTMLDivElement\> | |
| bodyWrapperRef | body 外层 div 元素 | RefObject\<HTMLDivElement\> | |
| bodyRootRef | body 外层 table 节点 | RefObject\<HTMLTableElement\> | |
| bodyRef | tbody 元素 | RefObject\<HTMLTableSectionElement\> | |
| getScroller | 获取滚动容器 | () => ScrollElement \| undefined |  |
| getOffsetTop | 计算顶部偏移量 | () => number | |
| instance | 与 useTableInstance 一致 | TableInstance | >=0.8.0 |

##### 插件返回值定义

| key           | 说明                     | 类型                                    | 版本 |
| ------------- | ------------------------ | --------------------------------------- | ---- |
| dataSource    | 表格数据源               | object[]                                |      |
| columns       | 表格列配置               | ColumnType[]                            |      |
| rowKey        | 表格行 key 的取值        | string                                  |      |
| visibleRowSize  | 当前虚拟化下所显示的行数 | number                                  |      |
| rowClassName  | 自定义表格行 class       | (*record*, *index*) => string           |      |
| onRow         | 设置行属性               | (*record*, *index*) => TdHTMLAttributes |      |
| render | 自定义 Table 外层渲染 | MiddlewareRender| |
| renderRoot | 自定义 div.virtual-table 渲染 | MiddlewareRenderRoot| |
| renderContent |  | MiddlewareRenderContent| |
| renderHeaderWrapper | | MiddlewareRenderHeaderWrapper| |
| renderHeaderRoot | | MiddlewareRenderHeaderRoot| |
| renderHeader | Header 自定义渲染 | MiddlewareRenderHeader| |
| renderHeaderRow | 表头行自定义渲染 | MiddlewareRenderHeaderRow| |
| renderHeaderCell | 表头单元格自定义渲染 | MiddlewareRenderHeaderCell| |
| renderBodyWrapper | | MiddlewareRenderBodyWrapper| |
| renderBodyRoot | | MiddlewareRenderBodyRoot| |
| renderBody | 自定义 tbody 渲染 | MiddlewareRenderBody| |
| renderBodyContent | 表格 body 内容自定义 | MiddlewareRenderBodyContent | >=0.4.0 |
| renderRow | 表格行自定义渲染 | MiddlewareRenderRow| |
| renderCell | 单元格自定义渲染 | MiddlewareRenderCell| |

> 出于性能考虑，请自行 memo render 函数

##### Render 结构

```
Context
└── render(<TableRoot />)
    │
    └── renderRoot(div.virtual-table)
        │
        └── renderContent(<><TableHeader/><TableBody/></>)
            │
            ├── renderHeaderWrapper(<TableHeader />) div.virtual-table-header
            │   │
            │   └── renderHeaderRoot(<table />)
            │       ├── colgroup
            │       │
            │       └── renderHeader(<thead />)
            │           └── renderHeaderRow(<tr />)
            │               └── renderHeaderCell(<th />)
            │
            └── renderBodyWrapper(<TableBody />) div.virtual-table-body-wrapper
                │
                └── renderBodyRoot(table.virtual-table-body)
                    ├── colgroup
                    │
                    └── renderBody(<tbody />)
                        └── renderBodyContent(Row[])
                            └── renderRow(<tr />)
                                └── renderCell(<td />)
```

##### Render 类型签名

```ts
interface RenderOptions<T = any> {
  column: ColumnType<T>
  columnWidths: Map<Key, number>
  rowIndex: number
  columns: ColumnType<T>[]
  rowData: T
  startRowIndex: number
  columnDescriptor: ColumnDescriptor<T>[]
}

type MiddlewareRender<T = any> = (
  children: ReactNode,
  options: Pick<RenderOptions<T>, 'columns' | 'columnDescriptor'>
) => ReactNode

type MiddlewareRenderRoot<T = any> = (
  children: ReactNode,
  options: Omit<RenderOptions<T>, keyof RenderOptions<T>>
) => ReactNode

type MiddlewareRenderContent<T = any> = (
  children: ReactNode,
  options: Pick<RenderOptions<T>, 'columns' | 'columnDescriptor'>
) => ReactNode

type MiddlewareRenderHeaderWrapper<T = any> = (
  children: ReactNode,
  options: Pick<RenderOptions<T>, 'columns' | 'columnDescriptor'>
) => ReactNode

type MiddlewareRenderHeaderRoot<T = any> = (
  children: ReactNode,
  options: Pick<RenderOptions<T>, 'columns' | 'columnDescriptor'>
) => ReactNode

type MiddlewareRenderHeader<T = any> = (
  children: ReactNode,
  options: Pick<RenderOptions<T>, 'columns' | 'columnDescriptor'>
) => ReactNode

type MiddlewareRenderHeaderRow<T = any> = (
  children: ReactNode,
  options: Pick<RenderOptions<T>, 'columns' | 'columnDescriptor'>
) => ReactNode

type MiddlewareRenderHeaderCell<T = any> = (
  children: ReactNode,
  options: Pick<RenderOptions<T>, 'columns' | 'columnDescriptor' | 'column' | 'columnWidths'>
) => ReactNode

type MiddlewareRenderBodyWrapper<T = any> = (
  children: ReactNode,
  options: Pick<RenderOptions<T>, 'columns' | 'columnDescriptor' | 'startRowIndex'>
) => ReactNode

type MiddlewareRenderBodyRoot<T = any> = (
  children: ReactNode,
  options: Pick<RenderOptions<T>, 'columns' | 'columnDescriptor' | 'startRowIndex'>
) => ReactNode

type MiddlewareRenderBody<T = any> = (
  children: ReactNode,
  options: Pick<RenderOptions<T>, 'columns' | 'columnDescriptor' | 'startRowIndex'>
) => ReactNode

type MiddlewareRenderBodyContent<T = any> = (
  children: ReactNode,
  options: Pick<RenderOptions<T>, 'columns' | 'columnDescriptor' | 'startRowIndex'>
) => ReactNode

type MiddlewareRenderRow<T = any> = (
  children: ReactNode,
  options: Pick<RenderOptions<T>, 'columns' | 'columnDescriptor' | 'rowIndex' | 'rowData'>
) => ReactNode

type MiddlewareRenderCell<T = any> = (
  children: ReactNode,
  options: Pick<RenderOptions<T>, 'column'>
) => ReactNode
```

##### 插件编写

由于插件只是一个 react hook，可以直接这样写

```ts
import type { MiddlewareContext, MiddlewareResult } from '@are-visual/virtual-table'

function useLog<T = any>(ctx: MiddlewareContext<T>): MiddlewareResult<T> {
  console.log('useLog 中间件被调用')
  return ctx
}

// 使用插件
const pipeline = useTablePipeline({
  use: [
    useLog,
  ],
})
```

携带参数

```ts
// 方式 1
const withLog = (options?: { prefix: string }) => {
  function useLog<T = any>(ctx: MiddlewareContext<T>): MiddlewareResult<T> {
    console.log(options?.prefix, 'useLog 中间件被调用')
    return ctx
  }

  return useLog
}

// 使用插件
const pipeline = useTablePipeline({
  use: [
    withLog({ prefix: '🎯' }),
  ],
})
```

注意上述 withLog 的实现方式，一些与表格无关的渲染被触发时，withLog 依然会返回一个新的函数，这对于 diff 是有害的，总是会导致 Table 的额外渲染，如果你的插件不需要参数，那就没有影响，否则请使用 `createMiddleware` 创建插件。

##### 使用 createMiddleware 创建插件

```ts
import { createMiddleware } from '@are-visual/virtual-table'

function useLog<T = any>(ctx: MiddlewareContext<T>, options?: { prefix: string }): MiddlewareResult<T> {
  console.log(options?.prefix, 'useLog 中间件被调用')
  return ctx
}

const withLog = createMiddleware(useLog)

// 使用插件
const pipeline = useTablePipeline({
  use: [
    withLog({ prefix: '🎯' }),
  ],
})
```

`createMiddleware` 会缓存插件的 options 参数，并在每一次渲染阶段进行一次比较，options 不同时才会返回新的函数，这样有利于避免 Table 进行一些额外的渲染。

#### 插件注意事项

由于插件是一个 react hook，所以也需要遵守 [react hooks 规则](https://react.dev/reference/rules/rules-of-hooks)，不能在循环、判断条件中使用。

下面这种方式便是错误的，它违反了 hooks 规则，hook 不能位于判断条件中使用。

```tsx
const pipeline = useTablePipeline({
  use: [
    enableSelection ? tableSelection({}) : null,
    loading ? tableLoading({}) : null,
  ],
})
```

#### Context Hooks

以下所列出的 hook 均与 Table 内部的 Context 有关，无法脱离 Provider 使用。

##### useContainerSize

读取 Context 传递的 Table 尺寸信息。

```tsx
import { useContainerSize } from '@are-visual/virtual-table'

const {
  scrollContainerHeight,
  scrollContainerWidth,
  tableHeight,
  tableWidth,
} = useContainerSize()
```

##### useHorizontalScrollContext

当你自定义的插件需要同步水平滚动时，可以使用这个 hook。使用 `listen` 进行滚动同步。

```tsx
import { useHorizontalScrollContext } from '@are-visual/virtual-table'

const { listen, notify } = useHorizontalScrollContext()

const element = useRef()
useEffect(() => {
  const node = element.current
  
  if(node == null) return
  
  // listen 会返回一个清除函数
  return listen('union-key', (scrollLeft, targetNode) => {
    node.scrollLeft = scrollLeft
  })
}, [listen])

<div
  ref={element}
  onScroll={() => {
    // element 滚动时，调用 notify 函数，同步其他容器
    notify('union-key', {
      scrollLeft: () => element.current.scrollLeft,
      node
    })
  }}
/>
```


##### useScrollSynchronize

基于 `useHorizontalScrollContext` 的封装。

```tsx
import { useScrollSynchronize } from '@are-visual/virtual-table'

const nodeRef = useScrollSynchronize<HTMLDivElement>('union-key')

<div ref={nodeRef}></div>
```

##### useTableRowManager

此 hook 可以获取当前 Table 行的高度、更新行高。

可参考 [tableExpandable 行展开](./packages/virtual-table/src/middleware/expandable)的实现。

```tsx
import { useTableRowManager } from '@are-visual/virtual-table'

const { getRowHeightList, updateRowHeight } = useTableRowManager()
```

类型签名：

```ts
interface TableRowManagerContextType {
  getRowHeightList: () => number[]
  /**
   * @param index rowIndex
   * @param key 唯一的 key，用于去重
   * @param height 行高
   */
  updateRowHeight: (index: number, key: Key, height: number) => void
}
```

##### useColumnSizes

此 hook 可以获取当前 Table 每一列的宽度、更新列宽。

类型签名：

```ts
interface TableColumnsContextType {
  widthList: Map<Key, number>
}
```

##### useTableSticky

此 hook 可以获取每列 fixed 的值、sticky 位置。

```ts
interface StickyContextState {
  size: Map<Key, number>
  fixed: { key: Key, fixed: FixedType | undefined }[]
}
```



### 参考

[浅说虚拟列表的实现原理](https://github.com/dwqs/blog/issues/70)

[ali-react-table](https://ali-react-table.js.org/)

[rc-table](https://github.com/react-component/table)

[antd](https://ant.design/)

