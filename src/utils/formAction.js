const api_prefix = import.meta.env.VITE_API_PREFIX;

export async function createNewPostAction({ request, params }) {
  const formData = await request.formData();

  params.board && formData.set('board', params.board);

  if (!params.threadId) {
    let new_path = request.url; // request is immutable
    new_path += new_path.endsWith('/') ? 'thread/0/' : '/thread/0/';  // thread/0/ == new thread
    request = new Request(new_path, request);
  } else {
    formData.set('thread', params.threadId);
  }

  if (formData.get('file')?.size === 0) {  // not sending empty file field to server, validation error if sent
    formData.delete('file');
  }

  let userid = localStorage.getItem('user_id');
  if (userid) {
    formData.set('user_id', userid);
  }

  try {
    const data = await submitForm(request, formData);
    if (!userid && data?.post?.user_id) {
      userid = data.post.user_id;
      localStorage.setItem('user_id', userid);
    }

    return data;
  } catch (e) {
    return e;
  }
}

export async function editPostAction(request) {
  const formData = await request.formData();
  try {
    return await submitForm(request, formData);
  } catch (e) {
    return e;
  }
}

export async function deletePostAction(request) {
  try {
    return await submitForm(request, null);
  } catch (e) {
    return e;
  }
}

async function submitForm(request, formData = undefined) {
  let url = api_prefix + new URL(request.url).pathname;
  url += url.endsWith('/') ? '' : '/';
  url += new URL(request.url).search;

  let headers = undefined;

  if (request.method === 'DELETE' || request.method === 'PATCH') {
    const userid = localStorage.getItem('user_id');
    if (userid) {
      headers = { 'User-Id': userid };
    }
  }

  const response = await fetch(url, {
    method: request.method,
    body: formData,
    headers: headers,
  });
  const data = await response.json();

  if (!response.ok) {
    throw {
      errors: data.errors ?? 'response error',
    };
  }

  dispatchPostChangeEvent(data.post.id, request.method);
  return data;
}

function dispatchPostChangeEvent(postId, method) { // won't work in other open tabs
  window.dispatchEvent(new CustomEvent(
    'postChange',
    { detail: { postId: Number(postId), method: method } }
  ));
}
