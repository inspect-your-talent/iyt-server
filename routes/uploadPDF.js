const express = require('express');
const router = express.Router();
const axios = require('axios');
const multer  = require('multer')
const fs = require("fs");
const PDFParser = require("pdf2json");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'storage')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.pdf')
  }
})

const upload = multer({ storage: storage })

const PdfReader = require('pdfreader')
const mergeDataAndAnalyze = require('../libs/mergeAnalyze')

const port = normalizePort(process.env.PORT || '3000');
const request = axios.create({
    baseURL: 'http://localhost:' + port
})

router.post('/', upload.single('cv_file'), (req, res) => {

    var rows = {}; // indexed by y-position
    async function printRows() {
      try {
        const text = [];
        Object.keys(rows) // => array of y-positions (type: float)
          .sort((y1, y2) => parseFloat(y1) - parseFloat(y2)) // sort float positions
          .forEach((y) => {
            // console.log((rows[y] || []).join(''))
            text.push((rows[y] || []).join(''))
          });

          let facebookProfile = '';
          let twitterProfile = '';
          let githubProfile = '';

          let checkTwitter = await text.find(e => e.search('twitter') >= 0)
          let checkFacebook = await text.find(e => e.search('facebook') >= 0)
          let checkGithub = await text.find(e => e.search('github') >= 0)

          if (checkTwitter) {
              let twitterRaw = checkTwitter.split('/');
              twitterProfile = twitterRaw[twitterRaw.length-1]
          }
          if (checkFacebook) {
              let facebookRaw = checkFacebook.split('/');
              facebookProfile = facebookRaw[facebookRaw.length-1]
          }
          if (checkGithub) {
              let githubRaw = checkGithub.split('/');
              githubProfile = githubRaw[githubRaw.length-1]
          }

          console.log(facebookProfile, twitterProfile, githubProfile);
          if (!facebookProfile && !twitterProfile && !githubProfile) {
              //
              // return res.status(401).json({
              //     message: 'No data found'
              // })
          } else {
            // console.log(twitterProfile, githubProfile, facebookProfile)
            const twitterAnalyzing = await request.get(`/twitter/${twitterProfile}`);
            const facebookAnalyzing = await request.get(`/facebook/${facebookProfile}`)
            const githubAnalyzing = await request.get(`/github/${githubProfile}`)

            const resultIsProgrammer = mergeDataAndAnalyze(twitterAnalyzing.data, facebookAnalyzing.data)
            let obj = {
                facebookProfile,
                twitterProfile,
                githubProfile,
                twitterAnalyzing: twitterAnalyzing.data,
                facebookAnalyzing: facebookAnalyzing.data,
                githubAnalyzing: githubAnalyzing.data,
                isProgrammer: resultIsProgrammer
            }

            console.log(obj)
            return res.status(200).json({
                message: 'Success to upload image',
                data: obj
            })
          }

      } catch (e) {
        return res.status(500).json({
            message: 'Internal server error'
        })
      }


    }

    new PdfReader.PdfReader().parseFileItems(req.file.path, function(err, item){
      if (!item || item.page) {
        // end of file, or page
        printRows();
        rows = {}; // clear rows for next page
      }
      else if (item.text) {
        // accumulate text items into rows object, per line
        (rows[item.y] = rows[item.y] || []).push(item.text);
      }
    });

})

module.exports = router;
