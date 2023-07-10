import { Link, useParams } from 'react-router-dom';
import { page } from '../../hooks/useThreadsPagination.jsx';
import { resetThreadListCache } from '../../hooks/useThreadListCache.jsx';
import { useContext } from 'react';
import { TranslationContext } from './RoutesWrapper.jsx';

export function Breadcrumbs() {
  const { board, threadId } = useParams();
  const i18n = useContext(TranslationContext);

  function onThreadListClick() {
    if (board !== page.board) {
      resetThreadListCache();
      page.reset();
    }
  }

  function onBoardListClick() {
    resetThreadListCache();
    page.reset();
  }

  return (
    <nav style={{ padding: '0.5rem' }}>
      <Link onClick={onBoardListClick}
            className='crumb'
            to='/'
      >
        {i18n.boards}
      </Link>
      <span className='crumb-arrow'>&gt;</span>
      <Link onClick={onThreadListClick}
            className='crumb'
            to={`/${board}/`}
      >
        /{board}/
      </Link>
      {threadId && (
        <>
          <span className='crumb-arrow'>&gt;</span>
          <Link className='crumb'
                to={`/${board}/thread/${threadId}/`}
          >
            {threadId}
          </Link>
        </>
      )}
    </nav>
  );
}
