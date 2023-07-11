import { Outlet } from 'react-router-dom';

export function RoutesWrapper() {
  return (
    <>
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
