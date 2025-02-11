import type { FC } from 'react'
import { Suspense } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const menus = [
  {
    path: '/step/0',
    label: 'Step0',
  },
  {
    path: '/step/1',
    label: 'Step1',
  },
]

const App: FC = () => {
  return (
    <>
      <nav className="sidebar">
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
      </nav>
      <main style={{ paddingLeft: 220 }}>
        <Suspense fallback="loading...">
          <Outlet />
        </Suspense>
      </main>
    </>
  )
}

export default App
