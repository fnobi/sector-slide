import InnerPager from './lib/InnerPager';

const ATTR_STATE = 'data-state';

const pages = document.querySelectorAll('section,article');
const innerPagerList = [];
let currentIndex;


function init () {
    const defaultPage = parseHash();
    setPageIndex((defaultPage >= 0) ? defaultPage : 0);
    
    initInnerPager();
    initListeners();
    setTimeout(setReady);
}

function parseHash () {
    const hash = location.hash;
    const pageMatch = hash.match(/^#?p([1-9][0-9]*)/);
    if (pageMatch) {
        return parseInt(pageMatch[1]);
    } else {
        return -1;
    }
}

function initListeners () {
    window.addEventListener('hashchange', () => {
        const page = parseHash();
        if (page >= 0) {
            setPageIndex(page);
        }
    });

    const allArticle = document.querySelectorAll('article');
    for (let i = 0; i < allArticle.length; i++) {
        const article = allArticle[i];
        article.addEventListener('click', () => {
            innerPagerList[i].increment();
        });
    }
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
    location.hash = `#p${index}`;
}

function initInnerPager () {
    const allArticle = document.querySelectorAll('article');
    for (let i = 0; i < allArticle.length; i++) {
        innerPagerList.push(new InnerPager(allArticle[i]));
    }
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
