var express = require('express');
var router = express.Router();
const {sendUploadToGCS} = require('../middlewares/uploadGCS')
const memUpload = require('../middlewares/multer')

router.post('/', memUpload.single('image'), sendUploadToGCS, (req, res ) => {
    res.status(200).json({
        message: 'Success to upload image',
        data: req.file.cloudStoragePublicUrl})
});

module.exports = router;