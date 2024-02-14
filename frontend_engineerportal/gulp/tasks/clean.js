const del = require('del');
var config = require('../config').clean;

module.exports = function (gulp, plugins, params) {
    return function() {
        return del(config[params.clean].src).then(paths => {
            console.log('Deleted files and folders:\n', paths.join('\n'));
        });
    };
};


