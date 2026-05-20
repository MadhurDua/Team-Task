import { Notification } from '../models/Notification.js';
import { success } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
  success(res, notifications, 'Notifications');
});

export const markRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, _id: { $in: req.body.ids || [] } }, { read: true });
  success(res, null, 'Notifications updated');
});
