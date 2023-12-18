const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const imageUploadController = require('./../controllers/imageUploadController');

const router = express.Router();

// Authencication route for login - logout
router.post('/login', authController.login); // ok
router.post('/logout', authController.logout); // ok

// pwd reset route for forget pwd  - reset pwd
router.post('/forgotPassword', authController.forgotPassword); // ok
router.patch('/resetPassword/:token', authController.resetPassword); // ok -> enkel mail template nog aanpassen

// Protect all routes from this point on
router.use(authController.protect);
// route for updating pwd
router.patch('/updateMyPassword', authController.updatePassword); // ok

// route for updateMe
router.get('/me', userController.getMe, userController.getUser); // ok
router.patch(
  '/updateMe', // ok
  imageUploadController.uploadImageFile,
  imageUploadController.resizeUserPhoto,
  userController.updateMe,
);
router.delete('/deleteMe', userController.deleteMe); // Partial, not allowing to actualy delete

// admin only from this poit on
router.use(authController.restrictTo('root', 'admin'));

router.post('/signup', authController.signUp); // TODO

router
  .route('/')
  .get(userController.getAllUsersOfCompany) // only api
  .post(userController.createUser); // not available use signup

router
  .route('/company/:id')
  .get(userController.getUserOfComapny) // only api
  .patch(userController.updateUserOfCompany); // only api

router
  .route('/deleteOfCompany/:id') // only api
  .patch(userController.softDeleteUserOfCompany); // Partial, not allowing to actualy delete

router.use(authController.restrictTo('root'));

router
  .route('/:id')
  .get(userController.getUser) // only api
  .patch(userController.updateUser) // only api
  .delete(userController.deleteUser); // only api

router
  .route('/')
  .get(userController.getAllUsers) // only api
  .post(userController.createUser); // not available use signup

router.route('/delete/:id').patch(userController.softDeleteUser); // only api

module.exports = router;
