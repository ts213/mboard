import { useEffect } from 'react';

export function useOnClickOutside(ref, handler) {
  useEffect(() => {
      const listener = (event) => {
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }

        handler(event);
      };

      window.addEventListener('click', listener);

      return () => {
        window.removeEventListener('click', listener);
      };
    },
    [ref, handler]
  );
}
