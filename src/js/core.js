const ATTR_STATE = 'data-state';

const pages = document.querySelectorAll('section,article');
let currentIndex;


function init () {
    setPageIndex(0);
    setTimeout(setReady);
}

function setReady (isReady=true) {
    for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        page.setAttribute('data-ready', isReady);
    }
}

function setPageIndex (index) {
    index = Math.max(index, 0);
    index = Math.min(index, pages.length - 1);

    for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        if (i === index) {
            page.setAttribute(ATTR_STATE, 'current');
        } else if (i < index) {
            page.setAttribute(ATTR_STATE, 'past');
        } else if (i > index) {
            page.setAttribute(ATTR_STATE, 'future');
        }
    }
    
    currentIndex = index;
}

window.addEventListener('keydown', function (e) {
    switch (e.which) {
    case 37: // left
        setPageIndex(currentIndex - 1);
        break;
    case 38: // up
        setPageIndex(currentIndex - 1);
        break;
    case 39: // right
        setPageIndex(currentIndex + 1);
        break;
    case 40: // down
        setPageIndex(currentIndex + 1);
        break;
    }
});

init();
