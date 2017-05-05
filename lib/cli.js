const optimist = require('optimist');
const colors = require('colors');

const SectorSlide = require(__dirname + '/../');

(function () {
    const argv = optimist
              .boolean('h')
              .alias('h', 'help')
              .default('h', false)
              .describe('h', 'show this help.')
              .argv;

    if (argv.h) {
        optimist.showHelp();
        return;
    }

    const src = argv._.shift();

    const sectorSlide = new SectorSlide({
        src: src
    });

    sectorSlide.on('end', () => {
        console.log('[done]'.green);
    });

    sectorSlide.on('error', (err) => {
        console.error('[error]'.red, err);
    });

    sectorSlide.start().then(
        (html) => {
            console.log(html);
        },
        (err) => {
            console.error(err);
        }
    );
})();
