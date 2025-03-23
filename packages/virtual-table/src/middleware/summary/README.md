## tableSummary 总结栏

### 方式 1：

直接在 `columns` 中定义 `summary` 相关配置，并使用 `<Summary.Outlet>` 进行渲染。

```tsx
import '@are-visual/virtual-table/middleware/summary/styles.css'
import { Summary, tableSummary } from '@are-visual/virtual-table/middleware/summary'

import { useTablePipeline } from '@are-visual/virtual-table'

const columns = [
  {
    key: 'name',
    dataIndex: 'name',
    summary: {
      className: '',
      render(dataSource) {
        return <span>Name Column Summary</span>
      },
    },
  },
  {
    key: 'age',
    dataIndex: 'age',
    summary: {
      render(dataSource) {
        return <span>Age Column Summary</span>
      },
    },
  },
  {
    key: 'gender',
    dataIndex: 'gender',
    summary: {
      colSpan: 2,
      render(dataSource) {
        return <span>Age Column Summary</span>
      },
    },
  },
  {
    key: 'actions',
    summary: {
      colSpan: 0,
    },
  },
]

const pipeline = useTablePipeline({
  use: [
     tableSummary({
      summary: (dataSource) => {
        return (
          <Summary key="summary" fixed>
            <Summary.Outlet dataSource={dataSource} />
          </Summary>
        )
      },
    })
  ],
})
```

#### summary 参数

| Prop    | 说明                              | 类型                        | 默认值 | 版本  |
| ------- | --------------------------------- | --------------------------- | ------ | ----- |
| colSpan | 总结栏列合并，设置为 0 时，不渲染 | number                      |        | >=0.2 |
| align   | 对齐方式                          | `left` \|`right` \|`center` |        | >=0.2 |
| render  | 总结栏单元格内容                  | (*data*) => ReactNode       |        | >=0.2 |

### 方式 2：

使用 `<Summary.Row>` 组件渲染单元格，children 支持函数或 ReactNode。

```tsx
import '@are-visual/virtual-table/middleware/summary/styles.css'
import { Summary, tableSummary } from '@are-visual/virtual-table/middleware/summary'

import { useTablePipeline } from '@are-visual/virtual-table'

const columns = [
  {
    key: 'name',
    dataIndex: 'name',
  },
  {
    key: 'age',
    dataIndex: 'age',
  },
  {
    key: 'gender',
    dataIndex: 'gender',
  },
  {
    key: 'actions',
  },
]

const pipeline = useTablePipeline({
  use: [
     tableSummary({
      summary: () => {
        return (
          <Summary key="summary" fixed>
            <Summary.Row>
              {columns.map((column, key) => {
                return (
                  <Summary.Cell columnKey={key}>
                    Second Summary Cell
                	</Summary.Cell>
                )
              })}
            </Summary.Row>
            
            <Summary.Row>
              <Summary.Cell columnKey="name">
                Name Cell
              </Summary.Cell>
              <Summary.Cell columnKey="age">
                Age Cell
              </Summary.Cell>
              <Summary.Cell columnKey="gender">
                Gender Cell
              </Summary.Cell>
              <Summary.Cell columnKey="actions">
                Actions Cell
              </Summary.Cell>
            </Summary.Row>
          </Summary>
        )
      },
    })
  ],
})
```

### 多行

有些时候，你的总结栏可能有很多行，你可以随意使用 `<Summary>` 组件进行设置。

```tsx
const pipeline = useTablePipeline({
  use: [
     tableSummary({
      summary: () => {
        return (
          <>
            <Summary key="top-summary" fixed="top">
              <Summary.Row>
                {columns.map((column, key) => {
                  return (
                    <Summary.Cell columnKey={key}>
                      Second Summary Cell
                    </Summary.Cell>
                  )
                })}
              </Summary.Row>
              <Summary.Row>
                {columns.map((column, key) => {
                  return (
                    <Summary.Cell columnKey={key}>
                      Second Summary Cell
                    </Summary.Cell>
                  )
                })}
              </Summary.Row>
            </Summary>

            <Summary key="bottom-summary" fixed="bottom">
              <Summary.Row>
                {columns.map((column, key) => {
                  return (
                    <Summary.Cell columnKey={key}>
                      Second Summary Cell
                    </Summary.Cell>
                  )
                })}
              </Summary.Row>
            </Summary>
          </>
        )
      },
    })
  ],
})
```

### 注意

使用 `<Summary>` 组件时，由于内部实现机制问题，总是需要设置 key。

### API

| Prop    | 说明       | 类型                  | 默认值 | 版本 |
| ------- | ---------- | --------------------- | ------ | ---- |
| summary | 总结栏内容 | (*data*) => ReactNode |        |      |


### CSS Variables

| Variable                             | 说明                         | 默认值   | 版本 |
| ------------------------------------ | ---------------------------- | -------- | ---- |
| --virtual-table-summary-background   | 总结栏背景色/单元格背景色    | #fff     |      |
| --virtual-table-summary-border-color | 总结栏位于底部时，上边框颜色 | \#f0f0f0 |      |
