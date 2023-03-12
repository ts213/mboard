export async function editPostAction({ request, params }) {
  const formData = await request.formData();

  try {
    return await submitForm(formData, request, params);
  } catch (e) {
    return e;
  }
}

async function submitForm(formData, request) {
  const url = '/api' + new URL(request.url).pathname;
  const r = await fetch(url, {
    method: request.method,
    body: formData,
  });

  if (r.status >= 300) {
    throw { errors: 'response error', status: 422 };  // ?? 422
  }
  // return r;
  return {edited: 'ok'}
}
