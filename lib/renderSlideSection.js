const _ = require('lodash');

module.exports = function (tree) {
    function makeDom (tree, isRoot = false) {
        if (typeof tree === 'string') {
            return tree;
        }
        const tagName = tree.shift();
        return [
            isRoot ? '' : `<${tagName}>`,
            _.map(tree, (subTree) => {
                return makeDom(subTree);
            }).join(''),
            isRoot ? '' : `</${tagName}>`
        ].join('');
    }
    return makeDom(tree, true);
};
