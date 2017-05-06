const EventEmitter = require('events');
const path = require('path');

const _ = require('lodash');
const fsp = require('fs-promise');
const pug = require('pug');

const renderSlideSection = require('./lib/renderSlideSection');

const TEMPLATE_PUG = `${__dirname}/src/pug/index.pug`;
const CSS_CORE = `${__dirname}/src/css/core.css`;

class SectorSlide extends EventEmitter {
    constructor (opts = {}) {
        super();
        this.src = opts.src;
        this.docroot = opts.docroot;
        this.files = {};
    }

    build () {
        this.emit('startBuild');
        
        return Promise.all([
            this.loadFile(this.src),
            this.loadFile(TEMPLATE_PUG),
            this.loadFile(CSS_CORE),
            this.initDocRoot()
        ]).then((values) => {
            const document = values.shift();
            const pugTemplate = values.shift();
            const coreCSS = values.shift();
            
            const compilePug = pug.compile(pugTemplate, {
                pretty: false
            });

            return fsp.writeFile(
                path.resolve(this.docroot, 'index.html'),
                compilePug({
                    content: this.renderDocumentHTML(document),
                    style: [ coreCSS ].join('')
                })
            );
        }).then(
            () => { this.emit('endBuild'); },
            (err) => { this.emit('error', err); }
        );
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

            this.emit('loadFile', {
                path: src
            });

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

    renderDocumentHTML (markdown) {
        return renderSlideSection(markdown);
    }

    initDocRoot () {
        return fsp.mkdirp(this.docroot);
    }

    startWatcher () {
        const chokidar = require('chokidar');
        _.each(this.files, (content, src) => {
            chokidar.watch(src).on('change', (path) => {
                this.emit('changeFile', {
                    path: path
                });
                this.files[src] = null;
                this.build();
            });
        });
    }
};

module.exports = SectorSlide;
