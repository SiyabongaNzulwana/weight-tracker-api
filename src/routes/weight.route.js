const express = require('express')
const weightController = require('../controllers/weight.controller')
const router = express.Router()

router.post('/save_weight', weightController.addWeight)
router.get('/get_weight_history', weightController.getUserWeightRecords)
router.delete('/delete_weight/:id', weightController.removeUserWeightRecord)
router.put('/update_weight/:id', weightController.updateUserWeightRecord)

module.exports = router
