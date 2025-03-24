import './styles.scss'
import type { TabsProps } from 'antd'
import type { FC } from 'react'
import { Tabs } from 'antd'
import Normal from './normal'

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'Normal',
    children: <Normal />,
  },
]

const ComplexLayout: FC = () => {
  return (
    <>
      <nav className="complex-nav">Nav</nav>
      <div className="complex" style={{ padding: '50px 0 0 0' }}>
        <Tabs
          className="root-tabs"
          defaultActiveKey="1"
          items={items}
          tabBarExtraContent={{ left: <div style={{ width: 16 }}></div> }}
          type="card"
        />
      </div>
    </>
  )
}

export default ComplexLayout
