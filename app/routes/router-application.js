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

router.post(UPLOADS_PATH, upload.array('documents'), (req, res) => {
  req.session.data.cost = totalApplicationCost(req.body.documents);
  req.session.data.documents = documentNames(req.body.documents);
  req.session.data.noOfDocs = req.session.data.documents.length;
  res.redirect('/application/8-user-reference');
})

/**
 * @param {string | Array<string>} documents
 * @returns {number}
 */
function totalApplicationCost(documents) {
  const onlyOneDocument = typeof documents === 'string' && documents !== '';
  const totalDocumentCost = documents.length * COST_PER_PDF;

  return onlyOneDocument ? 30 : totalDocumentCost;
}

/**
 * @param {string | Array<string>} documents
 * @returns {Array<string>}
 */
function documentNames(documents) {
  const onlyOneDocument = typeof documents === "string";

  return onlyOneDocument ? [documents] : documents;
}

router.post('/sign-in/form-handler', (req, res, next) => {

  res.redirect('/application/2-your-account')
});

router.post('/3-which-service/form-handler', (req, res, next) => {
  if (req.session.data['service'] === 'standard-service') {
    res.redirect('/application/standard-service-document-check');
    return
  }

  if (req.session.data['service'] === 'premium-service') {
    res.redirect('/application/standard-service-document-check');
    return
  }

  res.redirect("/application/4a-check-acceptance");
});

router.post('/4a-check-acceptance/form-handler', (req, res, next) => {
  if (req.session.data['eapostille-acceptable'] === 'yes') {
    res.redirect("/application/4-check-documents");
    return
  }
  res.redirect('/application/4a-check-acceptance-fail')
});

router.post('/4-check-documents/form-handler', (req, res, next) => {
  if (req.session.data['documents-eligible'] === 'yes') {
    res.redirect("/application/5a-saved-as-pdf");
    return
  }
  res.redirect('/application/4-check-documents-fail')
});

router.post('/5-documents-certified-check/form-handler', (req, res, next) => {
  if (req.session.data['documents-certified'] === 'yes') {
    res.redirect("/application/6-start-eapostille");
    return
  }
  res.redirect('/application/5-documents-certified-check-fail')
});

router.post('/5a-saved-as-pdf/form-handler', (req, res, next) => {
  if (req.session.data['saved-as-pdf'] === 'yes') {
    res.redirect("/application/6-start-eapostille");
    return
  }
  res.redirect("/application/5a-saved-as-pdf-fail");
});

module.exports = router;
