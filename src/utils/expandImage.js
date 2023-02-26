export function expandImage(ev, img, setImg) {
  let imgWrapper = document.getElementById('img-wrapper');

  if (ev.target.classList.contains('img-thumb')) {
    ev.preventDefault();
    if (ev.target.dataset.num === imgWrapper?.dataset.num) {
      imgWrapper.remove();
    } else {
      displayImage(ev);
    }
    return;
  }

  if (imgWrapper && ev.target.id !== 'expanded-img') {
    imgWrapper.remove();
  }

  function displayImage(ev) {
    if (imgWrapper) {
      imgWrapper.remove();
    }

    imgWrapper = document.createElement('div');
    const imgElmnt = document.createElement('img');
    imgElmnt.id = 'expanded-img';

    imgWrapper.id = 'img-wrapper';

    let fullImg = ev.target.parentElement;
    let [w, h] = resizeImg(fullImg.dataset.width, fullImg.dataset.height, window.innerWidth, window.innerHeight);
    imgWrapper.style.width = w;
    imgWrapper.style.height = h;
    imgWrapper.dataset.num = ev.target.dataset.num;

    imgElmnt.src = fullImg.href;
    drag_elmnt(imgElmnt);

    const imagePlaceholderDiv = document.getElementById('img-placeholder');
    imagePlaceholderDiv.appendChild(imgWrapper);

    imgElmnt.onload = function () {
      imgWrapper.appendChild(imgElmnt);
    };
    ['mousedown', 'mousemove', 'wheel'].forEach(function (e) {
      imgWrapper.addEventListener(e, handleEvent);
    });
  }
}

function resizeImg(imgWidth, imgHeight, maxWidth, maxHeight) {
  let ratio = Math.min(1, maxWidth / imgWidth, maxHeight / imgHeight);
  let w = imgWidth * ratio + 'px';
  let h = imgHeight * ratio + 'px';
  return [w, h];
}

function handleEvent(ev) {
  switch (ev.type) {
    case 'mousemove':
      ev.target.mouseDown = false;
      return;
    case 'mousedown':
      ev.target.mouseDown = true;
      ev.target.addEventListener('mouseup', handleEvent);
      return;
    case 'mouseup':
      if (ev.target.mouseDown === true && ev.button === 0) {
        console.log(222, ev.target.mouseDown)
        ev.target.removeEventListener('mouseup', handleEvent);
        ev.target.parentElement.remove();
      }
      return;
    case 'wheel':
      mouseWheelChangeSize(ev);
      return;
  }
}

function mouseWheelChangeSize(ev) {
  ev.preventDefault();
  ev.target.parentElement.style.height = '';
  console.log(ev.target.parentElement)
  let w = ev.target.parentElement.offsetWidth;
  ev.target.parentElement.style.width = (w - ev.deltaY * 1.5) + 'px';
}

function drag_elmnt(elmnt) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.parentNode.style.top = (elmnt.parentNode.offsetTop - pos2) + 'px';
    elmnt.parentNode.style.left = (elmnt.parentNode.offsetLeft - pos1) + 'px';
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
