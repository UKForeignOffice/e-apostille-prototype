const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line
router.post('/VerifyApostille/form-handler', (req, res, next) => {

  const apostillenumber = req.session.data['apostillenumber']
  if (apostillenumber === 'APO-1234567') {
    res.redirect('/verify/PaperVerified')
  } else {
    res.redirect('/verify/EApostilleVerified')
  }
})

module.exports = router
