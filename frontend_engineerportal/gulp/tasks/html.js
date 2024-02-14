var config = require('../config').html;
module.exports = function (gulp, plugins) {
    return function () {
        
        var stream = gulp.src(config.src)

            .pipe(plugins.if('*.html', plugins.htmlmin({
                removeComments: true,
                collapseWhitespace: false,
                collapseBooleanAttributes: false,
                removeAttributeQuotes: false,
                removeRedundantAttributes: false,
                removeEmptyAttributes: false,
                removeScriptTypeAttributes: false,
                removeStyleLinkTypeAttributes: false,
                removeOptionalTags: false,
                removeEmptyElements: false
            })))
            .pipe(gulp.dest(config.dest));

        return stream;
    };
};
