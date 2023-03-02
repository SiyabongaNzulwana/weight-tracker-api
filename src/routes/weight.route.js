const express = require('express')
const weightController = require('../controllers/weight.controller')
const router = express.Router()

const auth = require('../middleware/auth')

router.post('/save_weight', auth, weightController.addWeight)
router.get(
  '/get_weight_history/:email',
  auth,
  weightController.getUserWeightRecords
)
router.delete(
  '/delete_weight/:id',
  auth,
  weightController.removeUserWeightRecord
)
router.put('/update_weight/:id', auth, weightController.updateUserWeightRecord)

module.exports = router
