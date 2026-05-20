import { Comment } from '../models/Comment.js';
import { Notification } from '../models/Notification.js';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { emitToProject, emitToUser } from '../sockets/io.js';
import { success } from '../utils/apiResponse.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const populateTask = (query) =>
  query.populate('assignee', 'name avatar title email').populate('creator', 'name avatar email').populate('project', 'name color');

export const listTasks = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Math.min(Number(req.query.limit || 50), 100);
  const filter = {};
  if (req.query.project) filter.project = req.query.project;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.assignee) filter.assignee = req.query.assignee;
  if (req.query.q) filter.$text = { $search: req.query.q };
  if (req.user.role !== 'admin') filter.assignee = req.user._id;

  const [items, total] = await Promise.all([
    populateTask(Task.find(filter).sort({ order: 1, createdAt: -1 }).skip((page - 1) * limit).limit(limit)),
    Task.countDocuments(filter)
  ]);
  success(res, items, 'Tasks', 200, { page, total, pages: Math.ceil(total / limit) });
});

export const createTask = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.body.project);
  if (!project) throw new AppError('Project not found', 404);
  const task = await Task.create({ ...req.body, creator: req.user._id, activity: [{ message: 'Task created', actor: req.user._id }] });
  project.activity.push({ message: `Task created: ${task.title}`, actor: req.user._id });
  await project.save();

  const populated = await populateTask(Task.findById(task._id));
  if (task.assignee) {
    const notification = await Notification.create({
      user: task.assignee,
      title: 'New task assigned',
      message: task.title,
      type: 'task',
      link: `/kanban?project=${project._id}`
    });
    emitToUser(task.assignee, 'notification:new', notification);
  }
  emitToProject(project._id, 'task:created', populated);
  success(res, populated, 'Task created', 201);
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new AppError('Task not found', 404);
  Object.assign(task, req.body);
  task.activity.push({ message: 'Task updated', actor: req.user._id });
  await task.save();
  const populated = await populateTask(Task.findById(task._id));
  emitToProject(task.project, 'task:updated', populated);
  success(res, populated, 'Task updated');
});

export const reorderTasks = asyncHandler(async (req, res) => {
  await Promise.all(
    req.body.tasks.map((task) => Task.findByIdAndUpdate(task.id, { status: task.status, order: task.order }))
  );
  emitToProject(req.body.projectId, 'task:reordered', req.body.tasks);
  success(res, null, 'Tasks reordered');
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) throw new AppError('Task not found', 404);
  emitToProject(task.project, 'task:deleted', { id: task._id });
  success(res, { id: task._id }, 'Task deleted');
});

export const addComment = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new AppError('Task not found', 404);
  const comment = await Comment.create({ body: req.body.body, task: task._id, user: req.user._id });
  task.activity.push({ message: 'Comment added', actor: req.user._id });
  await task.save();
  const populated = await comment.populate('user', 'name avatar title');
  emitToProject(task.project, 'comment:created', { taskId: task._id, comment: populated });
  success(res, populated, 'Comment added', 201);
});

export const listComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ task: req.params.id }).populate('user', 'name avatar title').sort({ createdAt: -1 }).limit(50);
  success(res, comments, 'Comments');
});
