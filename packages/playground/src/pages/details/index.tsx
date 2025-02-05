import type { TabsProps } from 'antd'
import type { FC } from 'react'
import { Tabs, theme } from 'antd'
import StickyBox from 'react-sticky-box'
import Antd from './antd'
import ContainerScroll from './container'
import WindowScroll from './window'

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'Window scroll',
    children: <WindowScroll />,
  },
  {
    key: '2',
    label: 'Container scroll',
    children: <ContainerScroll />,
  },
  {
    key: '3',
    label: 'Simple Content',
    children: 'Simple Content',
  },
  {
    key: '4',
    label: 'Antd',
    children: <Antd />,
  },
]

const Details: FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const renderTabBar: TabsProps['renderTabBar'] = (props, DefaultTabBar) => (
    <StickyBox offsetTop={0} style={{ zIndex: 3 }}>
      <DefaultTabBar {...props} style={{ background: colorBgContainer }} />
    </StickyBox>
  )

  return (
    <div style={{ padding: 16 }}>
      <header
        style={{
          height: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: 50,
        }}
      >
        INFO AREA
      </header>
      <Tabs
        defaultActiveKey="1"
        renderTabBar={renderTabBar}
        items={items}
        type="card"
      />
    </div>
  )
}

export default Details
