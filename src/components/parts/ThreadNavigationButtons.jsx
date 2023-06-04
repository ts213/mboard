import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const UPDATE_INTERVALS = [30, 60, 90, 150, 300, 600];
const MAX_UPDATE_INTERVAL = UPDATE_INTERVALS[UPDATE_INTERVALS.length - 1];
let dynamic_intervals = [...UPDATE_INTERVALS];

export function ThreadNavigationButtons({ revalidator, repliesCount }) {
  const counterRef = useRef();
  const repliesCountBeforeUpdate = useRef(repliesCount);

  const [updateButtonDisabled, setUpdateButtonDisabled] = useState(false);
  const [updateButtonText, setUpdateButtonText] = useState('[Update]');

  useEffect(() => {
      if (repliesCount > repliesCountBeforeUpdate.current) {
        const postsLoaded = repliesCount - repliesCountBeforeUpdate.current;
        setUpdateButtonText(`[Posts loaded: ${postsLoaded}]`);
        repliesCountBeforeUpdate.current = repliesCount;

        setTimeout(() => {
          setUpdateButtonText('[Update]');
          setUpdateButtonDisabled(false);
        }, 10_000);

        if (!document.hasFocus()) {
          displayLoadedPostCountInTitle(postsLoaded);
        }

        dynamic_intervals = [...UPDATE_INTERVALS];
        return;
      }

      if (updateButtonDisabled) {
        setUpdateButtonText('[No new posts]');
        setTimeout(() => {
          setUpdateButtonText('[Update]');
          setUpdateButtonDisabled(false);
        }, 10_000);
      }

      return () => clearInterval(counterRef.intervalId);
    }, [repliesCount, updateButtonDisabled]
  );

  function autoUpdateThreadAtIntervals() {
    let interval = 30;

    counterRef.intervalId = setInterval(() => {
      if (interval === 0) {
        interval = dynamic_intervals.shift() ?? MAX_UPDATE_INTERVAL;
        revalidator.revalidate();
      }

      --interval;
      counterRef.current.innerText = interval;
    }, 1000);
  }

  function autoUpdateHandler(ev) {
    if (ev.target.checked) {
      autoUpdateThreadAtIntervals();
    } else {
      clearInterval(counterRef.intervalId);
      counterRef.current.innerText = '[Auto]';
      dynamic_intervals = [...UPDATE_INTERVALS];
    }
  }

  function manualUpdateHandler() {  // todo
    setUpdateButtonDisabled(true);
    revalidator.revalidate();
  }

  return (
    <div id='bottom'>
      <Link to='../../'
            relative='path'
      >
        [Return]
      </Link>
      <a
        onClick={() => document.body.scrollIntoView()}
      >
        [Top]
      </a>
      <button
        className='unstyled-btn'
        onClick={manualUpdateHandler}
        disabled={revalidator.state !== 'idle' || updateButtonDisabled}
      >
        {revalidator.state !== 'idle' ? `[Loading...]` : updateButtonText}
      </button>
      <input
        onChange={autoUpdateHandler}
        id='auto-update'
        type='checkbox'
      />
      <label
        ref={counterRef}
        htmlFor='auto-update'
      >
        [Auto]
      </label>
    </div>
  );
}

let postsLoadedTotal = 0;
let staticDocumentTitle = '';

function displayLoadedPostCountInTitle(postsLoaded) {
  if (!staticDocumentTitle) {
    staticDocumentTitle = document.title;
  }

  if (!postsLoadedTotal) {
    window.addEventListener('focus', stripLoadedPostsCountFromTitle, { once: true });
  }

  postsLoadedTotal += postsLoaded;
  document.title = '(' + String(postsLoadedTotal) + ') ' + staticDocumentTitle;
}

function stripLoadedPostsCountFromTitle() {
  setTimeout(() => {
    document.title = staticDocumentTitle;
    postsLoadedTotal = 0;
  }, 5000);
}
