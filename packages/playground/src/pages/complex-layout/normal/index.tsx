import type { TabsProps } from 'antd'
import type { FC } from 'react'
import { Tabs } from 'antd'
import Tab1 from './tab1'
import Tab2 from './tab2'

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'Tab1',
    children: <Tab1 />,
  },
  {
    key: '2',
    label: 'Tab2',
    children: <Tab2 />,
  },
]

const Normal: FC = () => {
  return (
    <div className="normal">
      <div style={{ padding: 16 }}>
        <header
          style={{
            marginBottom: 10,
            height: 400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 50,
            backgroundColor: '#fff',
            borderRadius: 10,
          }}
        >
          INFO AREA
        </header>
        <div
          style={{
            padding: '0 16px',
            backgroundColor: '#fff',
            borderRadius: 10,
          }}
        >
          <Tabs
            defaultActiveKey="1"
            items={items}
          />
        </div>
      </div>
    </div>
  )
}

export default Normal
