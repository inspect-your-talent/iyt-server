var express = require('express');
var router = express.Router();
const {sendUploadToGCS, Vision, client} = require('../middlewares/uploadGCS')
const memUpload = require('../middlewares/multer')

router.post('/', memUpload.single('image'), sendUploadToGCS, (req, res ) => {

    client
        .textDetection(req.file.cloudStoragePublicUrl)
        .then(results => {

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
                            facebookProfile = coreData;
                        }
                        if (coreData.indexOf('fb.com/') !== -1 || coreData.indexOf('facebook.com/') !== -1) {
                            // console.log(coreData, ' ini facebook')
                            twitterProfile = coreData;
                        }
                        if (coreData.indexOf('github.com/') !== -1) {
                            // console.log(coreData, ' ini github')
                            githubProfile = coreData
                        }
                    })
                }
            );

            return res.status(200).json({
                message: 'Success to upload image',
                data: req.file.cloudStoragePublicUrl,
                facebookProfile,
                twitterProfile,
                githubProfile,
            })


        })
        .catch(err => {
            console.error('ERROR:', err);
        });


});

module.exports = router;