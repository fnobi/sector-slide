var ATTR_STATE = 'data-state';

var pages = document.querySelectorAll('section,article');
var currentIndex;

function setReady (isReady=true) {
    for (var i = 0; i < pages.length; i++) (function (i) {
        var page = pages[i];
        page.setAttribute('data-ready', isReady);
    })(i);
}

function setPageIndex (index) {
    index = Math.max(index, 0);
    index = Math.min(index, pages.length - 1);

    for (var i = 0; i < pages.length; i++) (function (i) {
        var page = pages[i];
        if (i === index) {
            page.setAttribute(ATTR_STATE, 'current');
        } else if (i < index) {
            page.setAttribute(ATTR_STATE, 'past');
        } else if (i > index) {
            page.setAttribute(ATTR_STATE, 'future');
        }
    })(i);
    
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

setPageIndex(0);
setReady();
