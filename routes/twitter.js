const express = require('express');
const router = express.Router();
const Scraper = require('../libs/scrapper')
const cheerio = require('cheerio');
const axios = require('axios');

/* GET users listing. */
router.get('/:username', function (req, res, next) {
  const scraper = new Scraper({
    baseUrl: 'https://twitter.com/'
  });

  scraper.scrape(`/${req.params.username}`, function (err, $) {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Something Went Wrong" })
      return;
    }
    
    const name = $("a.ProfileHeaderCard-nameLink").text()
    const posts = $("p.js-tweet-text").map(function () {
      return $(this).text();
    }).get();
    const profileHeader = $("p.ProfileHeaderCard-bio").text()
    const linkWebsiteRaw = $("a.u-textUserColor").text().split('\n')[13]
    if (linkWebsiteRaw) {
      var linkWebsite = linkWebsiteRaw.trim()
    } else {
      var linkWebsite = ''
    }
    const history = $("span.ProfileNav-value").map(function () {
      return $(this).text();
    }).get()
    const tweets = history[0].split('\n')[0]
    const following = history[1].split('\n')[0]
    const followers = history[2].split('\n')[0]

    const checkSA = posts.join(' ')
    
    axios.post(`http://klinikkosasih.com/sentiment-analysist/run/index.php`, {
      string: checkSA
    })
      .then((response) => {
        res.status(200).json({
          message: "success",
          name,
          profileHeader,
          linkWebsite,
          tweets,
          following,
          followers,
          posts,
          score: response.data
        })
      })
      .catch((err) => {
        console.log(err)
      })
  })
});

module.exports = router;
