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
  console.log(req.session.data.documents, 'docs');
  req.session.data.noOfDocs = totalUploadedDocuments(req);
  res.redirect('/application/8-user-reference');
});

function totalUploadedDocuments(req) {
  const noDocsUploded = req.session.data.documents[0] === '';

  if (noDocsUploded) {
    return 0;
  }

  return req.session.data.documents.length;
}

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

(function signInGetRequests() {
  router.get('/application/sign-in-mid-flow', (_req, res) => {
    res.render('application/sign-in', {
      midFlow: true,
      actionUrl: '/application/sign-in/post-authentication',
    });
  });

  router.get('/application/sign-in-authenticated', (_req, res) => {
    res.render('application/sign-in', {
      userAuthenticated: true,
      actionUrl: '/application/sign-in/post-authentication',
    });
  });
})();


router.post('/application/sign-in/form-handler', (req, res) => {
  req.session.data.signedIn = true;
  res.redirect('/application/2-your-account');
});

router.post('/application/sign-in/post-authentication', (req, res) => {
  req.session.data.signedIn = true;
  res.redirect('/application/7-upload-documents');
});

router.post('/application/3-which-service/form-handler', (req, res) => {
  if (req.session.data['service'] === 'standard-service') {
    res.redirect('/application/standard-service-document-check');
    return;
  }

  if (req.session.data['service'] === 'premium-service') {
    res.redirect('/application/page-not-created');
    return;
  }

  res.redirect('/application/4a-check-acceptance');
});

router.post('/application/4a-check-acceptance/form-handler', (req, res) => {
  if (req.session.data['documents-eligible'] === 'yes') {
    res.redirect('/application/4-check-documents');
    return;
  }
  res.redirect('/application/4a-check-acceptance-fail');
});

router.post('/application/4-check-documents/form-handler', (req, res) => {
  if (req.session.data['eapostille-acceptable'] === 'yes') {
    res.redirect('/application/5-check-notarised-and-signed');
    return;
  }
  res.redirect('/application/4-check-documents-fail');
});

router.post('/application/5-check-notarised-and-signed/form-handler', (req, res) => {
  const redirectUrl = req.session.data.signedIn ? '/application/7-upload-documents' : '/application/create-an-account';

  if (req.session.data['notarised-and-signed'] === 'yes') {
    res.redirect(redirectUrl);
    return;
  }
  res.redirect('/application/5-check-notarised-and-signed-fail');
});

router.post('/verify/VerifyApostille/form-handler', (req, res, next) => {
  const apostillenumber = req.session.data['apostillenumber'];
  if (apostillenumber === 'APO-1234567') {
    res.redirect('/verify/PaperVerified');
  } else {
    res.redirect('/verify/EApostilleVerified');
  }
});

router.post('/application/create-an-account', (req, res) => {
  req.session.data.signedIn = true;
  res.redirect('/application/activate-your-account');
});

router.get('/application/sign-out', (req, res) => {
  req.session.data.signedIn = false;
  res.redirect('/application/sign-in');
});

module.exports = router;
