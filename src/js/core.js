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

    window.addEventListener('resize', () => {
        innerPagerList.forEach((innerPager) => {
            if (!innerPager) {
                return;
            }
            innerPager.reload();
        });
    });

    document.body.addEventListener('click', (e) => {
        const x = e.pageX;
        const rate = x / window.innerWidth;
        if (rate < 0.5) {
            decrement();
        } else {
            increment();
        }
    });
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
    for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        if (/^article$/i.test(page.tagName)) {
            const innerPager = new InnerPager(page);
            innerPager.on('overEnd', incrementPage);
            innerPager.on('overStart', decrementPage);
            innerPagerList[i] = innerPager;
        } else {
            innerPagerList[i] = null;
        }
    }
}

function incrementPage () {
    setPageIndex(currentIndex + 1);
}

function decrementPage () {
    setPageIndex(currentIndex - 1);
}

function increment () {
    const innerPager = innerPagerList[currentIndex];
    if (innerPager) {
        innerPager.increment();
    } else {
        incrementPage();
    }
}

function decrement () {
    const innerPager = innerPagerList[currentIndex];
    if (innerPager) {
        innerPager.decrement();
    } else {
        decrementPage();
    }
}

window.addEventListener('keydown', function (e) {
    switch (e.which) {
    case 37: // left
        decrement(); break;
    case 38: // up
        decrement(); break;
    case 39: // right
        increment(); break;
    case 40: // down
        increment(); break;
    }
});

init();
