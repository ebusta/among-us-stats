const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const Group = require('../models/groupModel');
const Player = require('../models/playerModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
//const sendEmail = require('./../utils/email');

// const sendRes = (res, statusCode, status, data) => {
//   res.status(statusCode).json({
//     status: status,
//     results: data.length,
//     data,
//   });
// };

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (group, statusCode, req, res) => {
  const token = signToken(group[0].group_id);
  res.cookie('jwt', token, {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure, //|| req.headers.x-forwarded-proto === 'https',
  });

  //sendRes()

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      group_id: group[0].group_id,
      group_name: group[0].group_name,
      player_games: group[1] ? group[1] : null,
    },
  });
};

exports.createGroup = catchAsync(async (req, res, next) => {
  const newGroup = await Group.createGroup(req.body);
  if (!newGroup) {
    return next(new AppError('This group name already exists. Please choose a new one.', 400));
  }
  // if the create group request has players attached to it
  if (req.body.players) {
    const newPlayerGroupIDs = await Promise.all(
      req.body.players.map(async (el) => {
        const playerID = await Player.getPlayerIDByName(el.player_name);
        // if player already exists, don't create a new player
        if (playerID.length === 1) {
          const newPlayerGroupID = await Group.createPlayerGroup(playerID[0].player_id, newGroup[0].group_id);
          return newPlayerGroupID;
        }
        // player doesn't exist, create a new player
        const newPlayerID = await Player.createPlayer(el.player_name);
        const newPlayerGroupID = await Group.createPlayerGroup(newPlayerID[0].player_id, newGroup[0].group_id);
        //console.log(newPlayerID[0], newPlayerGroupID[0]);
        return [newPlayerID[0], newPlayerGroupID[0]];
      })
    );
    //console.log(newPlayerGroupIDs);
    createSendToken([newGroup[0], newPlayerGroupIDs], 201, req, res);
  } else {
    // if the create group request has no players attached to it
    createSendToken([newGroup[0]], 201, req, res);
  }
});

exports.login = catchAsync(async (req, res, next) => {
  const { groupName, pword } = req.body;

  // 1) Check if group and pword are in request
  if (!groupName || !pword) {
    return next(new AppError('Please provide group name and password!', 400));
  }

  // 2) Check if group exists and if password is correct
  const group = await Group.findGroupByName(groupName);

  if (!group || !(await Group.correctPassword(pword, group[0].pword))) {
    return next(new AppError('Incorrect group name or password', 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(group, 200, req, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000), // set to maybe 50 ms?
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentGroup = await Group.checkIfGroupExists(decoded.id);
  if (!currentGroup) {
    return next(new AppError('The user belonging to this token does no longer exist.', 401));
  }

  // 4) Check if user changed password after the token was issued - NOT IMPLEMENTING FOR NOW
  // if (currentUser.changedPasswordAfter(decoded.iat)) {
  //   return next(new AppError('User recently changed password! Please log in again.', 401));
  // }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentGroup;
  res.locals.user = currentGroup;
  next();
});

// Only for rendered pages, won't throw any errors
//TODO: Refactor when used
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) Verifies token
      const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

      // 2) Check if user still exists
      const currentUser = await Group.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

// NOT CURRENTLY IMPLEMENTED
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
  };
};

// NOT CURRENTLY IMPLEMENTED, WILL REQUIRE REFACTORING
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await Group.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, req, res);
});

// NOT CURRENTLY IMPLEMENTED, WILL REQUIRE REFACTORING
exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await Group.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(user, 200, req, res);
});
