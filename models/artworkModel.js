const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema(
  {
    artworkId: {
      type: String,
      unique: true,
      required: [true, 'The artwork must have clear identification'],
    },
    artworkVersion: {
      type: Number,
      default: 1,
      select: false,
    },
    artworkName: {
      type: String,
      required: [true, 'The artwork must have a name'],
    },
    artworkDescription: {
      type: String,
    },
    artworkForBrand: {
      type: mongoose.Schema.ObjectId,
      ref: 'Brand',
    },
    brandOwner: {
      type: mongoose.Schema.ObjectId,
      ref: 'Company',
    },
    createdByCompany: {
      type: mongoose.Schema.ObjectId,
      ref: 'Company',
    },
    artworkImage: {
      type: String,
    },
    printJobs: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Job',
      },
    ],
    artworkCreator: {
      type: mongoose.Schema.ObjectId,
      ref: 'Company',
      required: [true, 'The artwork have a creator (company ID)'],
    },
    sharedwithComapnies: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Company',
      },
    ],
    artworkColors: [
      {
        coords: [Number],
        color: { type: mongoose.Schema.ObjectId, ref: 'Color' },
      },
    ],
    artworkState: {
      type: Number,
      default: 1,
      select: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

artworkSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'artworkCreator',
    select: 'companyName',
  })
    .populate({
      path: 'artworkColors',
      populate: {
        path: 'color',
        select: 'colorName values',
      },
    })
    .populate({
      path: 'artworkForBrand',
      select: 'brandName',
    })
    .populate({
      path: 'printJobs',
      select: 'jobId printerName submitJobToken submitJobExpires createdAt',
    });
  next();
});

// dont return deactivated accounts when 'find' query
artworkSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

const Artwork = mongoose.model('Artwork', artworkSchema);

module.exports = Artwork;
