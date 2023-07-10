import '../styles/IndexPage.css'
import { Form, redirect, useActionData, useLoaderData, useNavigation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { forwardRef, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../parts/Button.jsx';
import { useOnClickOutside } from '../../hooks/useOnClickOutside.jsx';
import { ArrowDownSvg } from '../svg/ArrowDownSvg.jsx';
import { VITE_API_PREFIX } from '../../App.jsx';
import { routeLoaderHandler } from '../../utils/fetchHandler.js';
import { TranslationContext } from '../parts/RoutesWrapper.jsx';

export function IndexPage() {
  const i18n = useContext(TranslationContext);
  const boardList = useLoaderData() ?? [];
  document.title = 'boards';
  let staticBoard = { link: 'all', title: 'Overboard', userboard: false, posts_last24h: 0 };
  const allBoardsLink = { link: 'boards', title: `[${i18n.allBoards}]`, userboard: true };

  const boardsByCategory = boardList.reduce((acc, curr) => {
      curr.userboard
        ? acc.userboards.push(curr)
        : acc.boards.push(curr);

      staticBoard.posts_last24h += curr.posts_last24h;
      return acc;
    }, { boards: [], userboards: [] }
  );

  boardsByCategory.boards.push(staticBoard);
  boardsByCategory.userboards.push(allBoardsLink);

  return (
    <nav id='boards-nav'>
      {Object.entries(boardsByCategory).map(([category, boards], idx) =>
        <ul className='board-category' key={idx}>
          <span className={category}>
            {i18n[category]}
            {category === 'userboards' && <CategoryButton i18n={i18n} />}
          </span>
          {boards.map((board, idx) =>
            <li key={idx}>
              <Link to={'../' + board.link + '/'}>
                {board.title}
              </Link>
              {board.posts_last24h > 0 &&
                <span className='post-count' title={i18n.postsLast24h}>
                [{board.posts_last24h}]
              </span>}
            </li>
          )}
        </ul>
      )}
    </nav>
  )
}

function CategoryButton({ i18n }) {
  const ref = useRef();
  const [isModalShown, setModalShown] = useState(false);
  useOnClickOutside(ref, () => setModalShown(false));

  function svgClickHandler(ev) {
    setModalShown(shown => !shown);
    ev.stopPropagation();
  }

  return (
    <>
      <ArrowDownSvg handler={svgClickHandler} />
      {isModalShown && createPortal(
        <Modal ref={ref} i18n={i18n} />,
        document.body
      )}
    </>
  )
}

const Modal = forwardRef(function Modal({ i18n }, ref) {
  const errors = useActionData();
  const navigation = useNavigation();

  useEffect(() => {
    return () => {
      if (errors) errors.link = errors.title = errors.detail = null; // clear errors on modal closing
    }
  }, []);  //eslint-disable-line

  return (
    <div className='modal' ref={ref}>
      <header>
        {i18n.newBoard}
      </header>
      <Form method='POST'>
        <div className='input-wrap'>
          {errors && <output className='error'>{errors.title || errors.error}</output>}
          <input type='text' name='title'
                 required maxLength='15' minLength='1' pattern='^[A-Za-zА-Яа-яЁё]+[0-9]*$'
                 placeholder={i18n.boardTitle} autoComplete='off'
          />
          <sub>{i18n.newBoardTitleDesc}</sub>
        </div>

        <div className='input-wrap'>
          {errors && <output className='error'>{errors.link}</output>}
          <input type='text' name='link'
                 required maxLength='5' minLength='1' pattern='^[a-z]+[0-9]*$'
                 placeholder={i18n.boardLink} autoComplete='off'
          />
          <sub>{i18n.newBoardLinkDesc}</sub>
          {errors && <output className='error'>{errors.detail}</output>}
        </div>

        <div style={{ textAlign: 'center' }}>
          <Button buttonType='submit'
                  value={i18n.submitButton}
                  extraStyle={{ width: '100%' }}
                  disabled={navigation.state !== 'idle'}
          />
        </div>
      </Form>
    </div>
  );
});

export async function BoardLoader({ urlParams }) {
  let url = VITE_API_PREFIX + '/boards/';
  urlParams ? url += `?${urlParams}=1` : url;
  return await routeLoaderHandler(url);
}

export async function BoardAction({ request }) {
  const formData = await request.formData();
  const user_id = localStorage.getItem('user_id');
  if (user_id) {
    formData.set('user_id', user_id);
  }

  const url = VITE_API_PREFIX + '/boards/';
  const r = await fetch(url, {
    method: request.method,
    body: formData,
  });
  const data = await r.json();

  if (data?.created && data.board) {
    if (data.board?.boards) {
      localStorage.setItem('boards', JSON.stringify(data.board.boards));
    }
    if (data.board?.user_id) {
      localStorage.setItem('user_id', JSON.stringify(data.board.user_id));
    }
    return data.board?.link
      ? redirect(`/${data.board.link}/`)
      : redirect('');
  }

  return data.errors ?? { errors: 'error' };
}

/** @property {boolean} curr.userboard */
/** @property {number} board.posts_last24h */
