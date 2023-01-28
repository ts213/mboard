import { offset, shift, useFloating, useFocus, useHover, FloatingPortal } from '@floating-ui/react';
import { flip } from '@floating-ui/react-dom';
import { useState } from 'react';

export function Test() {
  const [isOpen, setIsOpen] = useState(false);

  const { x, y, strategy, context, elements, refs } = useFloating({
      open: isOpen,
      onOpenChange: setIsOpen,
      placement: 'top',
      middleware: [offset(10), flip(), shift()],
    }
  );
  const hover = useHover(context);

  return (
    <>
      {/*<button onClick={() => console.log('')} ref={refs.setReference}>Button</button>*/}
      <FloatingPortal>
        {!isOpen && (
          <div onClick={() => console.log(refs)}
            ref={refs.setFloating}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              width: 'max-content',
            }}
          >
            Tooltip
          </div>
        )}
      </FloatingPortal>
    </>
  );
}
