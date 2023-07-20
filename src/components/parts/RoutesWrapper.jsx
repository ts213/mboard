import { Outlet } from 'react-router-dom';
import { SettingsButton } from './SettingsModal.jsx';

export function RoutesWrapper() {
  return (
    <>
      <SettingsButton />
      <Outlet />
      <footer>
        <a target='_blank' href='https://github.com/ts213/mboard/' rel='noreferrer'>
          mboard
        </a>
        {/*<Link to=''>About</Link>*/}
      </footer>
    </>
  );
}
