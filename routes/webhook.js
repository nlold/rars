const express = require('express');
const router = express.Router();

/* webhook */
router.get('/webhook', (req, res, next) => {
  
  
  console.log('webhook')
});

module.exports = router;
