import { Link, Outlet } from 'react-router-dom';
import { NavBar } from './NavBar.jsx';

export default function RootLayout() {
  return (
    <>
      <NavBar/>
      <main>
        <Outlet/>
      </main>
    </>
  )
}
