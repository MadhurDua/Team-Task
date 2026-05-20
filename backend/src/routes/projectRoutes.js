import { Router } from 'express';
import { addMember, createProject, deleteProject, getProject, listProjects, updateProject } from '../controllers/projectController.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { projectSchema } from '../validators/schemas.js';

export const projectRoutes = Router();

projectRoutes.use(protect);
projectRoutes.get('/', listProjects);
projectRoutes.post('/', restrictTo('admin'), validate(projectSchema), createProject);
projectRoutes.get('/:id', getProject);
projectRoutes.patch('/:id', restrictTo('admin'), updateProject);
projectRoutes.delete('/:id', restrictTo('admin'), deleteProject);
projectRoutes.post('/:id/members', restrictTo('admin'), addMember);
