import { useSyncExternalStore } from 'react';

const QUERY = '(min-width: 1280px)';

const subscribe = (callback: () => void) => {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', callback);
  return () => mql.removeEventListener('change', callback);
};

const getSnapshot = () => window.matchMedia(QUERY).matches;

/** True at the `xl` breakpoint and above — decides aside vs drawer for the editor. */
const useIsDesktop = () => useSyncExternalStore(subscribe, getSnapshot);

export default useIsDesktop;
