import { useEffect, useRef } from 'react';

export function useScrollToPost(value) {
  const ref = useRef();

  useEffect(() => {
    const postElmnt = document.getElementById(ref.current);
    if (postElmnt) {
      postElmnt.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
    ref.current = value;

  }, [value]);
}
