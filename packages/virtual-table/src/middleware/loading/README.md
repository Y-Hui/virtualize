## tableLoading

Table loading 提示。

### usage

```tsx
import '@are-visual/virtual-table/middleware/loading/styles.css'
import { tableLoading } from '@are-visual/virtual-table/middleware/loading'

import { useTablePipeline } from '@are-visual/virtual-table'

const pipeline = useTablePipeline({
  use: [
    tableLoading({ loading }),
  ],
})
```

### API

| Prop      | 说明                                  | 类型             | 默认值 | 版本 |
| --------- | ------------------------------------- | ---------------- | ------ | ---- |
| loading | 是否显示加载状态                      | boolean           | -      |      |
