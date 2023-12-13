const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getLogin = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  // 2) Build template
  // 3) Render that template using tour data from 1)
  res.status(200).render('login', {
    title: 'Login',
  });
});