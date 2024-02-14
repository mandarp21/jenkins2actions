var sass = require('gulp-sass');
var config = require('../config').sass;
var bourbon = require('bourbon').includePaths;
var neat = require('node-neat').includePaths;
var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded',
    includePaths: ['sass'].concat(bourbon, neat)
};

module.exports = function (gulp, plugins) {
    var sass = plugins.sass;
 //       sourcemaps = plugins.sourcemaps;
    var AUTOPREFIXER_BROWSERS = [

        'ie >= 8',

        'ie_mob >= 10',

        'ff >= 3.6',

        'chrome >= 10',

        'safari >= 4',

        'opera >= 11.10',

        'ios >= 7',

        'android >= 4.4',

        'bb >= 10'

    ];

    return function () {
        var stream = gulp
            .src(config.src)
        //  .pipe(sourcemaps.init())
            .pipe(sass(sassOptions).on('error', sass.logError))
            .pipe(plugins.autoprefixer(AUTOPREFIXER_BROWSERS))
         //   .pipe(sourcemaps.write())
            .pipe(gulp.dest(config.dest));
        return stream;
    };
};