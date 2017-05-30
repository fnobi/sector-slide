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

        function calculateRecursive (el) {
            const isHeader = /^h[1-9][0-9]*$/i.test(el.tagName);
            
            if (el.children.length) {
                let height = 0;
                for (let i = 0; i < el.children.length; i++) {
                    height += calculateRecursive(el.children[i]);
                }
                if (!height && !isHeader) {
                    blocks.push(el);
                }
                return height;
            } else {
                if (el.offsetHeight && !isHeader) {
                    blocks.push(el);
                }
                return el.offsetHeight;
            }
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
        while (this.root.scrollHeight > this.root.offsetHeight) {
            this.blocks[this.blocks.length - (omitCount + 1)].style.display = 'none';
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
