import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'sonner';
import { useAuthStore } from '../store/authStore';
import { useWorkspaceStore } from '../store/workspaceStore';
import type { Task } from '../lib/types';

export function useSocket(projectId?: string) {
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!token) return undefined;

    let socket: ReturnType<typeof io> | undefined;
    const connectTimer = window.setTimeout(() => {
      socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5050', {
        auth: { token },
        transports: ['websocket', 'polling']
      });

      if (projectId) socket.emit('project:join', projectId);

      socket.on('notification:new', (notification) => toast(notification.title, { description: notification.message }));
      socket.on('task:created', (task: Task) => {
        const { tasks, setTasks } = useWorkspaceStore.getState();
        if (!tasks.some((item) => item._id === task._id)) setTasks([task, ...tasks]);
      });
      socket.on('task:updated', (updated: Task) => {
        const { tasks, setTasks } = useWorkspaceStore.getState();
        setTasks(tasks.map((task) => (task._id === updated._id ? updated : task)));
      });
      socket.on('task:deleted', ({ id }: { id: string }) => {
        const { tasks, setTasks } = useWorkspaceStore.getState();
        setTasks(tasks.filter((task) => task._id !== id));
      });
    }, 50);

    return () => {
      window.clearTimeout(connectTimer);
      if (socket) {
        if (projectId && socket.connected) socket.emit('project:leave', projectId);
        socket.close();
      }
    };
  }, [projectId, token]);
}
