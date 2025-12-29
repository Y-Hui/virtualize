## [Unreleased]

Not yet
## [0.11.5-beta.0](https://github.com/Y-Hui/virtualize/compare/v0.11.4...v0.11.5-beta.0) (2025-12-29)
### Bug Fixes
#### 重新修改行虚拟化的高度计算逻辑

关键问题场景（与 0.11.4 版本几乎一致）：
1. `<Tabs />` 组件嵌套，内部包含两个 tab。
2. tabs 数组定义在组件内部，不使用 useMemo。
3. `<Tabs />` 组件 onChange 函数中需要触发重新渲染。
4. 滚动容器为最外层 Tabs 组件，两个 tab 共享这一个滚动容器。
5. columns定义在组件内部，不使用 useMemo。
6. tab1 滚动并让 startIndex 修改，切换到 tab2，再回到 tab1 进行滚动，最后切换到 tab2 查看渲染的数据是否正确。

现有逻辑：

在 Row 组件的 DOM ref 回调中测量行高，并调用 `setRowHeightByRowKey` 保存到 useRef 内。

所有的高度都是在 render 阶段进行收集、计算（可以强行理解为同步计算）。

修改为：

`setRowHeightByRowKey` 函数签名修改

原：`(rowKey: Key, key: Key, height: number) => void`

现：`(rowKey: Key, key: Key, getHeight: () => number | undefined) => void`

因为在 ref 回调中存在 body 处于 `display: none` 的情况，导致高度测量数值为 0。

把高度测量逻辑移动到 `useLayoutEffect` 中，同时判断 body 高度是否有效，再批量调用 `getHeight` 函数得到最新的高度。

所有的高度都是在 `useLayoutEffect` 中进行收集、计算（可以强行理解为异步处理）。

## [0.11.4](https://github.com/Y-Hui/virtualize/compare/v0.11.3...v0.11.4) (2025-11-21)
### Bug Fixes
([PR](https://github.com/Y-Hui/virtualize/pull/3)) 修复切换 tab 导致 startIndex 不从 0 开始的 bug

使用 antd 的 Tabs 组件，并准备两个 tab，tab1为 window 滚动的虚拟列表，tab2 展示几个纯文本。

默认激活 tab1，向下滚动几页后，现在渲染索引范围是 100-120

切换到 tab2，因为元素高度不足，不需要显示滚动条，滚动条重置，触发了 scroll 事件，重新计算了 startIndex、endIndex，变成了 0-20

虽然已经切换到了tab2，但是此时 tab1 也从 100-120 变成 0-20，渲染了前20条，并且tab1的dom不可见，所以前面20条的高度就被设置为了0

Row组件使用了 memo 包裹
再次切换tab1，因为startIndex、endIndex没有变化，而且Row也没有变化，所以就没有触发渲染，导致错误的行高信息被保留下来。

稍微滚动几页，让startIndex变化，再切换到tab2，又触发了滚动条重置，重新计算渲染范围，这一次，拿到了上一次的错误0行高，程序就一直累加Row的高度，直到满足填充容器，所以会看到从 21 开始渲染

解决方案：
在 scroll 事件中获取到当前的 node 高度为 0 就认为节点不可见，就不需要触发 updateBoundary，把它推迟到下一次渲染检测 node 高度不为 0 的时候

## [0.11.3](https://github.com/Y-Hui/virtualize/compare/v0.11.2...v0.11.3) (2025-09-22)
### Bug Fixes
- 修复分页请求数据场景下，切换页码重置 dataSource 时导致白屏。场景：分页请求 Table 数据，滚动到底部，查看下一页，dataSource 重置为空数组，网络请求结束后再 setDataSource，此时渲染出现空白。

## [0.11.2](https://github.com/Y-Hui/virtualize/compare/v0.11.1...v0.11.2) (2025-07-30)
### Features
- `column-resize` 当列数宽度总和不足以撑满 Table 时，添加一个空白列自动撑开，提升 resize 的使用体验 ([PR](https://github.com/Y-Hui/virtualize/pull/3))

### Bug Fixes
- 未开启列虚拟化时，不追加添加空列

## [0.11.1](https://github.com/Y-Hui/virtualize/compare/v0.11.0...v0.11.1) (2025-05-17)
### Bug Fixes
- `horizontal-scroll-bar` 在 Safari 中不显示滚动条 ([PR](https://github.com/Y-Hui/virtualize/pull/2))

## [0.11.0](https://github.com/Y-Hui/virtualize/compare/v0.10.2...v0.11.0) (2025-05-11)
### Bug Fixes
- `instance.getScrollValueByColumnKey` 在初次渲染后无法跳转到最后一个单元格 ([PR](https://github.com/Y-Hui/virtualize/pull/1))

### Refactor
- ColumnType `width` 类型约束为 `number`，不再支持 `string` 类型，去除使用 DOM 计算列宽逻辑 ([PR](https://github.com/Y-Hui/virtualize/pull/1))

### Features
- 新增 `useScrollSynchronize` Hook，用于快速实现水平滚动同步。

## [0.10.2](https://github.com/Y-Hui/virtualize/compare/v0.10.1...v0.10.2) (2025-05-01)
### Bug Fixes
- 在弹窗动画结束前，DOM 节点处于 `display: none;` 下无法正确计算列宽，总是获取到 0. Colgroup 组件中使用 onResize 函数进行处理。

## [0.10.1](https://github.com/Y-Hui/virtualize/compare/v0.10.0...v0.10.1) (2025-05-01)
### Bug Fixes
- 修复列宽计算在弹窗中可能获取到 0 的 bug. Colgroup 组件中使用 useLayoutEffect 代替 ref 回调进行列宽计算。

## [0.10.0](https://github.com/Y-Hui/virtualize/compare/v0.9.0...v0.10.0) (2025-04-11)
### Refactor
- `useTableInstance` 使用 useState 代替 useMemo 进行参数合并。
- `TableInstance` 重构。

### Features
- instance 新增 `extend` 函数，支持扩展。

## [0.9.0](https://github.com/Y-Hui/virtualize/compare/v0.8.0...v0.9.0) (2025-04-08)
### Features
- `useTableInstance` 内 scrollToColumn、scrollToRow 函数新增 `behavior` 参数。

## [0.8.0](https://github.com/Y-Hui/virtualize/compare/v0.7.0...v0.8.0) (2025-03-31)
### Features
- 新增 `useTableInstance`，用于获取 VirtualTable 内部的数据/操作函数。

## [0.7.0](https://github.com/Y-Hui/virtualize/compare/v0.6.0...v0.7.0) (2025-03-26)
### Features
- Summary.Cell 组件不再需要传递 columnKey
- summary middleware 支持设置 `className`, `style`, `zIndex`, `bottom`

## [0.6.0](https://github.com/Y-Hui/virtualize/compare/v0.5.2...v0.6.0) (2025-03-25)
### Features
- tr 节点新增 data-row-index 属性
- td 节点新增 data-col-key 属性
- `MiddlewareContext`, `MiddlewareResult` 类型定义更新，支持 `[key: string]: unknown`，方便 middleware 之间数据传递

## [0.5.2](https://github.com/Y-Hui/virtualize/compare/v0.5.1...v0.5.2) (2025-03-25)
### Bug Fixes
- horizontalScrollBar middleware 滚动条高度太低导致 macOS 下被裁剪
- 列虚拟化记录列宽出错，未传递新的引用地址，导致错误

## [0.5.1](https://github.com/Y-Hui/virtualize/compare/v0.5.0...v0.5.1) (2025-03-24)
### Refactor
- 重构 VirtualTable 的 getOffsetTop prop 默认实现。现在可通过 VirtualTable root 节点计算到滚动容器的偏移量。

## [0.5.0](https://github.com/Y-Hui/virtualize/compare/v0.4.1...v0.5.0) (2025-03-24)
### Features
- rowKey 支持 string 或函数

## [0.4.1](https://github.com/Y-Hui/virtualize/compare/v0.3.0...v0.4.1) (2025-03-24)
### Bug Fixes
- empty middleware colSpan 改为读取 `columnDescriptor.length`，修复滚动时未固定的 Bug

### Refactor
- 重构 loading middleware 的实现，不再构造 mock 数据进行渲染，改为 `renderBodyContent` 函数渲染内容。

### Features
- pipeline 新增 renderBodyContent 函数，可以通过它定义整个 body 渲染内容
- horizontalScrollBar middleware 使用 CSS 变量设置 bottom

## [0.3.0](https://github.com/Y-Hui/virtualize/compare/v0.2.2...v0.3.0) (2025-03-24)
### Features
- loading middleware 中构造的 mock 数据，新增 symbol 字段进行标识
- export 工具函数（`getScrollElement`、`getScrollParent`、`getScrollTop`、`isDocument`、`isRoot`、`isWindow`）

## [0.2.2](https://github.com/Y-Hui/virtualize/compare/v0.2.1...v0.2.2) (2025-03-23)
### Bug Fixes
- 去除 summary middleware 要求 summary 返回值只能是 ReactElement 的限制

## [0.2.1](https://github.com/Y-Hui/virtualize/compare/v0.1.3...v0.2.1) (2025-03-23)
### Features
- VirtualTable 新增 defaultColumnWidth 属性，用于设置默认的列宽，columns 中没有配置 width 时的默认值（与虚拟化无关）
- 支持在 columns 中直接定义 summary 属性
- 支持多行总结栏

## [0.1.3](https://github.com/Y-Hui/virtualize/compare/v0.1.2...v0.1.3) (2025-03-11)
### Bug Fixes
- 修复 selection middleware 引用 `useMergedRef` 路径错误的问题

## [0.1.2](https://github.com/Y-Hui/virtualize/compare/v0.1.1...v0.1.2) (2025-02-28)
### Bug Fixes
- 修复 `onColumnSizesMeasure` 超出 React 更新深度的问题

## [0.1.1](https://github.com/Y-Hui/virtualize/compare/v0.1.0...v0.1.1) (2025-02-26)
### Bug Fixes
- 修复生产版本渲染时超出 React 更新深度的问题
- 使用 `Array.from` 代替 `Map.keys`、`Map.values` 展开数组
