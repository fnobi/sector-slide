const ATTR_STATE = 'data-state';

const pages = document.querySelectorAll('section,article');
let currentIndex;


function init () {
    const defaultPage = parseHash();
    setPageIndex((defaultPage >= 0) ? defaultPage : 0);
    initListeners();
    setupInnerPaging();
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
            const nextIndex = article.getAttribute('data-next-index');
            article.setAttribute('data-start-index', nextIndex);
            applyInnerPaging(article);
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

function setupInnerPaging () {
    const allArticle = document.querySelectorAll('article');
    for (let i = 0; i < allArticle.length; i++) {
        applyInnerPaging(allArticle[i]);
    }
}

function applyInnerPaging (article) {
    const des = article.querySelectorAll('*');
    const blocks = filterBlocks(des);
    const attrStartIndex = article.getAttribute('data-start-index');
    const startIndex = isNaN(attrStartIndex) ? 0 : parseInt(attrStartIndex);
    
    blocks.forEach((block, index) => {
        block.style.display = (index < startIndex) ? 'none' : '';
    });

    let emitCount = 0;
    while (article.scrollHeight > article.offsetHeight) {
        blocks[blocks.length - (emitCount + 1)].style.display = 'none';
        emitCount++;
    }

    article.setAttribute('data-next-index', blocks.length - emitCount);
}

function filterBlocks (nodeList) {
    const blocks = [];
    for (let i = 0; i < nodeList.length; i++) {
        const node = nodeList[i];
        const isHeader = /^h[1-9][0-9]*$/i.test(node.tagName);
        const isParent = node.children.length;
        if (!isHeader && !isParent) {
            blocks.push(node);
        }
    }
    return blocks;
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
