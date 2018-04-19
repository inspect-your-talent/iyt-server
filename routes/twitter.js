var express = require('express');
var router = express.Router();
const Scraper = require('../libs/scrapper')
const cheerio = require('cheerio');

/* GET users listing. */
router.get('/', function(req, res, next) {
  var scraper = new Scraper({
      baseUrl: 'https://twitter.com/sitirohimahzha'
  });

  scraper.scrape(`/`, function(err, $) {
    if (err) {
      console.log(err);
      res.status(500).json({message: "Something Went Wrong"})
      return;
    }
    const name = $("a.ProfileHeaderCard-nameLink").text()
    const posts = $("p.js-tweet-text").map(function() {
      return $(this).text();
    }).get();
    const profileHeader = $("p.ProfileHeaderCard-bio").text()
    const linkWebsite = $("a.u-textUserColor").text().split('\n')[13].trim()
    const history = $("span.ProfileNav-value").map(function(){
      return $(this).text();
    }).get()
    const tweets = history[0].split('\n')[0]
    const following = history[1].split('\n')[0]
    const followers = history[2].split('\n')[0]
    const likes = history[3].split('\n')[0]
    console.log(linkWebsite)
      res.json({
        message: "success",
        name,
        profileHeader,
        linkWebsite,
        tweets,
        following,
        followers,
        likes,
        posts
      })
    })
});

module.exports = router;
