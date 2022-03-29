const express = require('express');
const router = express.Router();

// Add your routes here - above the module.exports line
const multer = require('multer');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (_req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
const COST_PER_PDF = 30;

router.post('/application/7-upload-documents/form-handler', upload.array('documents'), (req, res) => {
  const docsFromForm = createDocumentArray(req.session.data.documents);
  const existingDocs = createDocumentArray(removeEmptyStringsFromArr(req.session.data.existingDocs));
  const docsClean = removeFilesWithIssues(docsFromForm, req);
  const totalDocuments = [...docsClean, ...existingDocs];

  req.session.data.cost = totalApplicationCost(totalDocuments);
  req.session.data.documents = totalDocuments;
  req.session.data.noOfDocs = totalUploadedDocuments(totalDocuments);
  res.redirect('/application/7-upload-documents');
});

function removeFilesWithIssues(docsFromForm, req) {
  const LARGE_FILE_NAME = 'large_file.pdf';

  const docsClean = docsFromForm.filter(docName => {
    switch(docName) {
      case LARGE_FILE_NAME:
        req.flash('errors', ['LARGE_FILE_ERROR']);
        break;
      default:
        return docName;
    }
  });

  req.session.data.errors = req.flash('errors');
  return docsClean;
}

router.post('/application/delete-file', (req, res) => {
  const copyOfDocuments = [...req.session.data.documents];
  const newDocumentsArray = copyOfDocuments.filter((document) => document !== req.body.document);

  req.session.data.noOfDocs = totalUploadedDocuments(newDocumentsArray);
  req.session.data.documents = newDocumentsArray;
  res.redirect('/application/7-upload-documents');
});

/**
 * @param {string | Array<string>} documents
 * @returns {Array<string>}
 */
function createDocumentArray(documents) {
  const onlyOneDocument = typeof documents === 'string';
  return onlyOneDocument ? [documents] : documents;
}

function removeEmptyStringsFromArr(existingDocs = []) {
  console.log(existingDocs, 'existingDocs')
  const docsArr = existingDocs.split(',');
  const filteredArr = docsArr.filter((doc) => doc !== '');

  return filteredArr;
}

/**
 * @param {string | Array<string>} documents
 * @returns {number}
 */
function totalApplicationCost(documents) {
  return documents.length * COST_PER_PDF;
}

function totalUploadedDocuments(totalDocs) {
  const noDocsUploded = totalDocs[0] === '';

  if (noDocsUploded) {
    return 0;
  }

  return totalDocs.length;
}

router.post('/application/sign-in/form-handler', (req, res) => {
  req.session.data.signedIn = true;
  res.redirect('/application/2-your-account');
});

// User continuing account setup process
router.get('/application/sign-in-authenticated', (_req, res) => {
  res.render('application/sign-in', {
    userAuthenticated: true,
    actionUrl: '/application/sign-in/continue-setup',
  });
});

router.post('/application/sign-in/continue-setup', (req, res) => {
  req.session.data.signedIn = true;
  res.redirect('/application/finish-account-setup');
});

// User with account continuing eApp flow
router.get('/application/sign-in-mid-flow', (_req, res) => {
  res.render('application/sign-in', {
    midFlow: true,
    actionUrl: '/application/sign-in/post-authentication',
  });
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

  res.redirect('/application/3a-before-you-apply');
});

router.post('/application/3a-before-you-apply', (req, res) => {
  if (req.session.data['before-you-apply'] === 'yes') {
    res.redirect('/application/4a-check-acceptance');
    return;
  }
  res.redirect('/application/sign-in-mid-flow');
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
  if (req.session.data['notarised-and-signed'] === 'yes') {
    res.redirect('/application/5a-how-to-complete-app');
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
