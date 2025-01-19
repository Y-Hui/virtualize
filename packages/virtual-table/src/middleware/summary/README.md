## tableSummary 总结栏

### usage

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
          <Summary fixed>
            <Summary.Row>
              <Summary.Cell index={0}>Name Summary</Summary.Cell>
              <Summary.Cell index={1}>Age Summary</Summary.Cell>
              <Summary.Cell index={2}>Gender Summary</Summary.Cell>
              <Summary.Cell index={3}>Actions Summary</Summary.Cell>
            </Summary.Row>
          </Summary>
        )
      },
    })
  ],
})
```

### API

| Prop    | 说明       | 类型                  | 默认值 | 版本 |
| ------- | ---------- | --------------------- | ------ | ---- |
| summary | 总结栏内容 | (*data*) => ReactNode |        |      |


### CSS Variables

| Variable                             | 说明                         | 默认值   | 版本 |
| ------------------------------------ | ---------------------------- | -------- | ---- |
| --virtual-table-summary-background   | 总结栏背景色/单元格背景色    | #fff     |      |
| --virtual-table-summary-border-color | 总结栏位于底部时，上边框颜色 | \#f0f0f0 |      |
