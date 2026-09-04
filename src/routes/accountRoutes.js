const express = require('express');
const accountController=require('../controllers/account')
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create-account', protect,accountController.createAccount);
router.get('/getAccount',protect,accountController.getAccount)
router.get('/getbalance/:id',accountController.getbalance)

module.exports = router;
