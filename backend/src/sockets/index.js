import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { setSocketServer } from './io.js';

export function initSockets(io) {
  setSocketServer(io);

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));
    try {
      socket.user = jwt.verify(token, env.jwtSecret);
      return next();
    } catch {
      return next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    socket.join(`user:${socket.user.id}`);

    socket.on('project:join', (projectId) => socket.join(`project:${projectId}`));
    socket.on('project:leave', (projectId) => socket.leave(`project:${projectId}`));
  });
}
