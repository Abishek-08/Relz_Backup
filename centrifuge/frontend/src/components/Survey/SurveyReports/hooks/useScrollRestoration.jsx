import { useEffect, useRef } from 'react';

export default function useScrollRestoration(key = 'default') {
  const posRef = useRef(0);

  const save = () => {
    posRef.current = window.scrollY || 0;
  };

  const restore = () => {
    window.requestAnimationFrame(() => {
      window.scrollTo(0, posRef.current || 0);
    });
  };

  useEffect(() => {
    return () => save();
  }, []);

  return { save, restore };
}