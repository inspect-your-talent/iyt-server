var express = require('express');
var router = express.Router();
const Scraper = require('../libs/scrapper')
const cheerio = require('cheerio');

/* GET users listing. */
router.get('/:id', function(req, res, next) {
  const id = req.params.id
  var scraper = new Scraper({
      baseUrl: 'https://github.com'
  });

  scraper.scrape(`/${id}`, function(err, $) {
    if (err) {
      console.log(err);
      res.status(500).json({message: "Something Went Wrong"})
      return;
    }

    var name = $('span.vcard-fullname').text();
    const username = $('span.vcard-username').text();
    let contribution = $('div.js-contribution-graph > h2').text()
    let split = contribution.split(' ')
    contribution = split[6]
    let counter = $('span.Counter ').text().split(' ').filter( count => {
      return count !== '' && count !== '\n'
    })
    const repo = counter[0].replace( '\n', '')
    const stars = counter[1].replace( '\n', '')
    const follower = counter[2].replace( '\n', '')
    const following = counter[3].replace( '\n', '')
    scraper.scrape(`/${id}/?tab=repositories`, function(err, $) {
      if (err) {
        console.log(err);
        res.status(500).json({message: "Something Went Wrong"})
        return;
      }
      let languages = $('span[itemprop=programmingLanguage]')
        .text()
        .split(' ')
        .filter( language => {
          return language !== '' && language !== '\n'
        })
        .map( language => {
          return language.replace('\n', '')
        })
      res.json({
        name,
        username,
        contribution,
        repo,
        stars,
        follower,
        following,
        languages
      })
    })
  });
});

module.exports = router;
