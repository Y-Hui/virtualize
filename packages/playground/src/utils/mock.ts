import { useEffect, useState } from 'react'

export interface MockData {
  key: string
  name?: string
  value?: number
  text?: string

  data1?: number
  data2?: number
  data3?: number
  data4?: string
  data5?: string
  data6?: string
  data7?: string
  data8?: string
  data9?: string
  data10?: string
  data11?: string
  data12?: string
  data13?: string
  data14?: string
  data15?: string
  data16?: string
  data17?: string
  data18?: string
  data19?: string
  data20?: string
  data21?: string
  data22?: string
  data23?: string
  data24?: string
  data25?: string
  data26?: string
  data27?: string
  data28?: string
  data29?: string
  data30?: string
  data31?: string
  data32?: string
  data33?: string
  data34?: string
  data35?: string
  data36?: string
  data37?: string
  data38?: string
  data39?: string
}

export interface MockStringData {
  key: string
  text: string
  text2: string
  text3: string
  text4: string
  text5: string
  text6: string
  text7: string
}

const texts = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris',
  'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium',
  'The standard Lorem Ipsum passage, used since the 1500s',
]

function createMockData(): MockData[] {
  return Array.from({ length: 500 }, (__, index) => {
    return {
      key: `key:${index}`,
      name: `Name${index}`,
      data1: index,
      text: texts[Math.ceil(Math.random() * texts.length - 1)],
    } satisfies MockData
  })
}

function createMockStringData(): MockStringData[] {
  return Array.from({ length: 500 }, (__, index) => {
    return {
      key: `key:${index}`,
      text: texts[Math.ceil(Math.random() * texts.length - 1)],
      text2: texts[Math.ceil(Math.random() * texts.length - 1)],
      text3: texts[Math.ceil(Math.random() * texts.length - 1)],
      text4: texts[Math.ceil(Math.random() * texts.length - 1)],
      text5: texts[Math.ceil(Math.random() * texts.length - 1)],
      text6: texts[Math.ceil(Math.random() * texts.length - 1)],
      text7: texts[Math.ceil(Math.random() * texts.length - 1)],
    } satisfies MockStringData
  })
}

export function usePureStringData() {
  return useState(createMockStringData)
}

export function useAsyncPureStringData() {
  const [data, setData] = useState<MockStringData[]>([])

  useEffect(() => {
    setTimeout(() => {
      setData(createMockStringData)
    }, 200)
  }, [])

  return [data, setData] as const
}

export function useSyncData() {
  return useState(createMockData)
}

export function useAsyncData() {
  const [data, setData] = useState<MockData[]>([])

  useEffect(() => {
    setTimeout(() => {
      setData(createMockData)
    }, 300)
  }, [])

  return [data, setData] as const
}
