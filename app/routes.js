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
const COST_PER_PDF = 30;


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

function eAppRoutes() {
  router.post('/application/eApp/eligibility-question-one-answers', (req, res) => {
    const path =
      req.session.data['eapostille-acceptable'] === 'yes'
        ? '/application/eApp/eligibility-question-two'
        : '/application/eApp/eligibility-quesiton-one-fail';

    return res.redirect(path);
  });

  router.post('/application/eApp/eligibility-question-two-answers', (req, res) => {
    const path =
      req.session.data['notarised-and-signed'] === 'yes'
        ? '/application/eApp/info-based-on-answers'
        : '/application/eApp/eligibility-quesiton-one-fail';

    return res.redirect(path);
  });

  router.post('/application/eApp/upload-documents/form-handler', upload.array('documents'), (req, res) => {
    req.session.data.cost = totalApplicationCost(req.body.documents);
    req.session.data.documents = documentNames(req.body.documents);
    req.session.data.noOfDocs = req.session.data.documents.length;
    res.redirect('/application/eApp/user-reference');
  });

  router.post('/application/eApp/user-reference-answer', (_req, res) =>
    res.redirect('/application/eApp/summary-page')
  );
}

function standardAppRoutes() {
  router.post('/application/standardApp/your-details-answer', (_req, res) =>
    res.redirect('/application/standardApp/return-address')
  );

  router.post('/application/standardApp/return-address-form-answer', (_req, res) =>
    res.redirect('/application/standardApp/return-if-cant-legalise')
  );
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
  let accountRedirect = "/application/8-complete-standard";
  let path = '/application/4a-is-document-certified'

  if (documentFormat === 'pdf') {
    accountRedirect = "/application/eApp/how-to-complete";
    path = '/application/eapp/eligibility-question-one';
  }

  req.session.data['account-redirect'] = accountRedirect;
  res.redirect(path);
});

router.post('/application/4a-is-document-certified-answer', (req, res) => {
  const isDocumentCertified = req.session.data['document-certified'];
  const path =
    isDocumentCertified === 'yes' ? '/application/5-important-info' : '/application/5a-get-document-certified';

  return res.redirect(path);
});

router.post('/application/7-create-online-account-answer', (req, res) => {
  const createAccount = req.session.data['create-account'];
  const path = createAccount === 'yes' ? '/application/7a-register-page' : '/application/8-complete-standard';

  return res.redirect(path);
});

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

eAppRoutes();
standardAppRoutes();

module.exports = router;
