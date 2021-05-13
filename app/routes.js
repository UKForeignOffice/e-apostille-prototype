const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line
router.post('/verify/WhatTypeOfApostille/form-handler', function (req, res) {
  // Get the answer from session data
  // The name between the quotes is the same as the 'name' attribute on the input elements
  // However in JavaScript we can't use hyphens in variable names

  const apostilleType = req.session.data['typeofapostille']

  if (apostilleType === 'epostille') {
    res.redirect('/verify/VerifyEApostille')
  } else {
    res.redirect('/verify/VerifyPaper')
  }
})

router.post('/verify/VerifyEApostille/form-handler', function (req, res) {

  const vcode = req.session.data['verificationcode']

  if (vcode === 'ABCD-1234-EFGH-5678') {
    res.redirect('/verify/EApostilleVerified')
  } else {
    res.redirect('/verify/EApostilleVerified')
  }
})

router.post('/verify/VerifyPaper/form-handler', function (req, res) {

  const vcode = req.session.data['apostillenumber']

  if (vcode === 'APO-123') {
    res.redirect('/verify/PaperVerified')
  } else {
    res.redirect('/verify/PaperVerified')
  }
})

module.exports = router
