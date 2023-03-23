import { usePostList } from '../hooks/usePostList.jsx';
import { useEffect, useRef, useState } from 'react';
import { routeLoader } from '../../App.jsx';
// import { PostForm } from '../PostForm.jsx';

export default function ThreadList() {
  const [postListObject, setPostList] = useState([]);
  const postListJsx = usePostList(postListObject);

  const intersectionRef = useRef();
  const currentPageRef = useRef(1);
  const prevY = useRef(0); // storing the last intersection y position

  useEffect(() => {
    fetchPostsFromPage(1);
  }, []);

  useEffect(() => {
    function observerHandler(target) {
      const y = target[0].boundingClientRect.y;

      if (prevY.current > y && currentPageRef.current) {
        currentPageRef.current += 1;
        fetchPostsFromPage(currentPageRef.current);
      }

      prevY.current = y;
    }

    const observer = new IntersectionObserver(observerHandler, { threshold: 1.0 });
    observer.observe(intersectionRef.current);
  }, []);

  async function fetchPostsFromPage(page) {
    const url = location.href + '?page=' + page;
    try {
      const response = await routeLoader({ url: url });
      if (!response.next) {
        currentPageRef.current = 0;
      }
      // setPostList([...postListObject, ...response.results]);
      setPostList(p => [...p, ...response.results]);

    } catch {
      currentPageRef.current = 0;
    }
  }

  return (
    <>
      <div
        className='fixed right-0 break-all w-96'>{JSON.stringify(postListObject.map(t => t.replies.map(r => [t.id, r.id])))}
        <br />
        {JSON.stringify(postListObject.length)}</div>
      {postListJsx}
      <var ref={intersectionRef}></var>
      {/*<PostForm />*/}
    </>
  );
}
