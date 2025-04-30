## [Unreleased]

Not yet

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
