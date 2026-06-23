const express = require('express');
const router = express.Router();
const publicController = require('../controllers/public.controller');

router.get('/services', publicController.getServices);
router.get('/packages', publicController.getPackages);
router.post('/bookings', publicController.createBooking);
router.get('/feedbacks', publicController.getFeedbacks);
router.post('/consultation', publicController.createConsultation);
router.post('/chat', publicController.handleChat);

module.exports = router;
