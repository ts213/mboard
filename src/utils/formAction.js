export async function createNewPostAction({ request }) {
  const formData = await request.formData();

  if (formData.get('file')?.size === 0) {  // not sending empty file field to server, validation error if sent
    formData.delete('file');  // better'd be not to even include it... todo
  }

  let userid = localStorage.getItem('userid');
  if (userid) {
    formData.set('userid', userid);
  }

  try {
    const data = await submitForm(formData, request).then(r => r.json());
    if (!userid && data?.post?.userid) {
      userid = data.post.userid;
      localStorage.setItem('userid', userid);
    }

    dispatchPostChangeEvent(data.post.id);
    return data;
  } catch (e) {
    return e;  // stopping here if error, error is available in useActionData()
  }
}

export async function editPostAction({ request }) {
  const formData = await request.formData();
  try {
    return await submitForm(formData, request);
  } catch (e) {
    return e;
  }
}

export async function deletePostAction({ request, params }) {
  dispatchPostChangeEvent(params.postId);
  return await submitForm(null, request);
}

async function submitForm(formData, request) {
  const url = '/api' + new URL(request.url).pathname; // building backend url
  const body = request.method === 'DELETE' ? null : formData;
  const response = await fetch(url, {
    method: request.method,
    body: body,
  });

  if (!response.ok || response.status >= 300) {
    throw { errors: 'response error', status: 422 };  // ?? 422
  }
  return response;
}

function dispatchPostChangeEvent(postId) { // won't work in other open tabs
  window.dispatchEvent(new CustomEvent(
    'postChange',
    { detail: { postId: postId } }
  ));
}
