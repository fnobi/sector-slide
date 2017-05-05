const EventEmitter = require('events');
const path = require('path');

const fsp = require('fs-promise');
const md = require('markdown').markdown;
const pug = require('pug');

const renderSlideSection = require('./lib/renderSlideSection');

const TEMPLATE_PUG = `${__dirname}/src/pug/index.pug`;

class SectorSlide extends EventEmitter {
    constructor (opts = {}) {
        super();
        this.src = opts.src;
        this.docroot = opts.docroot;
        this.files = {};
    }

    start () {
        return Promise.resolve()
            .then(() => { return this.loadFile(this.src); })
            .then(() => { return this.loadFile(TEMPLATE_PUG); })
            .then(() => { return this.initDocRoot(); })
            .then(() => {
                const pugTemplate = this.files[TEMPLATE_PUG];
                const documentMarkdown = this.files[this.src];
                
                const fn = pug.compile(pugTemplate, {
                    pretty: false
                });
                const dest = fn({
                    content: this.renderDocumentHTML(documentMarkdown)
                });
                return fsp.writeFile(
                    path.resolve(this.docroot, 'index.html'),
                    dest
                );
            });
    }

    loadFile (src) {
        return new Promise((resolve, reject) => {
            if (!src) {
                reject(new Error('src is not found.'));
                return;
            }

            if (this.files[src]) {
                resolve(this.files[src]);
                return;
            }

            fsp.readFile(src, { encoding: 'utf8' }).then(
                (body) => {
                    this.files[src] = body;
                    resolve(body);
                },
                (err) => {
                    reject(new Error([
                        `fail to load file "${src}".`,
                        err.toString()
                    ].join('\n')));
                }
            );
        });
    }

    clearFile (src) {
        this.files[src] = null;
    }

    renderDocumentHTML (documentMarkdown) {
        return renderSlideSection(
            md.toHTMLTree(documentMarkdown)
        );
    }

    initDocRoot () {
        return fsp.mkdirp(this.docroot);
    }
};

module.exports = SectorSlide;
