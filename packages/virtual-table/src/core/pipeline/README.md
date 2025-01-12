## 直接创建中间件

```tsx
function useLog<T = any>(ctx: MiddlewareContext<T>): MiddlewareResult<T> {
  console.log('useLog 中间件被调用')
  return ctx
}

useTablePipeline({
  use: [useLog]
})
```

## 参数支持

```tsx
const withLog = (options?: { prefix: string }) => {
  function useLog<T = any>(ctx: MiddlewareContext<T>): MiddlewareResult<T> {
    console.log(options?.prefix, 'useLog 中间件被调用')
    return ctx
  }

  return useLog
}

useTablePipeline({
  use: [withLog({ prefix: '🎯' })]
})
```

## 借助 createMiddleware 函数创建

createMiddleware 与上一个例子几乎一致，不过 createMiddleware 内部会浅比较 options，只有 options 改变才会返回新的函数。

```tsx
function useLog<T = any>(ctx: MiddlewareContext<T>, options?: { prefix: string }): MiddlewareResult<T> {
  console.log(options?.prefix, 'useLog 中间件被调用')
  return ctx
}

const withLog = createMiddleware(useLog)

useTablePipeline({
  use: [withLog({ prefix: '🎯' })]
})
```
