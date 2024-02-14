var config = require('../config').html_replace;
module.exports = function (gulp, plugins, params) {
    return function () {
        var htmlreplace = plugins.htmlReplace;
        var stream = gulp.src(config[params.html_replace].src)
            .pipe(htmlreplace(config[params.html_replace].bundle_name))
            .pipe(gulp.dest(config[params.html_replace].dest));
        return stream;
    };

};