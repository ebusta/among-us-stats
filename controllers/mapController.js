const Map_ = require('../models/mapModel');
const catchAsync = require('../utils/catchAsync');
//const AppError = require('../utils/appError');

// exports.getAllMaps = catchAsync(async (req, res, next) => {
//   const maps = await Map.getAllMaps();
//   res.status('200').json({
//     status: 'success',
//     results: maps.length,
//     data: {
//       maps,
//     },
//   });
// });

exports.getAllMaps = catchAsync(async (req, res, next) => {
  const maps = await Map_.getAllMaps();
  req.maps = maps;
  res.locals.maps = maps;
  return next();
});
