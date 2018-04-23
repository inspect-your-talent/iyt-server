const express = require('express');
const router = express.Router();
const User = require('../models/users.model');

/* GET users listing. */

//create user
router.post('/', function(req, res, next) {
  User.create({
    facebook_id: req.body.facebook_id,
    name: req.body.name,
    email: req.body.email,
  }).then(response => {
    res.status(201).json({
      message: 'User Created',
      data: response
    })
    .catch(err => {
      res.status(500).json({
        message: 'Internal server error',
        err
      })
    })
  })
});

//get user by id
router.get('/:id', function(req, res, next) {
  User.findOne({
    'facebook_id': req.body.facebook_id,
  }).then(response => {
    res.status(201).json({
      message: 'Get user success',
      data: response
    })
    .catch(err => {
      res.status(500).json({
        message: 'Internal server error',
        err
      })
    })
  })
});

module.exports = router;
