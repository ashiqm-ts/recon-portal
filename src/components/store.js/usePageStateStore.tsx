import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import CryptoJS from 'crypto-js';

const SECRET_KEY = '123456AQWE1';

const encrypt = (data: unknown): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

const decrypt = (cipherText: string): unknown => {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return decrypted ? JSON.parse(decrypted) : null;
};

interface PageState {
  editData: string | null;
  setEditData: (data: unknown) => void;
  getEditData: () => unknown;
  clearEditData: () => void;
}

export const usePageStateStore = create<PageState>()(
  persist(
    (set, get) => ({
      editData: null,
      setEditData: (data: unknown): void => {
        const encrypted = encrypt(data);
        set({ editData: encrypted });
      },
      getEditData: (): unknown => {
        const encrypted = get().editData;
        if (!encrypted) return null;
        return decrypt(encrypted);
      },
      clearEditData: (): unknown => set({ editData: null }),
    }),
    {
      name: 'secure-page-state',
    }
  )
);
