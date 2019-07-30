const EventEmitter = require('events');
const path = require('path');

const _ = require('lodash');
const fs = require('mz/fs');
const mkdir = require('mkdir-promise');
const pug = require('pug');

const renderSlideSection = require('./renderSlideSection');

const TEMPLATE_PUG = `${__dirname}/../template/index.pug`;
const CSS_CORE = `${__dirname}/../template/core.css`;
const JS_CORE = `${__dirname}/../template/core.js`;

class SectorSlide extends EventEmitter {
    constructor (opts = {}) {
        super();
        this.src = opts.src;
        this.pathName = opts.pathName;
        this.files = {};
    }

    build () {
        this.emit('startBuild');
        
        return Promise.all([
            this.loadFile(this.src),
            this.loadFile(TEMPLATE_PUG),
            this.loadFile(CSS_CORE),
            this.loadFile(
                path.resolve(this.pathName, 'custom.css'),
                { optional: true }
            ),
            this.loadFile(JS_CORE),
            this.initDirectory()
        ]).then((values) => {
            const document = values.shift();
            const pugTemplate = values.shift();
            const coreCSS = values.shift();
            const customCSS = values.shift();
            const coreJS = values.shift();
            
            const compilePug = pug.compile(pugTemplate, {
                pretty: false
            });

            return fs.writeFile(
                path.resolve(this.pathName, 'index.html'),
                compilePug({
                    content: this.renderDocumentHTML(document),
                    style: [ coreCSS, customCSS ].join(''),
                    script: [ coreJS ].join('')
                })
            );
        }).then(
            () => { this.emit('endBuild'); },
            (err) => { this.emit('error', err); }
        );
    }

    loadFile (src, opts={}) {
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

            fs.readFile(src, { encoding: 'utf8' }).then(
                (body) => {
                    this.files[src] = body;
                    resolve(body);
                },
                (err) => {
                    if (opts.optional) {
                        resolve('');
                    } else {
                        reject(new Error([
                            `fail to load file "${src}".`,
                            err.toString()
                        ].join('\n')));
                    }
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

    initDirectory () {
        return mkdir(this.pathName);
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
