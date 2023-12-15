const express = require('express');
const jobController = require('./../controllers/jobController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.route('/').get(jobController.getAllJobs).post(jobController.createJob);

router.route('/:id').get(jobController.getJob).patch(jobController.updateJob);

router.use(authController.restrictTo('root'));

router.route('/:id').delete(jobController.deleteJob);

module.exports = router;
