## columnResize 列宽调整

为 Table 每一列添加宽度调整功能。

### Install

```bash
npm install react-resizable
```

### Usage

```tsx
import 'react-resizable/css/styles.css'
import '@are-visual/virtual-table/middleware/column-resize/styles.css'
import { columnResize } from '@are-visual/virtual-table/middleware/column-resize'

import { useTablePipeline } from '@are-visual/virtual-table'

const pipeline = useTablePipeline({
  use: [
    columnResize({ storageKey: 'localStorage_key_for_resize' }),
  ],
})
```

### API

| Prop       | 说明                                            | 类型                                              | 默认值 | 版本 |
| ---------- | ----------------------------------------------- | ------------------------------------------------- | ------ | ---- |
| storageKey | 在 localStorage 中缓存 resize 后 columns 的宽度 | string                                            | -      |      |
| min        | 最小宽度                                        | number \| `(column) => number | undefined | null` | -      |      |
| max        | 最大宽度                                        | number \| `(column) => number | undefined | null` | -      |      |

### CSS Variables

| Variable                                   | 说明                | 默认值 | 版本 |
| ------------------------------------------ | ------------------- | ------ | ---- |
| --virtual-table-column-resize-handle-width | resize 控制区域宽度 | 10px   |      |

### Columns 新增参数

| name          | 说明              | 类型    | 默认值 | 版本 |
| ------------- | ----------------- | ------- | ------ | ---- |
| disableResize | 指定列禁用 resize | boolean | -      |      |
| maxWidth | Resize 时限制最大列宽 | number | -      |      |

> Column 默认包含 minWidth，设置后将限制最小列宽

```tsx
const columns = [
  { dataIndex: 'name', width: 200 },
  { dataIndex: 'age', width: 200 },
  {
    disableResize: true,
    width: 100,
    key: 'actions',
    render() {},
  },
]
```

