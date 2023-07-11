function selectTranslation(translation) {
  const lang = navigator.language.includes('ru') ? 'ru' : 'en';
  return Object.keys(translation).reduce((acc, curr) => {
    acc[curr] = translation[curr][lang];
    return acc;
  }, {});
}

const translation = {
  'boards': {
    'en': 'Boards',
    'ru': 'Доски'
  },
  'board': {
    'en': 'Board',
    'ru': 'Доска'
  },
  'posts': {
    'en': 'Posts',
    'ru': 'Постов'
  },
  'userboards': {
    'en': 'Userboards',
    'ru': 'Пользовательские'
  },
  'allBoards': {
    'en': 'All boards',
    'ru': 'Все доски'
  },
  'postsLast24h': {
    'en': 'Posts last 24 hours',
    'ru': 'Постов за сутки'
  },
  'newBoard': {
    'en': 'New board',
    'ru': 'Новая доска'
  },
  'boardTitle': {
    'en': 'Board title',
    'ru': 'Название доски'
  },
  'newBoardTitleDesc': {
    'en': 'Any title less than 15 characters',
    'ru': 'Название меньше 15 символов'
  },
  'boardLink': {
    'en': 'Board link',
    'ru': 'Ссылка на доску'
  },
  'newBoardLinkDesc': {
    'en': 'Like "/b/" without slashes',
    'ru': 'Как "/b/" без слэшей'
  },
  'submitButton': {
    'en': 'Submit',
    'ru': 'Отправить'
  },
  'selectFile': {
    'en': 'SELECT A FILE',
    'ru': 'ВЫБРАТЬ ФАЙЛ'
  },
  'open': {
    'en': 'Open',
    'ru': 'Открыть'
  },
  'close': {
    'en': 'Close',
    'ru': 'Закрыть'
  },
  'reply': {
    'en': 'Reply',
    'ru': 'Ответить'
  },
  'replies': {
    'en': 'Replies',
    'ru': 'Постов'
  },
  'replyToThread': {
    'en': 'Reply to thread:',
    'ru': 'Ответить в тред:'
  },
  'edit': {
    'en': 'Edit',
    'ru': 'Изменить'
  },
  'delete': {
    'en': 'Delete',
    'ru': 'Удалить'
  },
  'cancel': {
    'en': 'Cancel',
    'ru': 'Отменить'
  },
  'newThread': {
    'en': 'New Thread',
    'ru': 'Новый тред'
  },
  'catalog': {
    'en': 'Catalog',
    'ru': 'Каталог'
  },
  'return': {
    'en': 'Return',
    'ru': 'Назад'
  },
  'top': {
    'en': 'Top',
    'ru': 'Вверх'
  },
  'update': {
    'en': 'Update',
    'ru': 'Обновить'
  },
  'auto': {
    'en': '[Auto]',
    'ru': '[Автоматически]'
  },
  'postsLoaded': {
    'en': 'Posts Loaded',
    'ru': 'Загружено постов'
  },
  'loadMore': {
    'en': '[Load More]',
    'ru': '[Загрузить ещё]'
  },
  'loadAll': {
    'en': '[Load All]',
    'ru': '[Загрузить все]'
  },
  'noNewPosts': {
    'en': '[No new posts]',
    'ru': '[Нет новых постов]'
  },
  'loading': {
    'en': 'Loading...',
    'ru': 'Загрузка...'
  }
};

export default selectTranslation(translation);
