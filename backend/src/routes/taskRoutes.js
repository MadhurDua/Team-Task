import { Router } from 'express';
import multer from 'multer';
import { addComment, createTask, deleteTask, listComments, listTasks, reorderTasks, updateTask } from '../controllers/taskController.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { commentSchema, taskSchema } from '../validators/schemas.js';

const upload = multer({ dest: 'uploads/' });
export const taskRoutes = Router();

taskRoutes.use(protect);
taskRoutes.get('/', listTasks);
taskRoutes.post('/', restrictTo('admin'), validate(taskSchema), createTask);
taskRoutes.patch('/reorder', reorderTasks);
taskRoutes.patch('/:id', updateTask);
taskRoutes.delete('/:id', restrictTo('admin'), deleteTask);
taskRoutes.post('/:id/comments', validate(commentSchema), addComment);
taskRoutes.get('/:id/comments', listComments);
taskRoutes.post('/:id/attachments', upload.single('file'), (req, res) => {
  res.status(201).json({ success: true, message: 'Attachment received', data: req.file });
});
