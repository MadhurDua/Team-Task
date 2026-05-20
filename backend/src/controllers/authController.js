import { User } from '../models/User.js';
import { signToken } from '../services/tokenService.js';
import { success } from '../utils/apiResponse.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const authPayload = (user) => ({ user, token: signToken(user) });

export const signup = asyncHandler(async (req, res) => {
  const exists = await User.findOne({ email: req.body.email });
  if (exists) throw new AppError('Email is already registered', 409);
  const user = await User.create(req.body);
  success(res, authPayload(user), 'Account created', 201);
});

export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select('+password');
  if (!user || !(await user.comparePassword(req.body.password))) {
    throw new AppError('Invalid email or password', 401);
  }
  user.lastActiveAt = new Date();
  await user.save();
  success(res, authPayload(user), 'Welcome back');
});

export const me = asyncHandler(async (req, res) => {
  success(res, req.user, 'Current user');
});
