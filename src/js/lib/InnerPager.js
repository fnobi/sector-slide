import EventEmitter from 'events';

const IGNORE_PATTERN = new RegExp('^' + [
    'header'
].join('|') + '$', 'i');

const SKIP_PATTERN = new RegExp('^' + [
    'ul',
    'ol',
    'dl'
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
                if (SKIP_PATTERN.test(child.tagName)) {
                    calculateRecursive(child);
                } else {
                    blocks.push(child);
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
