import { PostList } from '../PostList.jsx';
import { useRef, useState } from 'react';
import { useFetchPaginatedPosts } from '../hooks/useFetchPaginatedPosts.jsx';
import { PostForm } from '../PostForm.jsx';

export default function ThreadList() {
  const [postList, setPostList] = useState([]);
  const intersectionRef = useRef();

  useFetchPaginatedPosts(intersectionRef, setPostList);

  return (
    <>
      <PostList postList={postList} />
      <var ref={intersectionRef}></var>
      <PostForm />
    </>
  );
}
