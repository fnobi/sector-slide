const path = require('path');

const optimist = require('optimist');
const colors = require('colors');

const SectorSlide = require('./SectorSlide');

(function () {
    const argv = optimist
              .boolean('h')
              .alias('h', 'help')
              .default('h', false)
              .describe('h', 'show this help.')
    
              .string('n')
              .alias('n', 'path-name')
              .default('n', 'slide')
              .describe('n', 'directory & path name.')
    
              .boolean('s')
              .alias('s', 'server')
              .default('s', false)
              .describe('s', 'start browser-sync server.')
    
              .boolean('verbose')
              .default('verbose', false)
              .describe('verbose', 'with detail log.')
    
              .argv;

    if (argv.h) {
        optimist.showHelp();
        return;
    }

    const src = argv._.shift();
    if (!src) {
        throw new Error('src is not found.');
    }

    const pathName = argv['path-name'];

    const sectorSlide = new SectorSlide({
        src: src,
        pathName: pathName
    });

    function startServer () {
        const browserSync = require('browser-sync');
        
        browserSync({
            server: {
                baseDir: pathName
            },
            files: `${pathName}/**/*`,
            startPath: '/',
            ghostMode: false
        });

        sectorSlide.startWatcher();
    }

    function log (category = '', body = '') {
        if (argv.verbose) {
            console.log(
                '[^_-]/'.green,
                category.cyan,
                body
            );
        }
    }
    
    function onError (err) {
        log('error');
        console.error(err);
    }

    sectorSlide.on('startBuild', () => {
        log('start');
    });

    sectorSlide.on('endBuild', () => {
        log('end');
    });

    sectorSlide.on('loadFile', (e) => {
        log('load', e.path);
    });
    
    sectorSlide.on('changeFile', (e) => {
        log('change', e.path);
    });

    sectorSlide.build().then(() => {
        if (argv.server) {
            startServer();
        }
    }, onError);
})();
