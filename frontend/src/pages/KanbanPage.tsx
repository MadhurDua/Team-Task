import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { DndContext, useDraggable, useDroppable, type DragEndEvent } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { CalendarDays, ClipboardList, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { PageTransition } from '../components/PageTransition';
import { Select } from '../components/Select';
import { useSocket } from '../hooks/useSocket';
import type { Project, Task, TaskStatus } from '../lib/types';
import { cn, formatDate, isOverdue } from '../lib/utils';
import { useWorkspaceStore } from '../store/workspaceStore';
import { useAuthStore } from '../store/authStore';

const columns: { id: TaskStatus; label: string }[] = [
  { id: 'todo', label: 'Todo' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'completed', label: 'Completed' }
];

export function KanbanPage() {
  const { tasks, projects, fetchTasks, fetchProjects, updateTask, createTask } = useWorkspaceStore();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ title: '', project: '', assignee: '', priority: 'medium', status: 'todo' });
  const user = useAuthStore((state) => state.user);
  useSocket(draft.project || undefined);

  useEffect(() => { fetchProjects(); fetchTasks(); }, [fetchProjects, fetchTasks]);

  const grouped = useMemo(() => Object.fromEntries(columns.map((col) => [col.id, tasks.filter((task) => task.status === col.id)])) as Record<TaskStatus, Task[]>, [tasks]);
  const selectedProject = useMemo(() => projects.find((project) => project._id === draft.project), [draft.project, projects]);
  const totalTasks = tasks.length;

  async function onDragEnd(event: DragEndEvent) {
    const taskId = event.active.id as string;
    const status = event.over?.id as TaskStatus | undefined;
    if (!status || !columns.some((col) => col.id === status)) return;
    await updateTask(taskId, { status });
    toast.success('Task moved');
  }

  async function submitTask(event: FormEvent) {
    event.preventDefault();
    await createTask({ ...draft, assignee: draft.assignee || undefined } as any);
    toast.success('Task created');
    setDraft({ title: '', project: '', assignee: '', priority: 'medium', status: 'todo' });
    setOpen(false);
  }

  async function assignTask(taskId: string, assignee: string) {
    await updateTask(taskId, { assignee: assignee || undefined } as any);
    toast.success(assignee ? 'Task assigned' : 'Task unassigned');
  }

  return (
    <PageTransition>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-sm text-cyan-200">Realtime board</p><h1 className="mt-2 text-4xl font-black">Kanban</h1></div>
        {user?.role === 'admin' && <Button icon={<Plus size={17} />} onClick={() => setOpen(true)}>New task</Button>}
      </div>

      {!totalTasks && (
        <div className="glass mb-6 flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cyan-300/15 text-cyan-200">
              <ClipboardList size={20} />
            </div>
            <div>
              <h2 className="font-bold">{user?.role === 'admin' ? 'No tasks on the board yet' : 'No assigned tasks yet'}</h2>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                {user?.role === 'admin'
                  ? 'Create a task and choose an assignee so members can see it on their Kanban board.'
                  : 'Ask an admin to assign a task to your account. Members only see tasks assigned to them.'}
              </p>
            </div>
          </div>
        </div>
      )}

      <DndContext onDragEnd={onDragEnd}>
        <div className="grid gap-4 lg:grid-cols-3">
          {columns.map((column) => (
            <Column
              key={column.id}
              id={column.id}
              label={column.label}
              tasks={grouped[column.id] || []}
              projects={projects}
              isAdmin={user?.role === 'admin'}
              onAssign={assignTask}
            />
          ))}
        </div>
      </DndContext>

      <Modal open={open} title="Create task" onClose={() => setOpen(false)}>
        <form onSubmit={submitTask} className="space-y-4">
          <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Task title" required />
          <Select value={draft.project} onChange={(e) => setDraft({ ...draft, project: e.target.value })} required>
            <option value="">Choose project</option>
            {projects.map((project) => <option key={project._id} value={project._id}>{project.name}</option>)}
          </Select>
          <Select value={draft.assignee} onChange={(e) => setDraft({ ...draft, assignee: e.target.value })}>
            <option value="">Unassigned</option>
            {selectedProject?.members.map((member) => (
              <option key={member.user._id} value={member.user._id}>{member.user.name} ({member.user.email})</option>
            ))}
          </Select>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select value={draft.priority} onChange={(e) => setDraft({ ...draft, priority: e.target.value })}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option></Select>
            <Select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}><option value="todo">Todo</option><option value="in-progress">In Progress</option><option value="completed">Completed</option></Select>
          </div>
          <Button className="w-full">Create task</Button>
        </form>
      </Modal>
    </PageTransition>
  );
}

function Column({
  id,
  label,
  tasks,
  projects,
  isAdmin,
  onAssign
}: {
  id: TaskStatus;
  label: string;
  tasks: Task[];
  projects: Project[];
  isAdmin: boolean;
  onAssign: (taskId: string, assignee: string) => void;
}) {
  const { isOver, setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={cn('min-h-[560px] rounded-2xl border border-white/10 bg-white/[0.04] p-3 transition', isOver && 'border-cyan-300/50 bg-cyan-300/5')}>
      <div className="mb-3 flex items-center justify-between px-2 py-1"><h2 className="font-bold">{label}</h2><span className="rounded-full bg-white/10 px-2 py-1 text-xs">{tasks.length}</span></div>
      <div className="space-y-3">
        {tasks.map((task) => <TaskCard key={task._id} task={task} projects={projects} isAdmin={isAdmin} onAssign={onAssign} />)}
        {!tasks.length && <div className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-slate-500">No tasks here</div>}
      </div>
    </div>
  );
}

function TaskCard({
  task,
  projects,
  isAdmin,
  onAssign
}: {
  task: Task;
  projects: Project[];
  isAdmin: boolean;
  onAssign: (taskId: string, assignee: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task._id });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;
  const projectId = typeof task.project === 'string' ? task.project : task.project?._id;
  const project = projects.find((item) => item._id === projectId);

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      layout
      className={cn('cursor-grab rounded-xl border border-white/10 bg-ink/80 p-4 shadow-xl transition hover:-translate-y-1 hover:border-cyan-300/30 active:cursor-grabbing', isDragging && 'z-50 opacity-70', isOverdue(task.dueDate, task.status) && 'border-rose-300/40 bg-rose-950/30')}
    >
      <div className="flex items-start justify-between gap-3"><h3 className="font-semibold leading-6">{task.title}</h3><span className="rounded-full bg-white/10 px-2 py-1 text-[11px] uppercase text-slate-300">{task.priority}</span></div>
      <p className="mt-2 line-clamp-2 text-sm text-slate-400">{task.description || 'No description yet.'}</p>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-500"><span className="flex items-center gap-1"><CalendarDays size={13} />{formatDate(task.dueDate)}</span><span>{task.assignee?.name || 'Unassigned'}</span></div>
      {isAdmin && (
        <div className="mt-3" onPointerDown={(event) => event.stopPropagation()}>
          <Select
            className="py-2 text-xs"
            value={task.assignee?._id || ''}
            onChange={(event) => onAssign(task._id, event.target.value)}
          >
            <option value="">Unassigned</option>
            {project?.members.map((member) => (
              <option key={member.user._id} value={member.user._id}>{member.user.name}</option>
            ))}
          </Select>
        </div>
      )}
    </motion.div>
  );
}
