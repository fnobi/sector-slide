import EventEmitter from 'events';

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
            const isHeader = /^h[1-9][0-9]*$/i.test(el.tagName);
            const style = window.getComputedStyle(el);
            const display = style.display;
            const hasHeight = el.offsetHeight && (display !== 'inline') && (display !== 'none');

            if (isHeader) {
                return hasHeight;
            }
            
            let childrenHasHeight = false;
            for (let i = 0; i < el.children.length; i++) {
                const childHasHeight = calculateRecursive(el.children[i], i);
                childrenHasHeight = childrenHasHeight || childHasHeight;
            }

            if (el.children.length) {
                if (!childrenHasHeight) {
                    blocks.push(el);
                }
            } else {
                if (hasHeight) {
                    blocks.push(el);
                }
            }

            return hasHeight;
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
