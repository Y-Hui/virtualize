## horizontalScrollBar

Table 底部水平滚动条，columns 较多时，用户可使用滚动条滚动查看。

> 由于 Table 的实现要求，Table 本身关闭了滚动条显示，在多 columns 场景下，会对用户使用造成不便，所以需要此中间件。

### usage

```tsx
import '@are-visual/virtual-table/middleware/horizontal-scroll-bar/styles.css'
import { horizontalScrollBar } from '@are-visual/virtual-table/middleware/horizontal-scroll-bar'

import { useTablePipeline } from '@are-visual/virtual-table'

const pipeline = useTablePipeline({
  use: [
    horizontalScrollBar(),
  ],
})
```

### API

| Prop      | 说明                                  | 类型             | 默认值 | 版本 |
| --------- | ------------------------------------- | ---------------- | ------ | ---- |
| className | 滚动条容器 class                      | string           | -      |      |
| style     | 滚动条容器 style                      | CSSProperties    | -      |      |
| bottom    | 滚动条距离 Table 滚动容器底部的偏移量 | string \| number | 0      |      |
| zIndex    | 滚动条层级                            | number           | 3      |      |

