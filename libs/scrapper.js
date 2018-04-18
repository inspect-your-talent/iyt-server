var cheerio = require('cheerio');
var extend = require('extend');
var request = require('request');

module.exports = function(userOptions) {
  var options = extend({
    method: 'GET',
    baseUrl: '',
    gzip: true,
    forever: true,
    headers: {
      'Cache-Control': 'max-age=0',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36',
    },
  }, userOptions);

  function scrape(url, callback) {
    var req = getRequestInstance();

    req(url, function(error, response, body) {
      if (error) {
        return callback(error);
      }

      if (response.statusCode !== 200) {
        return callback(new Error('Failed to scrape the page.'));
      }

      var $ = cheerio.load(body);

      return callback(null, $);
    });
  }

  function getRequestInstance() {
    return request.defaults(options);
  }

  return {
    scrape: scrape,
  };
};
