import { useEffect } from 'react';
import { computePosition, flip, shift, offset } from 'https://cdn.jsdelivr.net/npm/@floating-ui/dom@1.1.0/+esm';

export function Test() {

  useEffect(() => {

    const button = document.querySelector('#button');
    const tooltip = document.querySelector('#tooltip');

    function update() {
      computePosition(button, tooltip, {
        placement: 'top',
        middleware: [flip(), shift()], // offset(5) offset should be before most others to modify their coordinates
      }).then(({ x, y }) => {
        Object.assign(tooltip.style, {
          left: `${x}px`,
          top: `${y}px`,
        });
      });
    }

    function showTooltip() {
      tooltip.style.display = 'block';
      update();
    }

    function hideTooltip() {
      tooltip.style.display = '';
    }

    [
      ['mouseenter', showTooltip],
      ['mouseleave', hideTooltip],
    ].forEach(([event, listener]) => {
      button.addEventListener(event, listener);
    });

  }, [])

  return (
    <>
      <div className='flex h-screen justify-center items-center'>

        <button id='button'
                className='block m-auto flex flex-col  '
                aria-describedby='tooltip'
                style={{ background: '#222', color: 'white', fontWeight: 'bold' }}
        >
          My button
        </button>

        <div id='tooltip'
             className='font-bold bg-red-600 absolute top-0 left-0 hidden'
             role='tooltip'>My tooltip
        </div>

      </div>

    </>
  )
}
