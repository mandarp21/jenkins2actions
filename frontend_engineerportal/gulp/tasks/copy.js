var config = require('../config').copy;
module.exports = function (gulp, plugins, params) {
    return function(){
        console.log('Copying:' + params.copy );
        var stream = gulp.src(config[params.copy].src, { cwd: config[params.copy].cwd }) 
            .pipe(gulp.dest(config[params.copy].dest));
        return stream;
    };
};