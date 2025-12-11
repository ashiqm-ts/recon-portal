import { create } from 'zustand';

interface DialogState {
  isOpen: boolean;
  content: React.ReactNode | null;
  openCustomDialog: (content: React.ReactNode) => void;
  closeDialog: () => void;
}

export const useDialogStore = create<DialogState>((set) => ({
  isOpen: false,
  content: null,
  openCustomDialog: (content): void => set({ isOpen: true, content }),
  closeDialog: (): void => set({ isOpen: false, content: null }),
}));
