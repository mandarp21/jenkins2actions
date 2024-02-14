var config = require('../config').pagespeed;
var pagespeed = require('psi').output;
module.exports = function (gulp, plugins, params) {
    return function(){
        // Update the below URL in config to the public URL of your site
        pagespeed(config[params.pagedetails].url, {
          strategy: config[params.pagedetails].strategy
          // By default we use the PageSpeed Insights free (no API key) tier.
          // Use a Google Developer API key if you have one: http://goo.gl/RkN0vE
          // key: 'YOUR_API_KEY'
        });
    };
};