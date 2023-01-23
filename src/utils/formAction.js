export async function formAction({ request, params }) {
  const formData = await request.formData();
  try {
    return await submitForm(formData, request, params);
  } catch (e) {
    return e;  // stopping here if error, error is available in useActionData()
  }
  // return redirect('');
}

async function submitForm(formData, request) {
  // const url = `/api/testurl/${params.postId}/`;
  // const url = `/api/posting/`;
  const url = '/api' + new URL(request.url).pathname;
  const body = request.method === 'DELETE' ? undefined : formData;

  const r = await fetch(url, {
    method: request.method,
    body: body,
  });
  if (r.status !== 201) {
    throw { errMsg: 'response error', status: 422 };
  }
  return r.json();
}
