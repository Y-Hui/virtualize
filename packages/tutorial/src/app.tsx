import type { FC } from 'react'
import { Suspense } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const menus = [
  {
    path: '/step/0',
    label: 'Step0',
    description: 'Basic',
  },
  {
    path: '/step/1',
    label: 'Step1',
    description: 'Layout',
  },
  {
    path: '/step/2',
    label: 'Step2',
    description: 'Sticky head',
  },
  {
    path: '/step/3',
    label: 'Step3',
    description: 'Row virtualize',
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
              <span style={{ marginLeft: 8, fontSize: 10, color: '#b2b2b2' }}>
                (
                {menu.description}
                )
              </span>
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
