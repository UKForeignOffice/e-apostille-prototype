const express = require('express');
const router = express.Router();

// Add your routes here - above the module.exports line
const multer = require('multer');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
const UPLOADS_PATH = '/application/7-upload-documents/form-handler';
const COST_PER_PDF = 30;

router.post(UPLOADS_PATH, upload.array('documents'), (req, res) => {
  req.session.data.cost = totalApplicationCost(req.body.documents);
  req.session.data.documents = documentNames(req.body.documents);
  req.session.data.noOfDocs = req.session.data.documents.length;
  res.redirect('/application/8-user-reference');
});

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
  const onlyOneDocument = typeof documents === 'string';

  return onlyOneDocument ? [documents] : documents;
}

router.post('/application/1-who-are-you-answer', (req, res) => {
  const whoAreYou = req.session.data['who-are-you'];

  if (whoAreYou === 'new-user') {
    return res.redirect('/application/2-search-for-documents');
  }

  if (whoAreYou === 'existing-user') {
    return res.redirect('/application/sign-in');
  }

  res.redirect('/error-pages/generic');
});

router.post('/application/3-document-format-answer', (req, res) => {
  const documentFormat = req.session.data['document-format'];

  if (documentFormat === 'pdf') {
    return res.redirect('/application/eapp/eligibility-question-one');
  }

  res.redirect('/application/4a-is-document-certified');
});

router.post('/application/4a-is-document-certified-answer', (req, res) => {
  const isDocumentCertified = req.session.data['document-certified'];

  if (isDocumentCertified === 'yes') {
    return res.redirect('/application/5-important-info');
  }

  res.redirect('/application/5a-get-document-certified');
});

router.post('/application/eApp/eligibility-question-one-answers', (req, res) => {
  if (req.session.data['eapostille-acceptable'] === 'yes') {
    return res.redirect('application/eApp/eligibility-question-two');
  }
  res.redirect('/application/eApp/eligibility-quesiton-one-fail');
});


// router.post('/application/sign-in/form-handler', (_req, res) => {
//   res.redirect('/application/2-your-account');
// });

// router.post('/application/3-which-service/form-handler', (req, res) => {
//   if (req.session.data['service'] === 'standard-service') {
//     res.redirect('/application/standard-service-document-check');
//     return;
//   }

//   if (req.session.data['service'] === 'premium-service') {
//     res.redirect('/application/standard-service-document-check');
//     return;
//   }

//   res.redirect('/application/4a-check-acceptance');
// });

// router.post('/application/4-check-documents/form-handler', (req, res) => {
//   if (req.session.data['documents-eligible'] === 'yes') {
//     res.redirect('/application/5-check-notarised-and-signed');
//     return;
//   }
//   res.redirect('/application/4-check-documents-fail');
// });

// router.post('/application/5-check-notarised-and-signed/form-handler', (req, res) => {
//   if (req.session.data['notarised-and-signed'] === 'yes') {
//     res.redirect('/application/6-start-eapostille');
//     return;
//   }
//   res.redirect('/application/5-check-notarised-and-signed-fail');
// });

router.post('/verify/VerifyApostille/form-handler', (req, res) => {
  const apostillenumber = req.session.data['apostillenumber'];
  if (apostillenumber === 'APO-1234567') {
    res.redirect('/verify/PaperVerified');
  } else {
    res.redirect('/verify/EApostilleVerified');
  }
});

router.post('/application/document-search-answer', (req, res) => {
  const searchResults = req.session.data.search;

  if (searchResults === 'degree certificate') {
    return res.redirect('/application/2a-search-for-documents-degree');
  }

  res.redirect('/error-pages/generic');
});

module.exports = router;
