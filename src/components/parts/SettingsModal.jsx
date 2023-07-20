import { useRef, useState } from 'react';
import { isScrollToBottom, setScrollToBottom } from '../../context/staticSettings.js';
import { useOutsideClick } from '../../hooks/Hooks.jsx';

const settings = {
  'Scroll': { msg: 'Thread auto scroll to the bottom', func: getScrollSetting },
  'test': { msg: 'test', func: undefined },
};

export function SettingsButton() {
  const [shown, setShow] = useState(false);
  const ref = useRef();

  useOutsideClick(
    ref,
    () => setShow(false),
    (target) => target.classList.contains('settingsBtn') && setShow(prev => !prev)
  );

  return (
    <div ref={ref}>
      <button
        className='settingsBtn unstyled-btn'
      >
        Settings
      </button>
      {shown && <SettingsModal />}
    </div>
  );
}

function SettingsModal() {
  /** @type {{ current: HTMLInputElement }} */
  const ref = useRef();

  function onUserIdClick() {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      ref.current.value = userId;
      ref.current.parentElement.toggleAttribute('hidden');
    }
  }

  async function copyToClipboard(ev) {
    ref.current.select();
    await navigator.clipboard.writeText(ref.current.value);

    ev.target.classList.toggle('copyBtn');
    setTimeout(() => ev.target.classList.toggle('copyBtn'), 3000);
  }

  return (
    <div className='settings'>

      {Object.keys(settings).map((key, idx) =>
        <label key={idx}>
          <input
            type='checkbox'
            defaultChecked={isScrollToBottom}
            onChange={settings[key].func}
          />
          {key}
          <sub>
            {settings[key].msg}
          </sub>
        </label>
      )}

      <span style={{ cursor: 'pointer' }} onClick={onUserIdClick}>
        <span style={{ fontSize: 'xx-large', marginRight: '0.5rem', lineHeight: '2rem' }}>
          +
        </span>
        <span style={{ verticalAlign: 'super' }}>
          User ID
        </span>
      </span>
      <div hidden>
        <input
          ref={ref}
          style={{ color: 'white', margin: '0.5rem' }}
          onClick={ev => ev.target.type = ev.target.type === 'password' ? 'text' : 'password'}
          type='password' readOnly size='10'
        />
        <button
          onClick={copyToClipboard}
          className='unstyled-btn'>
          Copy
        </button>
      </div>
    </div>
  );
}

function getScrollSetting(ev) {
  if (ev.target.checked) {
    localStorage.setItem('scrollDown', '1');
  } else {
    localStorage.removeItem('scrollDown');
  }
  setScrollToBottom();
}
