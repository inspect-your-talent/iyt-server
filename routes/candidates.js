const express = require('express');
const router = express.Router();
const redis = require('redis');
const client = redis.createClient();
const randomstring = require("randomstring");

router.post('/:id', function (req, res, next) {
  client.get('candidates', function (err, reply) {
    console.log(req.body.candidate)
    req.body.candidate.id = randomstring.generate(10);
    req.body.candidate.id_facebook = req.params.id;
    if(reply) {
      const result = JSON.parse(reply);
      result.push(req.body.candidate)
      client.set('candidates', JSON.stringify(result))
    } else {
      const candidates = [req.body.candidate]
      client.set('candidates', JSON.stringify(candidates))
    }
    res.status(200).json({
      message: "Success create data",
      data: req.body.candidate
    })
  })
});

router.get('/:id', function (req, res, next) {
  client.get('candidates', function (err, reply) {
    const candidates = JSON.parse(reply);
    const filtered = candidates.filter(data => {
      return data.id_facebook === req.params.id
    })
    res.status(200).json({
      message: "Success get data",
      data: filtered
    })
  })
});

router.get('/details/:id', function (req, res, next) {
  client.get('candidates', function (err, reply) {
    const candidates = JSON.parse(reply);
    const filtered = candidates.filter(data => {
      return data.id === req.params.id
    })
    res.status(200).json({
      message: "Success get data detail candidate",
      data: filtered
    })
  })
});

module.exports = router;
