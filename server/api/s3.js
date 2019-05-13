const AWS = require('aws-sdk');
// const config = require('../../secrets');


(async function() {
  try {
    AWS.config.setPromisesDependency();
    AWS.config.update({
      accessKeyId: 'AKIA22FZ4DBBYBERP2EM',
      secretAccessKey: '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',
      region: 'us-east-1'
    });

    const s3 = new AWS.S3();
    const response = await s3.listObjectsV2({
      Bucket: 'playpus-music-data',
      Prefix: 'Taylor Swift - reputation'
    });

    console.log(response);
  } catch (error) {
    console.log(error);
  }
})();

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
