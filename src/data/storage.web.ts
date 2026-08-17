import type { StateStorage } from 'zustand/middleware';

const fallback = new Map<string, string>();

export const appStorage: StateStorage = {
  getItem: (name) => {
    if (typeof localStorage === 'undefined') return fallback.get(name) ?? null;
    return localStorage.getItem(name);
  },
  setItem: (name, value) => {
    if (typeof localStorage === 'undefined') fallback.set(name, value);
    else localStorage.setItem(name, value);
  },
  removeItem: (name) => {
    if (typeof localStorage === 'undefined') fallback.delete(name);
    else localStorage.removeItem(name);
  },
};

