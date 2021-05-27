const express = require('express')
const router = express.Router()
const multer = require('multer')

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage })
const UPLOADS_PATH = '/upload-documents/form-handler'

router.post(UPLOADS_PATH, upload.single('pdf'), (req, res, next) => {
  res.redirect('/application/additional-information')
})
//
// router.get('/results', (req, res, next) => {
//   if (req.session.data.pdf) {
//     try {
//       next()
//     } catch (err) {
//       console.error(err);
//       res.redirect(`/error?message=${err.message}`)
//     }
//   }
// })

router.post('/sign-in/form-handler', (req, res, next) => {

  res.redirect('/application/your-details')
});

module.exports = router;
