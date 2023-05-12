import { redirect } from 'react-router-dom';
import { VITE_API_PREFIX } from '../../App.jsx';

export async function newPostAction({ request, params }) {
  const formData = await buildFormData(request, params);

  if (!params.threadId) {
    request = buildNewThreadRequest(request, formData);
  }

  try {
    var data = await submitForm(request, formData);
  } catch (e) {
    return e;
  }

  if (data?.post?.user_id) {
    localStorage.setItem('user_id', data.post.user_id);
  }

  if (!params.threadId || !location.pathname.includes(params.threadId)) {
    return redirect(
      `/${data.post.board}/thread/`
      + `${data.post.thread ?? data.post.id}`
      + `/#${data.post.id}`
    );
  }

  return data;
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
    const data = await submitForm(request, null);

    if (data?.deleted === 1) {
      window.dispatchEvent(new CustomEvent(
        'postDeleted',
        { detail: { postId: data?.post.id } }
      ));

      if (!data?.post.thread) {
        return redirect(`/${data.post.board ?? ''}/`);
      }
    }
    return data;

  } catch (e) {
    return e;
  }
}

async function submitForm(request, formData = undefined) {
  let url = VITE_API_PREFIX + new URL(request.url).pathname;
  url += url.endsWith('/') ? '' : '/';
  url += new URL(request.url).search;

  let headers;

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

function dispatchPostChangeEvent(postId, method) {
  window.dispatchEvent(new CustomEvent(
    'postChange',
    { detail: { postId: Number(postId), method: method } }
  ));
}

async function buildFormData(request, params) {
  const formData = await request.formData();
  formData.set('board', params.board);
  formData.set('thread', params.threadId);

  if (formData.get('file')?.size === 0) {  // not sending empty file field to server, validation error if sent
    formData.delete('file');
  }

  let userid = localStorage.getItem('user_id');
  if (userid) {
    formData.set('user_id', userid);
  }
  return formData;
}

function buildNewThreadRequest(request, formData) {
  formData.delete('thread');

  let new_path = request.url; // request is immutable
  new_path += new_path.endsWith('/') ? 'thread/0/' : '/thread/0/';  // thread/0/ == new thread

  return new Request(new_path, {
    headers: request.headers,
    method: request.method,
    mode: request.mode,
  });
}

/** @property {string | undefined} params.threadId */
/** @property {string} data.post.user_id */
/** @property {number | undefined} data.deleted */
/** @property {number | null} data.post.thread */
