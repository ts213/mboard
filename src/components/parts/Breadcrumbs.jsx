import { Link, useParams } from 'react-router-dom';

export function Breadcrumbs() {
  const { board, threadId } = useParams();
  return (
    <nav style={{padding: '0.5rem'}}>
      <Link className='crumb' to='/'>Boards</Link>
      <span className='crumb-arrow'>&gt;</span>
      <Link className='crumb' to={`/${board}/`}>/{board}/</Link>
      {threadId && (
        <>
          <span className='crumb-arrow'>&gt;</span>
          <Link className='crumb' to={`/${board}/thread/${threadId}/`}>{threadId}</Link>
        </>
      )}
    </nav>
  );
}
