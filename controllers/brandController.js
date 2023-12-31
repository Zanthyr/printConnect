const catchAsync = require('../utils/catchAsync');
const Brand = require('./../models/brandModel');
const factory = require('./handlerFactory');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const utils = require('../utils/utils');

// root only
exports.getAllBrands = factory.getAll(Brand);
exports.getBrand = factory.getOne(Brand);
exports.createBrand = factory.createOne(Brand);
exports.updateBrand = factory.updateOne(Brand);
exports.deleteBrand = factory.deleteOne(Brand);

exports.softDeleteBrand = factory.softDelete(Brand);

// gets a brand for a user by checking if the users copany is allowlisted
exports.getMyBrand = catchAsync(async (req, res, next, popOptions) => {
  let query = Brand.findById(req.params.id);
  if (popOptions) query = query.populate(popOptions);
  const doc = await query;

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  if (!doc.allowList.includes(req.user.company.id))
    return next(
      new AppError(
        'You can only request brand ower info if the brandowner grants acces!',
        401,
      ),
    );

  res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

// finds all brands for allowlisted users
exports.getAllMyBrands = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Brand.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const doc = await features.query;

  let newDoc = [];
  newDoc = doc.filter((element) => {
    if (element.allowList.includes(req.user.company.id)) return element;
  });

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: newDoc.length,
    data: {
      data: newDoc,
    },
  });
});

// BrandOwneradmin only
exports.createMyBrand = catchAsync(async (req, res, next) => {
  // add so taht when root we take the BO name -> covert it to id and then add the record

  const filteredBody = utils.filterObj(req.body, 'brandName', 'productGroup');
  filteredBody.brandOwner = req.user.company.id;
  // filteredBody.brandManagers = req.body.brandManagers.split(',');
  filteredBody.brandManagers =
    req.body.brandSuppliers.length !== 0
      ? req.body.brandManagers.split(',')
      : [];

  // filteredBody.brandSuppliers = req.body.brandSuppliers.split(',');
  filteredBody.brandSuppliers =
    req.body.brandSuppliers.length !== 0
      ? req.body.brandSuppliers.split(',')
      : [];

  if (req.file) filteredBody.brandLogo = req.file.filename;
  const doc = await Brand.create(filteredBody);

  res.status(201).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

// BrandOwneradmin only

exports.updateMyBrand = catchAsync(async (req, res, next) => {
  let query = Brand.findById(req.params.id);

  if (!query) {
    return next(new AppError('No document found with that ID', 404));
  }

  if (req.user.company.id !== query.brandOwner)
    return next(
      new AppError('You can only update users for your own company!', 401),
    );

  const doc = await Brand.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});
