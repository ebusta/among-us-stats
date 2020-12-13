const catchAsync = require('../utils/catchAsync');

exports.getMain = catchAsync(async (req, res, next) => {
  res.status(200).render('mainPage', {
    title: 'main',
  });
});

exports.createNewGroup = catchAsync(async (req, res, next) => {
  res.status(200).render('addGroup', {
    title: 'Create new group',
  });
});

exports.getGroup = catchAsync(async (req, res, next) => {
  res.status(200).render('group', {
    title: 'Your group',
  });
});

exports.getPlayer = catchAsync(async (req, res, next) => {
  res.status(200).render('player', {
    title: res.player.player_name,
  });
});

exports.getLoginForm = catchAsync(async (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
});

exports.newGame = catchAsync(async (req, res, next) => {
  res.status(200).render('newgame', {
    title: 'New game',
  });
});

// NOT CURRENTLY IMPLEMENTED
// exports.updateUserData = catchAsync(async (req, res, next) => {
//   const updatedUser = await User.findByIdAndUpdate(
//     req.user.id,
//     {
//       name: req.body.name,
//       email: req.body.email,
//     },
//     {
//       new: true,
//       runValidators: true,
//     }
//   );
//   res.status(200).render('account', {
//     title: 'Your account',
//     user: updatedUser,
//   });
// });
