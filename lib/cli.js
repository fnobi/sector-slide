const path = require('path');

const colors = require('colors');

const SectorSlide = require('./SectorSlide');

(function () {
    const argv = require('yargs')
            .option('help', {
              type: 'boolean',
              alias: 'h',
              default: false,
              description: 'show this help.'
            })
            .option('path-name', {
              type: 'string',
              alias: 'n',
              default: 'slide',
              description: 'directory & path name.'
            })
            .option('server', {
              type: 'boolean',
              alias: 's',
              default: false,
              description: 'start browser-sync server.'
            })
            .option('verbose', {
              type: 'boolean',
              alias: 'v',
              default: false,
              description: 'with detail log.'
            })
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
                baseDir: path.resolve('.')
            },
            files: `${pathName}/**/*`,
            startPath: pathName,
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
