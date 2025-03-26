import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'VirtualTable.Core',
  setup() {
    const count = ref(0)

    return () => {
      return (
        <>
          <span>{count.value}</span>
          <button
            onClick={() => {
              count.value++
            }}
          >
            点击
          </button>
        </>
      )
    }
  },
})
