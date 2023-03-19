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
    const data = await submitForm(formData, request);
    // if (!userid && data?.post?.userid) {
    //   userid = data.post.userid;
    //   localStorage.setItem('userid', userid);
    // }

    // dispatchPostChangeEvent(data.post.id);
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
  return await submitForm(null, request);
}

async function submitForm(formData=undefined, request) {
  const url = '/api' + new URL(request.url).pathname; // building backend url
  let headers = undefined;

  if (request.method === 'DELETE' || request.method === 'PATCH') {
    const userid = localStorage.getItem('userid');
    if (userid) {
      headers = { userid: userid };
    }
  }

  const response = await fetch(url, {
    method: request.method,
    body: formData,
    headers: headers,
  });

  if (!response.ok) {
    throw { errors: 'response error', status: 422 };  // ?? 422
  }

  const data = await response.json();

  dispatchPostChangeEvent(data.post.id, request.method);   // response.ok means form was ok?????
  return data;
}

function dispatchPostChangeEvent(postId, method) { // won't work in other open tabs
  window.dispatchEvent(new CustomEvent(
    'postChange',
    { detail: { postId: Number(postId), method: method } }
  ));
}
