export function addRepliesToPosts() {
  const quotes = document.querySelectorAll('.quote-link');
  quotes.forEach(quoteElmnt => {
    try {
      const quotedPost = document.getElementById(quoteElmnt.dataset.quoted);
      const replyId = quoteElmnt.closest('article').id;
      const replyElement = createAnchorElmnt(replyId);
      quotedPost.querySelector('sub').appendChild(replyElement);
    } catch (e) {
      console.log(e.name, e.message, 'postId: ', quoteElmnt.dataset.quoted);
    }
  });
}

function createAnchorElmnt(replyId) {
  const a = document.createElement('a');
  a.href = `#${replyId}`;
  a.text = `>>${replyId}`;
  a.className = 'quote-link mr-1';
  return a;
}
