var config = require('../config').bundlejs;
module.exports = function (gulp, plugins, params) {
    return function () {
        var uglify = plugins.uglify,
            concat = plugins.concat;
        
        var stream = gulp.src(config[params.bundle].src)
            .pipe(concat(config[params.bundle].output))
            .pipe(uglify())
            .pipe(gulp.dest(config[params.bundle].dest));
        return stream;
    };
};