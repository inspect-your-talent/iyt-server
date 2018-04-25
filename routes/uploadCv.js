var express = require('express');
var router = express.Router();
const { sendUploadToGCS, Vision, client } = require('../middlewares/uploadGCS')
const memUpload = require('../middlewares/multer')
const axios = require('axios');

const port = normalizePort(process.env.PORT || '3000');
const request = axios.create({
    baseURL: 'http://localhost:' + port
})

const mergeDataAndAnalyze = require('../libs/mergeAnalyze')

router.post('/', memUpload.single('image'), sendUploadToGCS, (req, res) => {

    client
        .textDetection(req.file.cloudStoragePublicUrl)
        .then(async results => {
            try {
                const text = results[0].fullTextAnnotation.text;
                let splitData = text.split('\n');
                let facebookProfile = '';
                let twitterProfile = '';
                let githubProfile = '';

                splitData.map((data, index) => {
                    const splitSpaceData = data.split(' ')
                    splitSpaceData.map(coreData => {
                        if (coreData.indexOf('twitter.com/') !== -1) {
                            // console.log(coreData, ' ini twitter')
                            let twitterRaw = coreData.split('/');
                            twitterProfile = twitterRaw[twitterRaw.length-1];;
                        }
                        if (coreData.indexOf('fb.com/') !== -1 || coreData.indexOf('facebook.com/') !== -1) {
                            // console.log(coreData, ' ini facebook')
                            let facebookRaw = coreData.split('/');
                            facebookProfile = facebookRaw[facebookRaw.length-1];;
                        }
                        if (coreData.indexOf('github.com/') !== -1) {
                            // console.log(coreData, ' ini github')
                            let githubRaw = coreData.split('/');
                            githubProfile = githubRaw[githubRaw.length-1];
                        }
                    })
                }
                );
                if (!facebookProfile && !twitterProfile && !githubProfile) {
                    return res.status(401).json({
                        message: 'No data found'
                    })
                }
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
            } catch (error) {
                return res.status(500).json({
                    message: 'Internal server error'
                })
            }
        })
        .catch(err => {
            console.error('ERROR:', err);
        });


});

module.exports = router;
