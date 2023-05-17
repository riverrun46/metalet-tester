import { create } from 'zustand'

const useBtcStore = create((set) => ({
  bears: 0,
}))

export default useBtcStore
