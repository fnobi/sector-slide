const EventEmitter = require('events');
const fsp = require('fs-promise');
const markdown = require('markdown').markdown;

class SectorSlide extends EventEmitter {
    constructor (opts = {}) {
        super();
        this.markdown = opts.markdown;
        this.src = opts.src;
    }

    start () {
        return Promise.resolve()
            .then(() => { return this.loadMarkdown(); })
            .then(() => { return this.renderHTML(); });
    }

    loadMarkdown () {
        return new Promise((resolve, reject) => {
            if (this.markdown) {
                resolve();
                return;
            }
            if (!this.src) {
                reject(new Error('src is not found.'));
                return;
            }

            fsp.readFile(this.src, { encoding: 'utf8' }).then(
                (body) => {
                    this.markdown = body;
                    resolve(body);
                },
                (err) => {
                    reject(new Error([
                        `fail to load file "${this.src}".`,
                        err.toString()
                    ].join('\n')));
                }
            );
        });
    }
    
    renderHTML () {
        return new Promise((resolve, reject) => {
            const html = markdown.toHTML(this.markdown);
            this.html = html;
            resolve(html);
        });
    }
};

module.exports = SectorSlide;
