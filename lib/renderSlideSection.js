const _ = require('lodash');

module.exports = function (tree) {
    let afterDocument = true;
    
    function makeDom (tree, index, isRoot = false) {
        if (typeof tree === 'string') {
            return tree;
        }
        
        const tagName = tree.shift();
        const headerMatch = tagName.match('^h([1-9][0-9]*)$');

        if (headerMatch) {
            const level = parseInt(headerMatch[1]);
            const section = [
                (index && afterDocument) ? '</section>' : '',
                afterDocument ? '<section>' : '',
                `<${tagName}>`,
                tree.shift(),
                `</${tagName}>`,
                '</section>',
                '<section>'
            ].join('');
            afterDocument = false;
            return section;
        } else {
            afterDocument = true;
            return [
                isRoot ? '' : `<${tagName}>`,
                _.map(tree, (subTree, index) => {
                    return makeDom(subTree, index);
                }).join(''),
                isRoot ? '' : `</${tagName}>`
            ].join('');
        }
    }
    
    return makeDom(tree, 0, true);
};
