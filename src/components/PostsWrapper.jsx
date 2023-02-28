export function PostsWrapper({ children }) {

  return (
    <div className='m-12 flex flex-col flex-wrap items-start'>
      {children}
    </div>
  );
}
