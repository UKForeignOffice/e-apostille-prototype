const express = require('express')
const router = express.Router()

router.post('/sign-in/form-handler', (req, res, next) => {

  res.redirect('/application/your-details')
});

module.exports = router;
