var gulp = require('gulp');
var runSequence = require('run-sequence');
var plugins = require('gulp-load-plugins')();

function getTask(task, params) {
    
    return require('./gulp/tasks/' + task)(gulp, plugins, params);
}

gulp.task('copy:assets', getTask('copy', { 
    copy: 'assets'
}));

gulp.task('clean:fed_all', getTask('clean', {clean: 'fed_all'}));
gulp.task('clean:temp', getTask('clean', {clean: 'temp'}));
gulp.task('bundle:js', getTask('bundlejs', { bundle: 'js'}));
gulp.task('bundle:css', getTask('bundlejs', { bundle: 'css'}));
gulp.task('pagespeed', getTask('pagespeed', { pagedetails: 'urldetails'}));
gulp.task('html', getTask('html', { html: 'html' }));
gulp.task('compile:sass', getTask('saas', {saas: 'saas'}));
gulp.task('html-replace:fed', getTask('html_replace', { html_replace: 'fed_app'}));

gulp.task('build', () => {
    
    runSequence(
        'clean:fed_all',
     //   'copy:html',
     //   'copy:assets',
     //   'bundle:js',
        'compile:sass',
        'bundle:css',
        'clean:temp',
    );
});