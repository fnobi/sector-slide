const _ = require('lodash');
const md = require('markdown').markdown;

module.exports = function (markdown) {
    const tree = md.toHTMLTree(
        preprocess(markdown)
    );

    let needSectionHeader = false;
    const headers = [];
    
    function makeDom (tree, isRoot = false) {
        if (typeof tree === 'string') {
            return escapeContent(tree);
        }
        
        const tagName = tree.shift();
        const headerMatch = tagName.match('^h([1-9][0-9]*)$');

        const attr = (
            typeof tree[0] === 'object' && !(tree[0] instanceof Array)
        ) ? tree.shift() : null;

        if (headerMatch) {
            const level = parseInt(headerMatch[1]);
            const text = tree.shift();
            const footer = needSectionHeader ? '' : '</article>';
            
            applyHeader(level, text);
            
            needSectionHeader = true;

            return [
                footer,
                '<section>',
                `<${tagName}>`,
                text,
                `</${tagName}>`,
                '</section>'
            ].join('');
        } else {
            const header = needSectionHeader ? (
                '<article>' + createHeaderGroup()
            ) : '';
            
            needSectionHeader = false;

            return [
                header,
                isRoot ? '' : `<${tagName}${renderAttribute(attr)}>`,
                _.map(tree, (subTree) => {
                    return makeDom(subTree);
                }).join(''),
                isRoot ? '' : `</${tagName}>`
            ].join('');
        }
    }

    function applyHeader (level, text) {
        if (headers.length > level - 1) {
            headers.length = level - 1;
        }
        headers.push(text);
    }

    function createHeaderGroup () {
        return [
            '<header>',
            _.map(headers, (text, index) => {
                const level = index + 1;
                return `<h${level}>${text}</h${level}>`;
            }).join(''),
            '</header>'
        ].join('');
    }

    function renderAttribute (attr) {
        if (!attr) {
            return '';
        }
        return _.map(attr, (val, key) => {
            return ` ${key}="${val}"`;
        }).join('');
    }
    
    return makeDom(tree, true);
};

function escapeContent (content) {
    return content
        // markdownの特殊文字はバックスラッシュでエスケープされる（はず）
        .replace(/\\([\\`*_{}\[\]()#+-.!])/g, '$1')

        // string行頭の改行は無視（意図がずれるケースが多い）
        .replace(/^\n*/, '');
}

function preprocess (markdown) {
    const codeSections = markdown.split(/```/g);
    markdown = _.map(codeSections, (text, index) => {
        if (index % 2 === 0) {
            return text;
        } else {
            // 連続改行はpと解釈されるので
            const regexp = /\n\n/;
            while (regexp.test(text)) {
                text = text.replace(regexp, '\n&nbsp;\n');
            }
            return text;
        }
    }).join('```');
    return markdown;
}
