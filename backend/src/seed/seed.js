import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { Comment } from '../models/Comment.js';
import { Notification } from '../models/Notification.js';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';

const users = [
  { name: 'Avery Chen', email: 'admin@taskflow.app', password: 'Password123!', role: 'admin', title: 'Product Lead', skills: ['Roadmap', 'Design Systems'] },
  { name: 'Maya Patel', email: 'maya@taskflow.app', password: 'Password123!', role: 'member', title: 'Frontend Engineer', skills: ['React', 'Motion'] },
  { name: 'Noah Brooks', email: 'noah@taskflow.app', password: 'Password123!', role: 'member', title: 'Backend Engineer', skills: ['Node', 'MongoDB'] },
  { name: 'Iris Morgan', email: 'iris@taskflow.app', password: 'Password123!', role: 'member', title: 'UX Designer', skills: ['Research', 'Prototyping'] }
];

const priorities = ['low', 'medium', 'high', 'urgent'];
const statuses = ['todo', 'in-progress', 'completed'];

async function run() {
  await connectDB();
  await Promise.all([User.deleteMany(), Project.deleteMany(), Task.deleteMany(), Comment.deleteMany(), Notification.deleteMany()]);

  const createdUsers = await User.create(users);
  const [admin, maya, noah, iris] = createdUsers;

  const projects = await Project.create([
    {
      name: 'Launch Command Center',
      description: 'Coordinate the public beta launch across product, growth, and support.',
      priority: 'urgent',
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 18),
      color: '#22d3ee',
      owner: admin._id,
      members: createdUsers.map((user, index) => ({ user: user._id, role: index === 0 ? 'owner' : 'contributor' })),
      activity: [{ message: 'Launch plan approved', actor: admin._id }]
    },
    {
      name: 'Mobile Collaboration',
      description: 'Tighten responsive workflows and mobile Kanban interactions.',
      priority: 'high',
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 28),
      color: '#a78bfa',
      owner: admin._id,
      members: [admin, maya, iris].map((user, index) => ({ user: user._id, role: index === 0 ? 'owner' : 'contributor' }))
    },
    {
      name: 'Realtime Reliability',
      description: 'Make live notifications and task updates resilient under load.',
      priority: 'medium',
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 40),
      color: '#34d399',
      owner: admin._id,
      members: [admin, noah].map((user, index) => ({ user: user._id, role: index === 0 ? 'owner' : 'contributor' }))
    }
  ]);

  const taskTemplates = [
    'Polish onboarding checklist',
    'Design invite email states',
    'Add optimistic task movement',
    'Write launch QA matrix',
    'Tune dashboard chart copy',
    'Instrument activity stream',
    'Review mobile sidebar',
    'Finalize Railway variables',
    'Audit RBAC edge cases'
  ];

  const tasks = [];
  for (const [projectIndex, project] of projects.entries()) {
    for (let i = 0; i < taskTemplates.length; i += 1) {
      tasks.push({
        title: taskTemplates[i],
        description: `Production pass for ${taskTemplates[i].toLowerCase()} in ${project.name}.`,
        project: project._id,
        creator: admin._id,
        assignee: [maya, noah, iris][i % 3]._id,
        status: statuses[(i + projectIndex) % statuses.length],
        priority: priorities[(i + projectIndex) % priorities.length],
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * (i - 2 + projectIndex * 5)),
        order: i,
        labels: ['launch', i % 2 ? 'frontend' : 'backend'],
        activity: [{ message: 'Task seeded', actor: admin._id }]
      });
    }
  }

  const createdTasks = await Task.create(tasks);
  await Comment.create({
    task: createdTasks[0]._id,
    user: iris._id,
    body: 'I added the latest prototype notes and flagged the empty-state animation.'
  });

  await Notification.create({
    user: maya._id,
    title: 'Welcome to TaskFlow',
    message: 'Your demo workspace is ready.',
    type: 'project',
    link: '/dashboard'
  });

  console.log('Seed complete');
  console.table(users.map(({ email, password, role }) => ({ email, password, role })));
  await mongoose.disconnect();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
