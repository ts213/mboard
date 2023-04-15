import { Link } from 'react-router-dom';

export function NavBar() {
  return (
    <header>
      <Link style={{ marginRight: '1.25rem' }} to='/'>
        Home
      </Link>
      <Link style={{ marginRight: '1.25rem' }} to='/boards/'>
        boards
      </Link>
      <Link to='/feed/'>
        Feed
      </Link>
    </header>
  )
}
