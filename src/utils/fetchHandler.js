/** @param {string} url **/
export async function routeLoaderHandler(url) {
  const response = await fetch(url);
  if (!response.ok) {

    if (response.status === 429) {
      return {};
    }

    throw new Response('loader error', { status: response.status });
  }
  return response.json();
}

/** @param {string | Request} url **/
export async function submitFormHandler(url) {
  const response = await fetch(url);
  const data = await response.json();

  if (response.ok) {
    return data;
  }

  if (data.errors) {
    throw { errors: data.errors };
  }
  else {
    return badFormSubmitHandler(response);
  }
}

function badFormSubmitHandler(response) {
  if (response.status === 429) {
    return null;
  }

  if (response.status === 403) {
    forbiddenResponseHandler(response);
    return;
  }

  throw { errors: 'Submit form error' };
}

function forbiddenResponseHandler(response) {
  /** a user created board might have been deleted; user still has its >board_link< in his storage **/
  /** this's a hack, not a solution; url params might clash with other board links **/
  let boardList = JSON.parse(localStorage.getItem('boards'));
  if (boardList) {
    const urlParams = response.url.split('/');
    const noPermBoard = boardList.find(board => urlParams.includes(board));
    if (noPermBoard) {
      boardList = boardList.filter(board => board !== noPermBoard);
      localStorage.setItem('boards', JSON.stringify(boardList));
    }
  }
}
