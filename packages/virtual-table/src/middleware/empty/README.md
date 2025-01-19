## tableEmpty

为 Table 添加空提示。

### usage

```tsx
import { tableEmpty } from '@are-visual/virtual-table/middleware/empty'

import { useTablePipeline } from '@are-visual/virtual-table'
import Empty from '@/components/empty'

const emptyNode = (
  <div>
    <img src="no-data.png" />
    <p>No Data</p>
  </div>
)

const App = () => {
  const pipeline = useTablePipeline({
    use: [
      // 方式1：渲染 jsx
      tableEmpty({
        children: emptyNode,
      }),
      
      // 方式2：渲染组件
      tableEmpty({
        children: Empty,
      }),
    ],
  })
}
```

### API

| Prop     | 说明 | 类型 | 默认值 | 版本 |
| -------- | ---- | ---- | ------ | ---- |
| children | 空提示内容 | ReactNode \| ComponentType     | -      |      |
| visible | 当 dataSource 为空且 visible 为 true 时，显示空提示 | boolean | true | |

