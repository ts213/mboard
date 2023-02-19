export async function formAction({ request, params }) {
  const formData = await request.formData();

  if (formData.get('file').size === 0) {  // not sending empty file field to server, validation error if sent
    formData.delete('file');  // better'd be not to include such a field... how todo
  }
  console.log('action data called');

  try {
    return await submitForm(formData, request, params);
  } catch (e) {
    return e;  // stopping here if error, error is available in useActionData()
  }
  // return redirect('');
}

async function submitForm(formData, request) {
  const url = '/api' + new URL(request.url).pathname;
  const body = request.method === 'DELETE' ? undefined : formData;
  const r = await fetch(url, {
    method: request.method,
    body: body,
  });

  if (r.status >= 300) {
    throw { errors: 'response error', status: 422 };  // ?? 422
  }
  return r.json();
}
