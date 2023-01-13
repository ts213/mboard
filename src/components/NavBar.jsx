import { Link } from 'react-router-dom';

export function NavBar() {
  return (
    <header>
      <Link className={'m-5'} to='/'>Home</Link>
      <Link to='/boards/'>boards</Link>
    </header>
  )
}
