import EventEmitter from 'events';
import _ from 'lodash';

const IGNORE_PATTERN = new RegExp('^' + [
    'header'
].join('|') + '$', 'i');

export default class InnerPager extends EventEmitter {
    constructor (root) {
        super();
        this.root = root;
        this.blocks = this.pickupBlocks();
        this.reload();
    }

    pickupBlocks () {
        const blocks = [];

        function calculateRecursive (el, index = '') {
            Array.from(el.children).forEach((child) => {
                if (IGNORE_PATTERN.test(child.tagName)) {
                    return;
                }

                const hasTextChild = _.some(child.childNodes, (n) => {
                    return n.nodeType === Node.TEXT_NODE;
                });

                if (hasTextChild) {
                    blocks.push(child);
                } else {
                    calculateRecursive(child);
                }
            });
        }

        calculateRecursive(this.root);

        return blocks;
    }

    reload () {
        this.setRangeStart(this.rangeStart);
    }

    setRangeStart (rangeStart = 0) {
        if (rangeStart >= this.blocks.length) {
            this.emit('overEnd');
            return;
        }
        
        this.blocks.forEach((block, index) => {
            block.style.display = (index < rangeStart) ? 'none' : '';
        });

        let omitCount = 0;
        while (this.root.scrollHeight > this.root.offsetHeight && omitCount < this.blocks.length) {
            const index = this.blocks.length - (omitCount + 1);
            this.blocks[index].style.display = 'none';
            omitCount++;
        }

        this.rangeStart = rangeStart;
        this.rangeEnd = this.blocks.length - omitCount;
    }

    setRangeEnd (rangeEnd = this.blocks.length) {
        if (rangeEnd <= 0) {
            this.emit('overStart');
            return;
        }
        
        this.blocks.forEach((block, index) => {
            block.style.display = (index >= rangeEnd) ? 'none' : '';
        });

        let omitCount = 0;
        while (this.root.scrollHeight > this.root.offsetHeight) {
            this.blocks[omitCount].style.display = 'none';
            omitCount++;
        }

        this.rangeStart = omitCount;
        this.rangeEnd = rangeEnd;
    }
    
    increment () {
        this.setRangeStart(this.rangeEnd);
    }

    decrement () {
        this.setRangeEnd(this.rangeStart);
    }
}
