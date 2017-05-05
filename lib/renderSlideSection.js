const _ = require('lodash');

module.exports = function (tree) {
    let needSectionHeader = false;
    const headers = [];
    
    function makeDom (tree, isRoot = false) {
        if (typeof tree === 'string') {
            return tree;
        }
        
        const tagName = tree.shift();
        const headerMatch = tagName.match('^h([1-9][0-9]*)$');

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
                isRoot ? '' : `<${tagName}>`,
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
    
    return makeDom(tree, true);
};