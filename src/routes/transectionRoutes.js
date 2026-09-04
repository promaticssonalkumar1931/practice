const express = require('express');

const transectionController=require('../controllers/transectionController')
const { protectMainUser } = require('../middleware/authMiddleware');
const { protect } = require('../middleware/authMiddleware');


const router = express.Router();

router.post('/createTransection',protect,transectionController.createtransection);
router.post('/system/initialfund',protectMainUser,transectionController.initalfundbyMainuser);

module.exports = router;
