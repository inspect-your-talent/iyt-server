const express = require('express');
const router = express.Router();
const redis = require('redis');
const client = redis.createClient();

router.post('/:id', function (req, res, next) {
  client.get('candidates', function (err, reply) {
    console.log(req.body.candidate)
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

module.exports = router;
