export default class InnerPager {
    constructor (root) {
        this.root = root;
        this.blocks = this.pickupBlocks();
        this.setRangeStart();
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

    setRangeStart (rangeStart = 0) {
        if (rangeStart >= this.blocks.length) {
            rangeStart = 0;
        }
        
        this.blocks.forEach((block, index) => {
            block.style.display = (index < rangeStart) ? 'none' : '';
        });

        let omitCount = 0;
        while (this.root.scrollHeight > this.root.offsetHeight) {
            this.blocks[this.blocks.length - (omitCount + 1)].style.display = 'none';
            omitCount++;
        }

        this.root.setAttribute('data-range-start', rangeStart);
        this.root.setAttribute('data-range-end', this.blocks.length - omitCount);
    }

    increment () {
        const rangeStart = parseInt(this.root.getAttribute('data-range-end')) || 0;
        this.setRangeStart(rangeStart);
    }
}
