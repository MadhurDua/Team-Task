import { User } from '../models/User.js';
import { success } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listUsers = asyncHandler(async (req, res) => {
  const q = req.query.q ? { $text: { $search: req.query.q } } : {};
  const users = await User.find(q).sort({ name: 1 }).limit(100);
  success(res, users, 'Users');
});

export const updateProfile = asyncHandler(async (req, res) => {
  const allowed = ['name', 'title', 'avatar', 'skills'];
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) req.user[key] = req.body[key];
  });
  await req.user.save();
  success(res, req.user, 'Profile updated');
});
