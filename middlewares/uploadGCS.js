const Storage = require('@google-cloud/storage');
const Vision = require('@google-cloud/vision');
const config = {
  CLOUD_BUCKET: 'e-commerce.rezapramudhika.com',
  PROJECT_ID: 'e-commerce',
}

// prepare storage
const storage = Storage({
  projectId: config.PROJECT_ID,
  keyFilename: 'reza-pramudhika-da139832d53a.json'
});

const client = new Vision.ImageAnnotatorClient({
  projectId: config.PROJECT_ID,
  keyFilename: 'reza-pramudhika-da139832d53a.json',
});


// set which bucket
const bucket = storage.bucket(config.CLOUD_BUCKET);

// just a helper to create absolute path to GCS
function getPublicUrl (filename) {
  return `https://storage.googleapis.com/${config.CLOUD_BUCKET}/${filename}`;
}

// the real middleware
function sendUploadToGCS (req, res, next) {
  if (!req.file) {
    console.log('fail here uploadGCS line 24')
    return next('upload mungkin gagal');
  }

  const gcsname = 'img/' + Date.now() + '.' + req.file.originalname.split('.').pop();
  const file = bucket.file(gcsname);

  // prepare the stream
  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    }
  });

  // handle when upload error
  stream.on('error', (err) => {
    req.file.cloudStorageError = err;
    console.log(err)
    console.log('fail here uploadGCS line 41')
    next(err); 
  });

  // handle when upload finish
  stream.on('finish', () => {
    req.file.cloudStorageObject = gcsname;
    file.makePublic(). //make the uploaded file public
      then(() => {
        req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
        next();
      });
  });

  // write the file
  stream.end(req.file.buffer);
}

module.exports = {
  sendUploadToGCS,
  Vision,
  client
};