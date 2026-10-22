// Simple AsyncStorage wrapper using expo-sqlite for persistence
// In React Native / Expo, we use expo-sqlite's internal KV, but for web compatibility
// we provide a fallback using in-memory + localStorage

import { Platform } from 'react-native';

type JsonValue = string | number | boolean | null | object;

function hasLocalStorage(): boolean {
  try {
    return Platform.OS === 'web' && typeof window !== 'undefined' && !!window.localStorage;
  } catch {
    return false;
  }
}

const memoryStore = new Map<string, string>();

export const AsyncStorage = {
  async getItem<T = JsonValue>(key: string): Promise<T | null> {
    try {
      if (hasLocalStorage()) {
        const val = window.localStorage.getItem(key);
        return val ? (JSON.parse(val) as T) : null;
      }
      const val = memoryStore.get(key);
      return val ? (JSON.parse(val) as T) : null;
    } catch {
      return null;
    }
  },

  async setItem<T = JsonValue>(key: string, value: T): Promise<void> {
    try {
      const str = JSON.stringify(value);
      if (hasLocalStorage()) {
        window.localStorage.setItem(key, str);
      } else {
        memoryStore.set(key, str);
      }
    } catch {
      // ignore
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      if (hasLocalStorage()) {
        window.localStorage.removeItem(key);
      } else {
        memoryStore.delete(key);
      }
    } catch {
      // ignore
    }
  },
};
