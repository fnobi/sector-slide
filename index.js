const EventEmitter = require('events');
const path = require('path');

const fsp = require('fs-promise');
const markdown = require('markdown').markdown;
const pug = require('pug');

const TEMPLATE_PUG = `${__dirname}/src/pug/index.pug`;

class SectorSlide extends EventEmitter {
    constructor (opts = {}) {
        super();
        this.documentMarkdown = opts.documentMarkdown;
        this.src = opts.src;
        this.docroot = opts.docroot;
    }

    start () {
        return Promise.resolve()
            .then(() => { return this.loadDocumentMarkdown(); })
            .then(() => { return this.renderDocumentHTML(); })
            .then(() => { return this.renderPug(); })
            .then(() => { return this.exportWeb(); });
    }

    loadDocumentMarkdown () {
        return new Promise((resolve, reject) => {
            if (this.documentMarkdown) {
                resolve();
                return;
            }
            if (!this.src) {
                reject(new Error('src is not found.'));
                return;
            }

            fsp.readFile(this.src, { encoding: 'utf8' }).then(
                (body) => {
                    this.documentMarkdown = body;
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
    
    renderDocumentHTML () {
        return new Promise((resolve, reject) => {
            this.documentHTML = markdown
                      .toHTML(this.documentMarkdown)
                      .replace(/\n */g, '');
            resolve(this.documentHTML);
        });
    }

    loadPugTemplate () {
        return new Promise((resolve, reject) => {
            fsp.readFile(TEMPLATE_PUG, { encoding: 'utf8' }).then(
                resolve,
                (err) => {
                    reject(new Error([
                        'fail to load pug template',
                        err.toString()
                    ].join('\n')));
                }
            );
        });
    }

    renderPug () {
        return new Promise((resolve, reject) => {
            this.loadPugTemplate().then((pugTemplate) => {
                const fn = pug.compile(pugTemplate, {
                    pretty: false
                });
                this.indexHTML = fn({
                    content: this.documentHTML
                });
                resolve(this.indexHTML);
            });
        });
    }

    exportWeb () {
        return Promise.resolve().then(() => {
            return fsp.mkdirp(this.docroot);
        }).then(() => {
            return fsp.writeFile(
                path.resolve(this.docroot, 'index.html'),
                this.indexHTML
            );
        });
    }
};

module.exports = SectorSlide;
