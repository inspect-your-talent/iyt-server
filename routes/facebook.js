const express = require('express');
const router = express.Router();
const Scraper = require('../libs/scrapper')
const cheerio = require('cheerio');

router.get('/:username', function (req, res, next) {
    const id = req.params.id
    let scraper = new Scraper({
        baseUrl: 'https://facebook.com'
    });

    scraper.scrape(`/${req.params.username}`, function (err, $) {
        if (err) {
            console.log(err);
            res.status(500).json({ message: "Something Went Wrong" })
            return;
        }

        let experiences = $('li.experience').map(function () {
            return $(this).text();
        }).get();

        let rawFavorites = $('table.profileInfoTable > tbody > tr > td').map(function () {
            return $(this).text();
        }).get().filter((fav) =>  fav !== '');

        let favorites = rawFavorites.join(', ').split(', ');

        let photo_profile = $('div.photoContainer > div > div > img.img').attr('src');

        let name = $('span#fb-timeline-cover-name').text();

        res.json({
            name,
            photo_profile,
            experiences,
            favorites
        })
    });
});

module.exports = router;