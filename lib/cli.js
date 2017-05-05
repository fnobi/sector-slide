const path = require('path');

const optimist = require('optimist');
const colors = require('colors');

const SectorSlide = require(__dirname + '/../');

(function () {
    const argv = optimist
              .boolean('h')
              .alias('h', 'help')
              .default('h', false)
              .describe('h', 'show this help.')
    
              .string('r')
              .alias('r', 'docroot')
              .describe('r', 'html document root.')
    
              .boolean('s')
              .alias('s', 'server')
              .default('s', false)
              .describe('s', 'start browser-sync server.')
    
              .argv;

    if (argv.h) {
        optimist.showHelp();
        return;
    }

    const src = argv._.shift();
    if (!src) {
        throw new Error('src is not found.');
    }

    const docroot = argv.r || `${path.dirname(src)}/.sector-slide`;

    const sectorSlide = new SectorSlide({
        src: src,
        docroot: docroot
    });

    function startServer () {
        const browserSync = require('browser-sync');
        
        browserSync({
            server: {
                baseDir: docroot
            },
            files: `${docroot}/**/*`,
            startPath: '/',
            ghostMode: false
        });

        sectorSlide.startWatcher();
    }

    function onError (err) {
        console.error('[error]'.red, err);
    }

    sectorSlide.on('end', () => {
        console.log('[done]'.green);
    });

    sectorSlide.build().then(() => {
        if (argv.server) {
            startServer();
        }
    }, onError);
})();
