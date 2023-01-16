export function PostsWrapper({ posts }) {
  return (
    <div className='m-12 flex flex-col flex-wrap items-start'>
      {posts}
    </div>
  )
}
