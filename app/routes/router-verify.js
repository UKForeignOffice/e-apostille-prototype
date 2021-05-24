const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line
router.post('/WhatTypeOfApostille/form-handler', function (req, res) {
  // Get the answer from session data
  // The name between the quotes is the same as the 'name' attribute on the input elements
  // However in JavaScript we can't use hyphens in variable names

  const apostilleType = req.session.data['typeofapostille']

  if (apostilleType === 'epostille') {
    res.redirect('/VerifyEApostille')
  } else {
    res.redirect('/VerifyPaper')
  }
})

router.post('/VerifyEApostille/form-handler', function (req, res) {

  const vcode = req.session.data['verificationcode']

  if (vcode === 'ABCD-1234-EFGH-5678') {
    res.redirect('/EApostilleVerified')
  } else {
    res.redirect('/EApostilleVerified')
  }
})

router.post('/VerifyPaper/form-handler', function (req, res) {

  const vcode = req.session.data['apostillenumber']

  if (vcode === 'APO-123') {
    res.redirect('/PaperVerified')
  } else {
    res.redirect('/PaperVerified')
  }
})

module.exports = router
