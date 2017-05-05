const _ = require('lodash');

module.exports = function (tree) {
    let needSectionHeader = false;
    
    function makeDom (tree, isRoot = false) {
        if (typeof tree === 'string') {
            return tree;
        }
        
        const tagName = tree.shift();
        const headerMatch = tagName.match('^h([1-9][0-9]*)$');

        if (headerMatch) {
            const level = parseInt(headerMatch[1]);
            const footer = needSectionHeader ? '' : '</section>';
            
            needSectionHeader = true;
            
            return [
                footer,
                '<section>',
                `<${tagName}>`,
                tree.shift(),
                `</${tagName}>`,
                '</section>'
            ].join('');
        } else {
            const header = needSectionHeader ? '<section>' : '';
            
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
    
    return makeDom(tree, true);
};
