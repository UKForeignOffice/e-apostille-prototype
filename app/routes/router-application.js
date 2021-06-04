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
const UPLOADS_PATH = '/7-upload-documents/form-handler'
const COST_PER_PDF = 30;

router.post(UPLOADS_PATH, upload.array('pdf'), (req, res, next) => {
  req.session.data.cost = req.body.pdf.length * COST_PER_PDF
  res.redirect('/application/8-additional-information')
})

router.post('/sign-in/form-handler', (req, res, next) => {

  res.redirect('/application/2-your-account')
});

router.post('/4-check-documents/form-handler', (req, res, next) => {
  if (req.session.data['documents-eligible'] === 'yes') {
    res.redirect('/application/5-documents-certified-check')
    return
  }
  res.redirect('/application/4-check-documents-fail')
});

router.post('/5-documents-certified-check/form-handler', (req, res, next) => {
  if (req.session.data['documents-certified'] === 'yes') {
    res.redirect('/application/6-start-eapostille')
    return
  }
  res.redirect('/application/5-documents-certified-check-fail')
});

module.exports = router;
