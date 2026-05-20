import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';
import { success } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const memberFilter = req.user.role === 'admin' ? {} : { assignee: req.user._id };
  const now = new Date();
  const [totalTasks, completedTasks, pendingTasks, overdueTasks, projects, team] = await Promise.all([
    Task.countDocuments(memberFilter),
    Task.countDocuments({ ...memberFilter, status: 'completed' }),
    Task.countDocuments({ ...memberFilter, status: { $ne: 'completed' } }),
    Task.countDocuments({ ...memberFilter, status: { $ne: 'completed' }, dueDate: { $lt: now } }),
    Project.find(req.user.role === 'admin' ? { archived: false } : { archived: false, 'members.user': req.user._id })
      .populate('members.user', 'name avatar title')
      .sort({ updatedAt: -1 })
      .limit(6),
    User.find().sort({ lastActiveAt: -1 }).limit(8)
  ]);

  const productivity = await Task.aggregate([
    { $match: { ...(req.user.role === 'admin' ? {} : { assignee: req.user._id }), updatedAt: { $gte: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 14) } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } }, completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } }, touched: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);

  const activity = await Task.find(memberFilter)
    .populate('assignee', 'name avatar')
    .populate('project', 'name color')
    .sort({ updatedAt: -1 })
    .limit(10);

  success(res, {
    stats: { totalTasks, completedTasks, pendingTasks, overdueTasks },
    productivity: productivity.map((day) => ({ date: day._id, completed: day.completed, touched: day.touched })),
    projects,
    team,
    activity
  }, 'Dashboard');
});
