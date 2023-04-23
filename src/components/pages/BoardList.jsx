import '../styles/BoardList.css'
import { Form, redirect, useActionData, useLoaderData, useNavigation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../parts/Button.jsx';
import { useOnClickOutside } from '../../hooks/useOnClickOutside.jsx';
import { ArrowDownSvg } from '../svg/ArrowDownSvg.jsx';

const api_prefix = import.meta.env.VITE_API_PREFIX;

export function BoardList() {
  const boardList = useLoaderData() ?? [];

  const boardsByCategory = boardList.reduce((acc, curr) => {
      curr.userboard
        ? acc.userboards.push(curr)
        : acc.boards.push(curr);

      return acc;
    }, { boards: [], userboards: [] }
  );

  return (
    <nav>
      {Object.entries(boardsByCategory).map(([category, boards], idx) =>
        <ul className='board-category' key={idx}>
          <span className={category}>
            {category}
            {category === 'userboards' && <CategoryButton />}
          </span>
          {boards.map((board, idx) =>
            <li key={idx}>
              <Link  to={'../' + board.link + '/'}>
                {board.title}
              </Link>
              <span className='post-count' title='posts in last 24 hours'>
                [{board.posts_last24h}]
              </span>
            </li>
          )}
        </ul>
      )}
    </nav>
  )
}

function CategoryButton() {
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
        <Modal ref={ref} />,
        document.body
      )}
    </>
  )
}

const Modal = forwardRef(function Modal(props, ref) {
  const errors = useActionData();
  const navigation = useNavigation();
  useEffect(() => {
    return () => {
      if (errors) errors.link = errors.title = null;
    }
  }, []);  //eslint-disable-line

  return (
    <div className='modal' ref={ref}>
      <header>
        New board
      </header>
      <Form method='POST'>
        <div className='input-wrap'>
          {errors && <output className='error'>{errors.title || errors.error}</output>}
          <input type='text' name='title'
                 required maxLength='15' minLength='1' pattern='^[A-Za-zА-Яа-яЁё]+[0-9]*$'
                 placeholder='Board title'
          />
          <sub>Any title less than 15 characters</sub>
        </div>

        <div className='input-wrap'>
          {errors && <output className='error'>{errors.link}</output>}
          <input type='text' name='link'
                 required maxLength='5' minLength='1' pattern='^[a-z]+[0-9]*$'
                 placeholder={'Board link'}
          />
          <sub>Like &quot;/b/&quot;, without slashes</sub>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Button buttonType='submit' extraStyle={{ width: '100%' }}
                  disabled={navigation.state !== 'idle'}
          />
        </div>
      </Form>
    </div>
  );
});

export async function BoardLoader() {
  const url = api_prefix + '/boards/';
  const r = await fetch(url);
  if (!r.ok) {
    throw new Response('loader error', { status: r.status });
  }
  return r.json();
}

export async function BoardAction({ request }) {
  const formData = await request.formData();
  const url = api_prefix + '/boards/';
  const r = await fetch(url, {
    method: request.method,
    body: formData,
  });
  const data = await r.json();

  if (data?.created && data.board?.link) {
    return redirect(`/${data.board.link}/`);
  }

  return data.errors ?? { errors: 'error' };
}
