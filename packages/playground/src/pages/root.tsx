import { type FC, Suspense } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const menus = [
  {
    path: '/',
    label: '纯文本',
  },
  {
    path: '/scroll-container',
    label: '滚动容器',
  },
  {
    path: '/selection',
    label: '选择',
  },
]

const Root: FC = () => {
  return (
    <div className="root">
      <aside className="sidebar">
        {menus.map((menu) => {
          return (
            <NavLink
              key={menu.path}
              className={({ isActive }) => {
                return isActive ? 'active' : ''
              }}
              to={menu.path}
            >
              {menu.label}
            </NavLink>
          )
        })}
      </aside>
      <Suspense fallback="loading...">
        <Outlet />
      </Suspense>
    </div>
  )
}

export default Root
