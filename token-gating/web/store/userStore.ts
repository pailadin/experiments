import create, { State } from 'zustand'

export interface AddNewProjectModal extends State {
  show: boolean
  setShow: (val: boolean) => void
}

export const useAddNewProjectModal = create<AddNewProjectModal>((set) => ({
  show: false,
  setShow: (show) => set({ show }),
}))
