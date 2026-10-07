export const ACCESS_TOKEN_KEY = 'access_token';

/** Persisted sidebar expanded/collapsed (full labels vs icons). */
export const SHOW_FULL_MENU_KEY = 'show_full_menu';

export function readShowFullMenuFromStorage(defaultValue = true): boolean {
  try {
    if (typeof window === 'undefined') return defaultValue;
    const stored = localStorage.getItem(SHOW_FULL_MENU_KEY);
    if (stored === null) return defaultValue;
    return stored !== 'false';
  } catch {
    return defaultValue;
  }
}
