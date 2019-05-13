const AWS = require('aws-sdk');
const config = require('../../secrets');
const router = require('express').Router()

// we are able to find using params.  The issue is how to store the data in the DB.  Having trouble figuring out how to store all of the MP3 Data such as artist and artwork, track duration etc.

//Access key ID
const accessKey = 'AKIA22FZ4DBBYBERP2EM'

//secret access key
 const secretKey = '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'


const s3Func = async (album) => {
  try {
    AWS.config.setPromisesDependency();
    AWS.config.update({
      accessKeyId: config.accessKey,
      secretAccessKey: config.secretKey,
      region: 'us-east-1'
    });


    const s3 = new AWS.S3();
    const response = await s3.listObjectsV2({
      Bucket: 'platypus-music-data',
      Prefix: album
    }).promise();

    console.log("WE DID IT!!!", response);
    return response
  } catch (error) {
    console.log('ERROR MESSAGE MANG ', error);
  }
};


router.get('/:song', async (req, res, next) => {

  try {
    let album = req.params.song


    console.log('*****album in route: ', req.params.song);
    console.log('*****album in route: ', req.body);

    album = "Taylor Swift"

    const returnedAlbum = await s3Func(album)

    console.log(returnedAlbum)
    res.json(returnedAlbum)
  } catch (error) {
    next(error)
  }
})





module.exports = router

// router.get('/', async (req, res, send) => {
//     try {
//       AWS.config.setPromisesDependency()
//       AWS.config.update({
//         accessKeyId:  'AKIA22FZ4DBBYBERP2EM',
//         secretAccessKey: '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',
//         region:'us-east-1'
//       });

//       const s3 = new AWS.S3()
//       const response = await s3.listObjectsV2({
//         Bucket: 'playpus-music-data'
//       })

//       console.log(response)

//     } catch (error) {
//       console.error('this is the error s3', error)
//     }

//   }
// )

// module.exports = router

// const Busboy = require('busboy');
// module.exports = (app) => {
//   // The following is an example of making file upload with
//   // additional body parameters.
//   // To make a call with PostMan
//   // Don't put any headers (content-type)
//   // Under body:
//   // check form-data
//   // Put the body with "element1": "test", "element2": image file
//   app.post('/upload', function (req, res, next) {
//    // This grabs the additional parameters so in this case passing
//    // in "element1" with a value.
//    const element1 = req.body.element1;
//    var busboy = new Busboy({ headers: req.headers });
//    // The file upload has completed
//    busboy.on('finish', function() {
//     console.log('Upload finished');
//     // Your files are stored in req.files. In this case,
//     // you only have one and it's req.files.element2:
//     // This returns:
//     // {
//     //    element2: {
//     //      data: ...contents of the file...,
//     //      name: 'Example.jpg',
//     //      encoding: '7bit',
//     //      mimetype: 'image/png',
//     //      truncated: false,
//     //      size: 959480
//     //    }
//     // }
//     // Grabs your file object from the request.
//     const file = req.files.element2;
//     console.log(file);
//    });
//    req.pipe(busboy);
//   });
// }
