import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';
import { Notification } from '../models/Notification.js';
import { sendInviteEmail } from '../services/emailService.js';
import { emitToProject, emitToUser } from '../sockets/io.js';
import { success } from '../utils/apiResponse.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const populateProject = (query) =>
  query.populate('owner', 'name email avatar role').populate('members.user', 'name email avatar title role');

export const listProjects = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Math.min(Number(req.query.limit || 12), 50);
  const filter = req.user.role === 'admin' ? { archived: false } : { archived: false, 'members.user': req.user._id };
  if (req.query.q) filter.$text = { $search: req.query.q };
  if (req.query.priority) filter.priority = req.query.priority;

  const [items, total] = await Promise.all([
    populateProject(Project.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit)),
    Project.countDocuments(filter)
  ]);

  success(res, items, 'Projects', 200, { page, total, pages: Math.ceil(total / limit) });
});

export const createProject = asyncHandler(async (req, res) => {
  const project = await Project.create({
    ...req.body,
    owner: req.user._id,
    members: [{ user: req.user._id, role: 'owner' }, ...(req.body.members || [])],
    activity: [{ message: 'Project created', actor: req.user._id }]
  });

  const populated = await populateProject(Project.findById(project._id));
  success(res, populated, 'Project created', 201);
});

export const getProject = asyncHandler(async (req, res) => {
  const project = await populateProject(Project.findById(req.params.id));
  if (!project) throw new AppError('Project not found', 404);
  const tasks = await Task.find({ project: project._id }).populate('assignee', 'name avatar title').sort({ order: 1 });
  success(res, { project, tasks }, 'Project');
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new AppError('Project not found', 404);
  Object.assign(project, req.body);
  project.activity.push({ message: 'Project updated', actor: req.user._id });
  await project.save();
  const populated = await populateProject(Project.findById(project._id));
  emitToProject(project._id, 'project:updated', populated);
  success(res, populated, 'Project updated');
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, { archived: true }, { new: true });
  if (!project) throw new AppError('Project not found', 404);
  emitToProject(project._id, 'project:deleted', { id: project._id });
  success(res, { id: project._id }, 'Project archived');
});

export const addMember = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new AppError('Project not found', 404);
  const user = await User.findOne({ email: req.body.email });
  if (!user) throw new AppError('User not found', 404);

  if (!project.members.some((member) => member.user.equals(user._id))) {
    project.members.push({ user: user._id, role: req.body.role || 'contributor' });
    project.activity.push({ message: `${user.name} joined the project`, actor: req.user._id });
    await project.save();
  }

  const notification = await Notification.create({
    user: user._id,
    title: 'Project invite',
    message: `${req.user.name} added you to ${project.name}`,
    type: 'invite',
    link: `/projects/${project._id}`
  });
  emitToUser(user._id, 'notification:new', notification);
  await sendInviteEmail({ to: user.email, projectName: project.name, inviter: req.user.name });

  const populated = await populateProject(Project.findById(project._id));
  success(res, populated, 'Member added');
});
