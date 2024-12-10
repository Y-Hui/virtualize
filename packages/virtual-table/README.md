## VirtualTable

### TODO 🚧
- [ ] 虚拟列表查找 anchor 时优化。
- [ ] 窗口 resize、滚动容器 resize 时重新计算
- [ ] 横向虚拟化
- [ ] 尝试将虚拟化、sticky 从 core 中拆分为 middleware
- [ ] 文档编写
- [x] 优化渲染次数，selection middleware 中设置 columnTitle 为函数时可以看到调用次数很多。

### Middleware TODO 🚧
- [ ] useTablePipeline 实现改进，目前版本实现方式有些“脏”
- [ ] Middleware Render 函数类型改进（使用函数重载）
- [ ] selection middleware 中 checkStrictly 未实现。
- [ ] expandable middleware  indentSize、childrenColumnName 未实现
- [ ] empty middleware 设置 width 为容器宽度
- [x] expandable 支持
- [x] expandable，展开多个行再收起后，滚动出现闪烁
- [x] Summary 总结栏 支持
- [x] Table Column Resize 支持
- [ ] Table Row Sort 支持
- [ ] Table Column Display 支持
- [x] KeyboardFocus 兼容测试

### GM 定制代码（兼容 antd API）结束后 TODO 🚧
- [ ] 清理不必要的库（classnames、antd）
- [ ] 尝试移除 ahooks
- [ ] 改进 Summary（antd Summary API 使用不便）
